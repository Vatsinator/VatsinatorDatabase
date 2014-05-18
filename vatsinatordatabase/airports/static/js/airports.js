/**
 * Airports module.
 */

//=require commits.js
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

    var $editButton, $saveButton, $cancelButton, $fields;

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
     * Generates a valid url for AJAX query.
     * @param icao The ICAO of the airport.
     * @returns {string} The URL.
     */
    var getCommitUrl = function(icao) {
        return "/airports/save/" + icao;
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
     * Initializes the module.
     */
    var init = function() {
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
    };

    $(document).ready(function() {
        init();
    });

    // public scope
    return {};

}());
