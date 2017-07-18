# Accejax

This is a small JS plugin to help make a infinite scroll or 'load more' type page more accessible.

View the [Demo](https://neonecra.github.io/Accejax/demo/index.html).

---

### Using Accejax
_Accejax_ has several major processes at play:
 - Capitalises on the History API to load content from your target page into an existing container and listens for your history 'pop' state to navigate back and forth with ajax. 
 - Stores how far down the user has scrolled when navigation within the History API and will move the view back to where you left off when going back (or forward).
 - Adds an accessable jumplink to your sites 'skip-to-content' nav that takes the user back to the last item they clicked.
 - Hover effect on return state to help find where you were before
~~~~
accejax.init({
  item: [                           // array of objects that trigger Accejax
    {                               
      container: "#maincontainer",  // (required) content container to load from the target page into the current page, NOTE: these must match between pages (can be an ID or a Class)
      target: ".ajax-item__link",   // (required) your target link that will trigger Accejax
      targetwrap: ".ajax-item"      // (optional) if your link has a wrapping container that you want to add a hover effect to, define the container here
    },{
      container: "#test-area",
      target: ".test-link"
    }
  ],
  skipcontent: "#skiptocontent",    // (required) location of your accessable 'skip-to-content' nav 
  classes: {                        // (optional) overwrites for the default classes used by Accejax, change to suit your css
    hovering: '.lorum',
    refocus: '.ipsum',
    bookmark: '.dolor',
  }
}); 
~~~~


### Using Pagejax
_Pagejax_ Is an additional optional function that allows your dynamic content loading to become more accessable. It does this by creating a tab jumplink after your 'load more' button that goes to the first newly loaded result.
You can call _pagejax_ with `pagejax(eventCallback, resultContainer)` 
Parametres:
  - eventCallback:    requires an event callback (the clicked element will have the jumpling appended after it)
  - resultContainer:  the target contaimer where the new results will be loaded
  
_tip: for best results trigger your load function after `pagejax()`_
~~~~
$(document).on("click",".load-trigger", function(e){
  pagejax(e,'#results');
  loadItems();
});
~~~~
