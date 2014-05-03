/**
 * Manages ui elements
 */
var ui = {

    /**
     * Enables the "edit" mode.
     */
    editEnable: function () {
        $("#enableEditModeBtn").hide();

        $(".line > .right").editable({
            defaultVal: "unknown",
            editIcon: "/static/img/edit.png",
            onCommit: function (oldData, newData) {
                if (newData == "unknown")
                    $(this).addClass("none");
                if ($(this).attr("id") == "altitude" && !$.isNumeric(newData))
                    return false;
            }
        });

        $("#saveDetailsBtn").show();
        $("#editCancelBtn").show();

        $("#editModeLabel").show();

        map.editEnable();
    },

    /**
     * Closes the "edit" mode.
     */
    editCancel: function () {
        $("#saveDetailsBtn").hide();
        $("#editCancelBtn").hide();

        $("#editModeLabel").hide();

        $(".line > .right").editableCancel();
        $("#enableEditModeBtn").show();
        map.editCancel();
    },

    /**
     * Binds callbacks.
     */
    init: function () {
        $("#enableEditModeBtn").click(function () {
            $("#editDialog").dialog("open");
        });

        $("#editDialog #continueBtn").click(function () {
            $("#editDialog").dialog("close");
            ui.editEnable();
        });

        $("#editDialog #cancelBtn").click(function () {
            $("#editDialog").dialog("close");
        });

        $("#editCancelBtn").click(function () {
            ui.editCancel();
        });

        $("#saveDetailsBtn").click(function () {
            $("#confirmDialog").dialog("open");
        });

        $("#successMsg #closeBtn").click(function () {
            $("#successMsg").dialog("close");
        });

        $("#errorMsg #closeButton").click(function () {
            $("#errorMsg").dialog("close");
        });

        $("#confirmDialog #confirmBtn").click(function () {
            $(this)
                .val("Sending...")
                .attr("disabled", "disabled");

            dataHandler.commit({
                    id: $("#details #id").val(),
                    icao: $("#details #icao").text(),
                    iata: $("#details #iata").text(),
                    latitude: $("#details #latitude").val(),
                    longitude: $("#details #longitude").val(),
                    name: $("#details #name").text(),
                    city: $("#details #city").text(),
                    country: $("#details #country").text(),
                    altitude: $("#details #altitude").text(),
                    description: $("#confirmDialog #descriptionText").val(),
                    email: $("#confirmDialog #emailText").val()
                }, function () {
                    $("#confirmDialog").dialog("close");
                    ui.editCancel();

                    $("#successMsg").dialog("open");
                }, function (msg) {
                    $("#confirmDialog").dialog("close");
                    ui.editCancel();

                    $("#errorMsg").dialog("open");
                    $("#errorMsg #errorText").html(msg);
                }
            );
        });
    }
};

/**
 * Keeps map
 */
var map = {
    longitudeContainer: null,
    latitudeContainer: null,
    originalPosition: null,
    map: null,
    marker: null,

    updateLatLon: function (lat, lon) {
        this.longitudeContainer.val(lon);
        this.latitudeContainer.val(lat);
    },

    editEnable: function () {
        this.marker.setDraggable(true);
    },

    editDisable: function () {
        this.marker.setDraggable(false);
    },

    editCancel: function () {
        this.marker.setDraggable(false);

        var longitude = parseFloat(this.longitudeContainer.val());
        var latitude = parseFloat(this.latitudeContainer.val());

        this.marker.setPosition(this.originalPosition);
    },

    init: function () {
        this.longitudeContainer = $("#longitude");
        this.latitudeContainer = $("#latitude");

        var longitude = parseFloat(this.longitudeContainer.val());
        var latitude = parseFloat(this.latitudeContainer.val());
        this.originalPosition = new google.maps.LatLng(latitude, longitude);

        var options = {
            center: new google.maps.LatLng(latitude, longitude),
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        this.map = new google.maps.Map(document.getElementById("map-canvas"), options);
        this.marker = new google.maps.Marker({
            map: this.map,
            draggable: false,
            animation: google.maps.Animation.DROP,
            position: this.originalPosition
        });

        google.maps.event.addListener(this.marker, "position_changed", function () {
            map.updateLatLon(map.marker.getPosition().lat(),
                map.marker.getPosition().lng());
        });
    }
};

var dataHandler = {
    success: function () {
    },
    error: function () {
    },

    commit: function (values, success, error) {
        this.success = success;
        this.error = error;

        $.ajax({
            url: "/airports/save/",
            type: "post",
            data: values,

            error: function (jqXHR, textStatus, errorThrown) {
                dataHandler.error(errorThrown);
            },

            success: function (data) {
                if (data.result == 1) {
                    dataHandler.success();
                } else {
                    var reason = data.reason;
                    dataHandler.error(reason);
                }
            }
        });
    }
};

$(document).ready(function () {
    ui.init();
    map.init();
});