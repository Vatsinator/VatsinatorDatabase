
/**
 * The singleton class that handles the client side of the application.
 */
var vd = {
  csrftoken: $.cookie('csrftoken'),
  
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
  
  _csrfSafeMethod: function(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
  },
  
  _sameOrigin: function(url) {
    // test that a given url is a same-origin URL
    // url could be relative or scheme relative or absolute
    var host = document.location.host; // host + port
    var protocol = document.location.protocol;
    var sr_origin = '//' + host;
    var origin = protocol + sr_origin;
    // Allow absolute or scheme relative URLs to same origin
    return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
        (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
        // or any other URL that isn't scheme relative or absolute i.e relative.
        !(/^(\/\/|http:|https:).*/.test(url));
  },
  
  /**
   * Django's csrftoken ajax security
   */
  _initAjax: function() {
    $.ajaxSetup({
      beforeSend: function(xhr, settings) {
        console.log("csrftoken: " + vd.csrftoken);
        if (!vd._csrfSafeMethod(settings.type) && vd._sameOrigin(settings.url))
          xhr.setRequestHeader("X-CSRFToken", vd.csrftoken);
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
    this._initAjax();
  }
};
