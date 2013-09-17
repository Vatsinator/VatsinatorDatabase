/*
 * This is simple plugin to make desired fields editable.
 */
(function($) {
  
  /* Default settings. */
  var defaults = {
 
    /* Default value that is treated as the "empty" one */
    defaultVal: "",
    
    /**
     * Launched when user commits data.
     * @param oldData Data before the edit.
     * @param newData Data after the edit.
     * @return If false, oldData will be set back.
     */
    onCommit: function(oldData, newData) { return true; },
    
    /**
     * Space between the object and markings.
     */
    offset: 5,
    
    /**
     * The "edit" icon, preferably 16x16 px.
     */
    editIcon: "",
  };
  
  /* User settings. */
  var options = {};
  
  
  /**
   * Returns content from before any modifications.
   */
  function original($object) {
    return $object.data("editable_original");
  };
  
  /**
   * Shows the "edit" mark on mouseover.
   */
  function mark($object) {
    $object
      .css("position", "relative")
      .attr("title", "Click to edit")
      .append($("<span>")
        .css({
          display: "none",
          position: "absolute",
          top: "0",
          background: "#ffffff url(" + options.editIcon + ") no-repeat right top",
          height: "16px",
          width: function() {
            return 16 +  + options.offset;
          },
          left: function() {
            return $object.width();
          }
        })
        .addClass("editable_editMark")
       )
      .css("cursor", "pointer")
      .hover(function() {
          $(this).children("span.editable_editMark").show();
        }, function() {
          $(this).children("span.editable_editMark").hide();
        })
      .click(function() {
          edit($(this));
        });
  };
  
  /**
   * Stops what mark() caused.
   */
  function unmark($object) {
    $object
      .off("mouseenter mouseleave click")
      .removeAttr("title")
      .css("cursor", "auto");
  };
  
  /**
   * Fired when user hits Enter.
   */
  function commit($object) {
    var content = $.trim($object.children("input").first().val());
    if (content == "")
      content = options.defaultVal;
    
    $object.text(content);
    
    if (options.onCommit.call($object, original($object), content) == false) {
      revert($object);
    } else {
      mark($object);
    }
  };
  
  /**
   * Cancels the input and reverts the original content.
   */
  function revert($object) {
    $object.text(original($object));
    mark($object);
  };
  
  /**
   * Removes all the listeners, reverts primary data.
   */
  function restore($object) {
    $object.text(original($object));
    unmark($object);
  };
  
  /**
   * Opens the input field.
   */
  function edit($object) {
    var content = $.trim($object.text());
    if (content == options.defaultVal)
      content = "";
    
    unmark($object);
    
    $object.empty().append(
      $("<input>")
        .val(content)
        .addClass("inline")
        .attr("type", "text")
        .on("keyup", { object: $object, oldData: content }, function(e) {
          if (e && e.which == 13) {
            commit(e.data.object);
          }
        })
        .on("blur", { object: $object, oldData: content }, function(e) {
          commit(e.data.object);
        })
    );
    
    $object.children("input").first().focus();
  };
  
  
  /**
   * Plugin functions.
   */
  $.fn.editable = function(myOpts) {
    options = $.extend({}, defaults, myOpts);
    
    if (options.editIcon == "")
      console.log("The editIcon param is empty. The correct path should be set.");
    
    return this.each(function() {
      $(this).data("editable_original", $.trim($(this).text()));
      $(this).data("editable_marked", true);
      mark($(this));
    });
  };
  
  $.fn.editableCancel = function() {
    return this.each(function() {
      if ($(this).data("editable_marked") == true) {
        restore($(this));
      }
    });
  };
  
}(jQuery));