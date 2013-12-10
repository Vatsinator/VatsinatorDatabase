
/**
 * The singleton class that handles the client side of the application.
 */
var vd = {
  
  /**
   * Handles input[type=text]s.
   * @param object jQuery object.
   * @scope private
   */
  _toggleDefault: function(object) {
    if ($.trim(object.val()) == "") {
      object
        .val($(this).attr("title"))
        .addClass("default");
    } else if (object.val() == object.attr("title")) {
      object
        .removeClass("default")
        .val("");
    }
  },
  
  /**
   * Initializes the drop-down menu on the top bar.
   * @scope private
   */
  _initMenu: function() {
    $("ul.menu_top li").hover(function() {
      $(this).parent().find("ul.menu_sub").stop(true, true);
      $(this).children("ul.menu_sub").slideDown("fast");
      $(this).children("a").addClass("hover");
    }, function() {
      $(this).parent().find("ul.menu_sub").stop(true, true);
      $(this).children("ul.menu_sub").slideUp("fast");
      $(this).children("a").removeClass("hover");
    });
  },
  
  /**
   * Initializes the text fields.
   * @scope private
   */
  _initInputs: function() {
    $("input[type=text][title]").each(function() {
      $(this)
        .focus(function() {
          vd._toggleDefault($(this));
        })
        .blur(function() {
          vd._toggleDefault($(this));
        });
      
      if ($(this).val() == "") {
        $(this)
          .val($(this).attr("title"))
          .addClass("default");
        }
    });
  },
  
  /**
   * Initializes the application.
   * @scope public
   */
  init: function() {
    this._initMenu();
    this._initInputs();
  }
};
