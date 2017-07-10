/*
	ACCEJAX - Accessible use of history api to load content and have the ability to go back to your previous spot in a 'load more' list
  
  Use:
          accejax.init({
            item: [
              {
                container: "#maincontainer", // container can be an ID or a Class
                target: ".ajax-item__link",
                targetwrap: ".ajax-item"
              },{
                container: "#test-area",
                target: ".test-link"
              }
            ],
            skipcontent: "#skiptocontent",
            classes: {
              hovering: '.lorum',
              refocus: '.ipsum',
              bookmark: '.dolor',
            }
          }); 
          
*/

/* Accejax core */
var accejax = {
    init : function(args){
        var len = args["item"].length;
        for (var i = 0; i < len; i++){
          // if required arguments are there, add them to the function object
          if( args["item"][i]["container"] && 
             	args["item"][i]["target"] && 
             	args["skipcontent"] ){
            this.store["item"] = args["item"];
          } else {
            if(!args["item"][i]["container"]){
              console.error("Accejax Err - Please define 'item' => ["+i+"] => 'container'");
            } 
            if(!args["item"][i]["target"]){
              console.error("Accejax Err - Please define 'item' => ["+i+"] => 'target'");
            }
            if(!args["skipcontent"]){
              console.error("Accejax Err - Please define 'skipcontent'");
            }
            return;
          }
        }
      	if(args["skipcontent"]){
        	this.store["skipcontent"] = args["skipcontent"];
        } else {
          console.error("Accejax Err - Please define 'skipcontent'");
          return;
        } 
        for (var key in args["classes"]) {
          if (args["classes"].hasOwnProperty(key)) {
            var check = args["classes"][key].trim()[0];
            if(check == "." || check == "#"){
              // add new class to matching key if they are valid, make into a class if is a id
              this.store["classes"][key] = "."+args["classes"][key].trim().substring(1);
              this.store["classes"][key+"_name"] = args["classes"][key].trim().substring(1);
            } else {
              // if invalid (missing '.' or "#'), turn into a class and add to matching key
              this.store["classes"][key] = "."+args["classes"][key].trim();
              this.store["classes"][key+"_name"] = args["classes"][key].trim();
            }
          }
        }
      	// create event listeners
        this.listeners();
    },
    listeners: function(){
      	// listeners for defined link 'item's
        var existingItems =  this.store["item"];
        var len = existingItems.length;
        for (var i = 0; i < len; i++){
          // closure for the click event so the variables dont leak | src: https://stackoverflow.com/a/19586183
          (async function () { 
            var key = i;
          	var target = existingItems[i]["target"];
            $(document).on("click", target, function(e) { 
              // prevent click event
              e.preventDefault();
              // run the 'call' function (defined above so it can be nested in the event)
              accejax.call(e,key);
              // stop the click from propagating further up the DOM
              e.stopPropagation();
            });
          }()); 
        }
      	// listener for skipt to content button when its avaliable
        var bookmarkClassName = this.store["classes"]["bookmark_name"];
      	var returnClassName = this.store["classes"]["returntolastclick_name"];
        $(document).on("click", "."+returnClassName, function(e) { 
          // prevent click event
          e.preventDefault();
          // focus on bookmarked element
          $("a."+bookmarkClassName+"_link").focus();
          // stop the click from propagating further up the DOM
          e.stopPropagation();
        });
    },
    call: function(e,key){
        // Check target & href are valid
        try {
        	var existingItems =  this.store["item"];
          var clickTarget = e.currentTarget;
          var clickHref = e.currentTarget.getAttribute("href");
        } catch (err) {
          return console.error("Accejax Err - A valid target destination was not found");
        }
        // add class to target, so we can animate it later
        var targetWrap = existingItems[key]["targetwrap"];
        this.bookmark(clickTarget, targetWrap);
        // create object for existing content
        var container = existingItems[key]["container"];
        var currentState = {
          content: $(container).html(),
          url: window.location.href,
          title: document.title,
          container: container,
          distance: $(document).scrollTop()
        };
        // create/overwrite current page object in History API
        history.replaceState(currentState, currentState["title"], currentState["url"]);
        // get new content & push that state to History API
        this.requestContent(clickHref, container);
    },
  	requestContent: function(clickHref, container){
        var startRequestContent = $.get(clickHref, function(data) {
          // get new title
          var newTitle = $(data).filter("title").text();
          $("title").html(newTitle);
          // get new content
          var newContent = $(data).filter(container).html();
          if(newContent){
          	$(container).html(newContent);
          } else {
            // use 'find()' if 'filter()' returns undefined
          	var newContent = $(data).find(container).html();
          	$(container).html(newContent);
          }
          // object for new page data
          var newState = {
            content: newContent,
            url: clickHref,
            title: newTitle,
            container: container
          };
          // push new page to history
          history.pushState(newState, newState["title"], newState["url"]);
          accejax.focusTop(newTitle);
        	accejax.focusSkipContent();
        }).fail(function() {
          console.error("Accejax Err - There was an error loading the next page");
        });
    },
  	popContent: function(state, container) {
        $(container).html(state["content"]);
        $("title").html(state["title"]);
        accejax.focusTop(state["title"]);
        accejax.focusSkipContent();
      	(async function () {
        	accejax.bookmark();
        }());
      	(async function () {
        	accejax.refocus(state["distance"]);
        }());
    },
    bookmark: function(clickTarget, targetWrap){
        var bookmarkClassName = this.store["classes"]["bookmark_name"];
      	if (clickTarget) {
          $("."+bookmarkClassName).removeClass(bookmarkClassName);
          $("."+bookmarkClassName+"_link").removeClass(bookmarkClassName+"_link");
        }
        if (clickTarget && targetWrap) {
          $(clickTarget).addClass(bookmarkClassName+"_link");
          $(clickTarget).closest(targetWrap).addClass(bookmarkClassName);
        } else if (clickTarget) { 
          $(clickTarget).addClass(bookmarkClassName).addClass(bookmarkClassName+"_link");
        } else {
          var hoverClassName = this.store["classes"]["hovering_name"];
          $("."+bookmarkClassName).addClass(hoverClassName); 
          setTimeout(function(){ $("."+bookmarkClassName).removeClass(hoverClassName); },400);
        }
    },
    refocus: function(distance){
        var bookmarkClass = "."+this.store["classes"]["bookmark_name"];
        try {
          var docViewBottom = distance + $(window).height();
          var elemTop = $(bookmarkClass).offset().top;
          var elemBottom = elemTop + $(bookmarkClass).height();
        } catch (err) {
          return;
        }
        if((elemTop <= docViewBottom) && (elemTop >= distance)){
          // if the item will be in view jump to its position
          $(window).scrollTop(distance);
        } else {
          // else if its out of view scroll to its position on the page
          $(window).scrollTop(elemTop - 50);
        }
    },
  	focusTop: function(title) {
      	// idea from https://stackoverflow.com/a/38705520
      	if($('#echotitle')[0]){
      		$('#echotitle').html(title);
        } else {
      		$('body').prepend('<span id="echotitle" class="clip-always" aria-live="polite" tabindex="-1">'+title+'</span>');
        }
      	document.getElementById('echotitle').focus();
        setTimeout(function() {
            document.getElementById('echotitle').blur();
        }, 0);
    },
  	focusSkipContent: function() {
      	// add a button to jump to last click location on page (event listener is in 'listeners' func)
        var skipContentArea = this.store["skipcontent"];
        var bookmarkClass = this.store["classes"]["bookmark"];
      	var returnClassName = this.store["classes"]["returntolastclick_name"];
        $("."+returnClassName).remove();
        if($(bookmarkClass)[0]){
          $(skipContentArea).prepend('<a class="'+returnClassName+'" href="#">Return to last click on this page</a>');
        }
    },
  	store: {
      item: null,
      skipcontent: null,
      classes: {
          bookmark: ".bookmark",
          bookmark_name: "bookmark",
          hovering: ".hovering",
          hovering_name: "hovering",
          refocus: ".refocus",
          refocus_name: "refocus",
        	returntolastclick: ".returntolastclick",
        	returntolastclick_name: "returntolastclick"
      }
    }
}
/* Listen for History API Pop State */
window.addEventListener("popstate", function(e) {
  try {
  	var previousContainer = e.state['container'];
  } catch(err){
    // console.error("Accejax Err - History state is undefined");
    return; 
  }
  var state = e.state;
  if (state !== null && previousContainer) {
  	// load previous/next page if data exists
    accejax.popContent(state, previousContainer);
  }
});