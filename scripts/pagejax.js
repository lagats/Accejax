/*
PAGEJAX (work in progress) - Create a jump link for a 'load more' so you can find the start of the newly loaded content.

Use:
          var instance = pagejax;
          instance.init({
            loadbtn: ".load-trigger",
            resultwrap: "#results"
          });

*/

/* Pagejax - Pagination for 'load more' */
var pagejax = function(e, ref){
    var sectionName = "recentload";
    var goToSectionClassName = "go-to-recentloaded";
    $("#"+sectionName).remove();
    $(ref).append('<span id="'+sectionName+'" class="clip-always" tabindex="-1">Recently loaded results:</span>');
    if(!$("."+goToSectionClassName)[0]){
      $(e.target).after('<a class="'+goToSectionClassName+' clip " href="#'+sectionName+'">Move to loaded results.</a>');
    }
}


/*
var pagejax = {
    init : function(args){
        this.store["loadbtn"] = args["loadbtn"];
        this.store["resultwrap"] = args["resultwrap"];
      	this.listeners();
    },
    listeners: function(){
        var resultWrap = this.store["resultwrap"];
        var sectionName = this.store["section_name"];
        function buildMarker(){
          return '<span class="'sectionName'" tabindex="-1">Results for section 1.</span>';
        }
      	// listener for the 'load more' event
        var loadbtn = this.store["loadbtn"];
      	var count = this.store["sectioncount"];
      	var runSection = this.section(count);
        $(document).on("click", loadbtn, function(e) { 
          $(resultWrap).prepend(buildMarker());
        });
    },
  	section: function(count){
      console.log(count);
      // update global counter for
      this.store["sectioncount"]++
      var currentCount = this.store["sectioncount"];
      // create section markers
      var resultWrap = this.store["resultwrap"];
      var sectionName = this.store["section_name"];
      // function that compiles the html string that is placed within the results
      function buildMarker(){
        return '<span class="'+sectionName+'-'+currentCount+' " tabindex="-1">Results for section 1.</span>';
      }
      function buildJumpLink(){
        return '<a class="'sectionName'-link">next section</a>';
      }
      if(this.store["sectioncount"] == 1){
        $(resultWrap).prepend(buildMarker());
      }
      console.log('click');
    },
  	store: {
      loadbtn: null,
      resultwrap: null,
      section_name: "section"
    }
}
*/