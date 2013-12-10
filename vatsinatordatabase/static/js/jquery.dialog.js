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
      "z-index": 1000,
      display: "none"
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
  
  function hideAll($overlay) {
    $overlay.children().each(function() { $(this).hide(); });
    $overlay.hide();
    $("body").data("jquery.dialog.js.dialog_opened", false);
  }
  
  /**
   * Plugin.
   */
  $.fn.dialog = function(action, myOpts) {
    if (!$.trim($(this).html())) {
      console.log("jquery.dialog.js: $(this) is an empty object");
      return false;
    }
    
    var body = $("body");
    
    var exists = body.data("jquery.dialog.js.overlay_exists");
    if (!exists) {
      body.append(overlay);
      
      $(document).keyup(function(e) {
        if (e.which == 27) {
          hideAll(overlay);
        }
      });
      
      body.data("jquery.dialog.js.overlay_exists", true);
    }
    
    var options = $.extend({}, defaults, myOpts);
    
    overlay.css("background", options.overlayBackground);
    
    if (action == "open") {
      if (body.data("jquery.dialog.js.dialog_opened") == true) {
        hideAll(overlay);
      }
      
      body.data("jquery.dialog.js.dialog_opened", true);
      overlay.show();
      
      prepare($(this), overlay, options);
      
      var isInOverlay = $(this).data("jquery.dialog.js.is_in_overlay");
      if (!isInOverlay) {
        $(this).appendTo(overlay);
        $(this).data("jquery.dialog.js.is_in_overlay", true);
      }
      
      $(this).show();
      
    } else if (action == "close") {
      hideAll(overlay);
    } else {
      console.log("jquery.dialog.js: action must be either \"open\" or \"close\"");
      return false;
    }
    
    return this;
  };
  
}(jQuery));
