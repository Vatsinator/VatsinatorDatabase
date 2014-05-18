/**
 * VatsinatorDatabase Module
 */

var vdModule = (function () {
    var csrftoken = $.cookie('csrftoken');

    /**
     * Handles inputs of type text.
     * @param $object The jQuery input object.
     */
    var toggleDefault = function ($object) {
        if ($.trim($object.val()) == "") {
            $object
                .val($object.attr("title"))
                .addClass("default");
        } else if ($object.val() == $object.attr("title")) {
            $object
                .removeClass("default")
                .val("");
        }
    };

    /**
     * Initializes the drop-down menu on the top bar.
     * @param $object The jQuery menu object.
     */
    var initMenu = function ($object) {
        $object.hover(function () {
            $(this).parent().find("ul.menu_sub").stop(true, true);
            $(this).children("ul.menu_sub").slideDown("fast");
            $(this).children("a").addClass("hover");
        }, function () {
            $(this).parent().find("ul.menu_sub").stop(true, true);
            $(this).children("ul.menu_sub").slideUp("fast");
            $(this).children("a").removeClass("hover");
        });
    };

    /**
     * Initializes the dynamic elements of the webpage.
     */
    var initElements = function () {
        $("input[type=text][title]").each(function () {
            $(this)
                .focus(function () {
                    toggleDefault($(this));
                })
                .blur(function () {
                    toggleDefault($(this));
                });

            if ($(this).val() == "") {
                $(this)
                    .val($(this).attr("title"))
                    .addClass("default");
            }
        });
    };

    /**
     * Tests if the given HTTP method require CSRF protection.
     * @param method The HTTP method to be tested.
     * @returns {boolean} True if the given HTTP method does not require protection.
     */
    var csrfSafeMethod = function (method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    };

    /**
     * Tests that a given url is a same-origin URL.
     * URL could be relative, scheme relative or absolute.
     * @param url The url to be tested.
     */
    var isSameOrigin = function (url) {
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;

        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e. relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    };

    /**
     * Initializes the VatsinatorDatabase web-application.
     */
    var init = function () {
        initMenu($("ul.menu_top li"));
        initElements();

        // ensure that AJAX queries provide valid csrf token
        $.ajaxSetup({
            beforeSend: function (xhr, settings) {
                if (!csrfSafeMethod(settings.type) && isSameOrigin(settings.url))
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        });
    };


    // public scope
    return {
        init: init
    }
}());