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
    offset: 5
  };
  
  /* User settings. */
  var options = {};
  
  /**
   * Shows the "edit" mark on mouseover.
   */
  function mark($object) {
    $object
      .css("position", "relative")
      .append($("<span>")
        .css({
          display: "none",
          position: "absolute",
          top: "0",
          background: "#ffffff url('/static/img/edit.png') no-repeat left top",
          width: "16px",
          height: "16px",
          left: function() {
            return $object.width() + options.offset;
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
      .next().removeClass(options.hoverClass);
  };
  
  /**
   * Fired when user hits Enter.
   */
  function commit($object, oldData) {
    var content = $.trim($object.children("input").first().val());
    if (content == "")
      content = options.defaultVal;
    
    $object.text(content);
    
    if (options.onCommit.call($object, oldData, content) == false) {
      $object.text(oldData);
    }
    
    mark($object);
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
            commit(e.data.object, e.data.oldData);
          }
        })
    );
    
    $object.children("input").first().focus();
  };
  
  
  /**
   * Plugin.
   */
  $.fn.editable = function(myOpts) {
    options = $.extend({}, defaults, myOpts);
    
    return this.each(function() {
      mark($(this));
    });
  };
  
}(jQuery));