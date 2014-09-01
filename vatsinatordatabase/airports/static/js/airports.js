/**
 * Airports module.
 */

//=require commits.js
//=require jquery.dialog.js
//=require jquery.editable.js
var airports = (function() {

    /**
     * Manages the map.
     */
    //=require google.maps
    var map = (function() {
        /* ID of the map container */
        var canvasId = "map-canvas";
        var $longitude, $latitude, originalPosition, map, marker;

        /**
         * Obtains longitude of the current position of the marker. Map must be initialized, otherwise this method
         * will return null.
         * @returns {*} Marker longitude.
         */
        var longitude = function() {
            if ($longitude === undefined) {
                console.error("airports.map: map not initialized yet");
                return null;
            } else {
                return parseFloat($longitude.val());
            }
        };

        /**
         * Obtains latitude of the current position of the marker. Map must be initialized, otherwise this method
         * will return null.
         * @returns {*} Marker latitude.
         */
        var latitude = function() {
            if ($latitude === undefined) {
                console.error("airports.map: map not initialized yet");
                return null;
            } else {
                return parseFloat($latitude.val());
            }
        };

        /**
         * Updates the position (i.e. after user moves the marker).
         * @param lat The new latitude.
         * @param lon The new longitude.
         */
        var updatePosition = function(lat, lon) {
            $latitude.val(lat);
            $longitude.val(lon);
        };

        /**
         * Enables the marker to be moved by user.
         */
        var enable = function() {
            marker.setDraggable(true);
        };

        /**
         * Disables the marker, so it cannot be moved.
         */
        var disable = function() {
            marker.setDraggable(false);
        };

        /**
         * Restores the original position of the marker.
         */
        var reset = function() {
            marker.setPosition(originalPosition);
        };

        var init = function() {
            $longitude = $("#longitude");
            $latitude = $("#latitude");

            originalPosition = new google.maps.LatLng(latitude(), longitude());

            map = new google.maps.Map(document.getElementById(canvasId), {
                center: new google.maps.LatLng(latitude(), longitude()),
                zoom: 13,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });

            marker = new google.maps.Marker({
                map: map,
                draggable: false,
                animation: google.maps.Animation.DROP,
                position: originalPosition
            });

            google.maps.event.addListener(marker, "position_changed", function() {
                updatePosition(marker.getPosition().lat(), marker.getPosition().lng());
            });
        };

        // public scope
        return {
            longitude: longitude,
            latitude: latitude,
            enable: enable,
            disable: disable,
            reset: reset,
            init: init
        };

    }());

    var pageType, $editButton, $saveButton, $cancelButton, $fields, $createNewAirportButton;

    /**
     * This dialog is opened when user wants to create the new airport.
     * It asks user for the ICAO code to create the new airport instance in the database.
     */
    var newAirportIcaoDialog = (function() {
        var captionText = "Create new airport";
        var contentText = "In order to create the new airport, you must firstly provide its ICAO code.";
        var confirmText = "Confirm";

        var $confirmButton = $("<input>")
            .attr("type", "button")
            .attr("disabled", "disabled")
            .addClass("cyan")
            .val(confirmText)
            .click(function() {
                var icao = $icaoInput.val();
                var url = getNewAirportUrl(icao);
                window.location.replace(url);
            });

        var $icaoInput = $("<input>")
            .attr("type", "text")
            .attr("maxlength", "4")
            .keyup(function() {
                var str = $(this).val();
                if (isIcao(str))
                    $confirmButton.removeAttr("disabled");
                else
                    $confirmButton.attr("disabled", "disabled");
            });

        var dialog = $("<div>")
            .addClass("newAirportIcaoDialog")
            .css("display", "none")
            .append($("<p>")
                .addClass("caption")
                .text(captionText)
        )
            .append($("<p>")
                .addClass("content")
                .text(contentText)
        )
            .append($icaoInput)
            .append($confirmButton);

        /**
         * Opens the dialog.
         */
        var open = function() {
            if (isIcao($icaoInput.val()))
                $confirmButton.removeAttr("disabled");
            else
                $confirmButton.attr("disabled", "disabled");

            dialog.dialog("open", {
                height: 120
            });
        };

        /**
         * Closes the dialog.
         */
        var close = function() {
            dialog.dialog("close");
        };

        var setValue = function(value) {
            $icaoInput.val(value);
        };

        $(document).ready(function() {
            dialog.appendTo($("body"));
        });

        // public scope
        return {
            open: open,
            close: close,
            setValue: setValue
        };
    }());

    /**
     * Enables the edit mode.
     */
    var editEnable = function() {
        $editButton.hide();

        $fields.editable({
            defaultVal: "unknown",
            editIcon: "/static/editable/img/edit.png",
            onCommit: function(oldData, newData) {
                if (newData == "unknown")
                    $(this).addClass("none");
                else
                    $(this).removeClass("none");

                if ($(this).attr("id") == "altitude" && !$.isNumeric(newData))
                    return false;

                return true;
            }
        });

        map.enable();

        $saveButton.show();
        $cancelButton.show();
    };

    /**
     * Disables the edit mode.
     */
    var editDisable = function() {
        $saveButton.hide();
        $cancelButton.hide();

        $fields.editableCancel();
        map.disable();

        $editButton.show();
    };

    /**
     * In the UI, variables that are not set are marked as "unknown".
     * Time to get rid of this.
     * @param text Text to cleanup.
     */
    var cleanup = function(text) {
        if (text == "unknown")
            return "";
        else
            return text;
    };

    /**
     * Prepares data required by the commits module to create the single commit.
     * @returns Data object.
     */
    var getData = function() {
        return {
            icao: $("#details #icao").text(),
            iata: cleanup($("#details #iata").text()),
            latitude: $("#details #latitude").val(),
            longitude: $("#details #longitude").val(),
            name: cleanup($("#details #name").text()),
            city: cleanup($("#details #city").text()),
            country: cleanup($("#details #country").text()),
            altitude: $("#details #altitude").text()
        };
    };

    /**
     * Generates a valid URL for AJAX query.
     * @param icao The ICAO of the airport.
     * @returns {string} The URL.
     */
    var getCommitUrl = function(icao) {
        return "/airports/save/" + icao;
    };

    /**
     * Generates a valid URL to redirect in order to create a new airport.
     * @param icao The new airport's ICAO code.
     * @returns {string} The URL.
     */
    var getNewAirportUrl = function(icao) {
        return "/airports/new/" + icao.toUpperCase();
    };

    /**
     * Queries server to create the commit.
     * @param description Description of the commit.
     * @param email Author e-mail address.
     */
    var commit = function(description, email) {
        commits.ui.progressDialog.open();

        var data = $.extend({}, getData(), {
            description: description,
            email: email
        });

        var url = getCommitUrl(data.icao);

        commits.add(url, data, function() {
            commits.ui.successDialog.open();
        }, function() {
            commits.ui.errorDialog.open();
        });

        editDisable();
    };

    /**
     * Opens the dialog that lets user create a new airport.
     */
    var createNew = function() {
        var icao = $("#query-original").val();
        newAirportIcaoDialog.setValue(icao);
        newAirportIcaoDialog.open();
    };

    /**
     * Checks whether the given string is a valid airport ICAO code.
     * @param str The string.
     */
    var isIcao = function(str) {
        var regex = /^.{4}$/;
        return regex.test(str);
    };

    /**
     * Initializes the module.
     */
    var init = function() {
        pageType = $("#page-type").val();
        switch (pageType) {
            case 'details':
                map.init();

                commits.ui.editDialog.accept(editEnable);
                commits.ui.confirmDialog.confirm(commit);

                $editButton = $("#enableButton");
                $editButton.click(function() {
                    commits.ui.editDialog.open();
                });

                $saveButton = $("#saveButton");
                $saveButton.click(function() {
                    commits.ui.confirmDialog.open();
                });

                $cancelButton = $("#cancelButton");
                $cancelButton.click(function() {
                    editDisable();
                });

                $fields = $(".editable");

                /* If user creates new airport, enable edit mode at the very beginning */
                if ($("#is_new").val() == "true") {
                    editEnable();
                }

                break;

            case 'search':
                $createNewAirportButton = $("#new-airport-button");
                $createNewAirportButton.click(createNew);
                break;
        }
    };

    $(document).ready(function() {
        init();
    });

    // public scope
    return {};

}());
