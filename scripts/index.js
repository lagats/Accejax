/************
    CALL ACCEAJAX
  *************/
accejax.init({
  item: [
    {
      container: "#maincontainer",
      target: ".ajax-item__link",
      targetwrap: ".ajax-item"
    },{
      container: "#demoarea",
      target: ".test-link"
    }
  ],
  skipcontent: "#skiptocontent"
}); 

/*------------------------------------*/

/************
    DEMO ONLY
  *************/
/* ajax load new result items - FOR DEMO */
var imgcount = 0;
function loadItems() {
  var target = "listresult.html";
  var getResults = $.get(target, function(data) {
    for (i = 1; i <= 10; i++) {
      imgcount++;
      var newData = data.replace("[IMAGECOUNT]", imgcount);
      $("#results").append(newData);
    }
  }).fail(function() {
    console.error("Error loading more, please try again later.");
  });
}