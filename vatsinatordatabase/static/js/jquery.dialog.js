/**
 * This plugin converts a single element to the beautiful dialog box.
 */
(function($) {
  
  /* Default settings. */
  var defaults = {
    action: null,
    overlayBackground: "rgba(10, 10, 10, 0.9)",
    width: 500,
    height: 200,
    class: "dialog"
  };
  
  var overlay = $("<div>")
    .css({
      width: "100%",
      height: "100%",
      position: "fixed",
      left: 0,
      top: 0,
      "z-index": 1000
    });
  
  function prepare($object, $overlay, options) {
    $object
      .addClass(options.class)
      .css({
        position: "absolute",
        width: options.width,
        height: options.height,
        top: function() {
          return ($overlay.height() - $object.height()) / 2 - 100;
        },
        left: function() {
          return ($overlay.width() - $object.width()) / 2;
        },
        "z-index": 1001
      });
  }
  
  /**
   * Plugin.
   */
  $.fn.dialog = function(action, myOpts) {
    var options = $.extend({}, defaults, myOpts);
    
    if (action == undefined) {
      console.log("jquery.dialog.js: action must be either \"open\" or \"close\"!");
      return false;
    }
    
    overlay.css("background", options.overlayBackground);
    
    var body = $("body");
    
    if (action == "open") {
      if (body.data("dialog_opened") == true) {
        console.log("jquery.dialog.js: dialog is already opened!");
        return false;
      }
      
      body.data("dialog_opened", true);
      body.append(overlay);
      
      prepare($(this), overlay, options);
      $(this).appendTo(overlay);
      $(this).show();
      
      $(document).keyup(function(e) {
        if (e.which == 27) {
          overlay.detach();
          body.data("dialog_opened", false);
        }
      });
      
    } else if (action == "close") {
      overlay.detach();
      body.data("dialog_opened", false);
    } else {
      console.log("jquery.dialog.js: action must be either \"open\" or \"close\"!");
      return false;
    }
    
    return this;
  };
  
}(jQuery));
