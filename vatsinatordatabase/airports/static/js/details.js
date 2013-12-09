/**
 * Keeps ui elements
 */
var ui = {
  buttonField: null, // where buttons are placed
  enableEditModeBtn: null, // initial button
  saveDetailsBtn: $("<input>"),
  cancelBtn: $("<input>"),
  editModeLabel: $("<span>"),
  editDialog: $("<div>"),
  confirmDialog: $("<div>"),
  
  editEnable : function() {
    this.enableEditModeBtn.hide();
    
    $(".line > .right").editable({
      defaultVal: "unknown",
      editIcon: "/static/img/edit.png",
      onCommit: function(oldData, newData) {
        if (newData == "unknown")
          $(this).addClass("none");
        if ($(this).attr("id") == "altitude" && !$.isNumeric(newData))
          return false;
        }
    });
  
    this.saveDetailsBtn.show();
    this.cancelBtn.show();
    this.editModeLabel.show();
    
    map.editEnable();
  },
  
  editCancel: function() {
    this.cancelBtn.hide();
    this.saveDetailsBtn.hide();
    this.editModeLabel.hide();
    
    $(".line > .right").editableCancel();
    
    this.enableEditModeBtn.show();
    
    map.editCancel();
  },
  
  init: function() {
    this.buttonField = $("#buttonField");
    this.enableEditModeBtn = $("#enableEditModeBtn");
    
    this.saveDetailsBtn
      .attr("type", "button")
      .val("Save details")
      .addClass("cyan")
      .hide()
      .appendTo(ui.buttonField);
    
    this.cancelBtn
      .attr("type", "button")
      .val("Cancel")
      .addClass("red")
      .hide()
      .appendTo(ui.buttonField);
    
    this.editModeLabel
      .text("You may now edit this airport's details.")
      .addClass("editModeLabel")
      .hide()
      .appendTo(ui.buttonField);
    
    this.editDialog
      .append($("<p>")
        .html("You are now about to enter the edit mode.")
      )
      .append($("<p>")
        .css("font-size", "13px")
        .html("In the edit mode, you can modify every attribute of this airport " +
          "you want. Although, after you commit the changes, they need to be " +
          "reviewed and acceppted by one of the moderators. You will be notified " +
          "when your modifications are applied to the database.")
      )
      .append($("<p>")
        .css("margin-bottom", "15px")
        .html("Do you want to continue?")
      )
      .append($("<input>")
        .attr("type", "button")
        .css("margin-top", "15px")
        .val("Continue")
        .addClass("cyan")
        .click(function() {
          ui.editDialog.dialog("close");
          ui.editEnable();
        })
      )
      .append($("<input>")
        .attr("type", "button")
        .css("margin-top", "15px")
        .val("Cancel")
        .addClass("red")
        .click(function() {
          ui.editDialog.dialog("close");
        })
      );
    
    this.confirmDialog
      .append($("<p>")
        .html("Confirm")
      )
      .append($("<p>")
        .css("font-size", "13px")
        .html("Please confirm your changes by describing them briefly and giving us " +
          "your e-mail address, so we can let you know when they are commited.")
      )
      .append($("<p>")
        .html("Brief description: ")
        .append($("<input>")
          .attr("type", "text")
        )
      )
      .append($("<p>")
        .html("E-mail address: ")
        .append($("<input>")
          .attr("type", "text")
        )  
      )
      .append($("<input>")
        .attr("type", "button")
        .css("margin-top", "15px")
        .val("Confirm")
        .addClass("cyan")
        .click(function() {
          $(this)
            .val("Sending...")
            .attr("disabled", "disabled");
          
          dataHandler.commit(function() {
            ui.confirmDialog.dialog("close");
            ui.editCancel();
          });
        })
      );
    
    this.saveDetailsBtn.click(function() { ui.confirmDialog.dialog("open"); });
    
    this.enableEditModeBtn.click(function() {
      ui.editDialog.dialog("open");
    });
    
    this.cancelBtn.click(function() {
      ui.editCancel();
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
  
  updateLatLon: function(lat, lon) {
    this.longitudeContainer.val(lon);
    this.latitudeContainer.val(lat);
  },
  
  editEnable: function() {
    this.marker.setDraggable(true);
  },
  
  editDisable: function() {
    this.marker.setDraggable(false);
  },
  
  editCancel: function() {
    this.marker.setDraggable(false);
    
    var longitude = parseFloat(this.longitudeContainer.val());
    var latitude = parseFloat(this.latitudeContainer.val());
    
    this.marker.setPosition(this.originalPosition);
  },
  
  init: function() {
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
    
    google.maps.event.addListener(this.marker, "position_changed", function() {
      map.updateLatLon(map.marker.getPosition().lat(),
                       map.marker.getPosition().lng());
    });
  }
};

var dataHandler = {
  commit: function(callback) {
    setTimeout(function() { callback() }, 2000);
  }
};

$(document).ready(function() {
  ui.init();
  map.init();
});