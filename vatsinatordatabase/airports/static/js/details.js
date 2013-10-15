/**
 * Keeps ui elements
 */
var ui = {
  buttonField: null,
  enableEditModeBtn: null,
  saveDetailsBtn: $("<input>"),
  cancelBtn: $("<input>"),
  editModeLabel: $("<span>"),
  editDialog: $("<div>"),
  
  initGMaps: function() {
    var longitude = parseFloat($("#longitude").val());
    var latitude = parseFloat($("#latitude").val());
    
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
      position: new google.maps.LatLng(latitude, longitude)
    });
  },
  
  setup: function() {
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
          enableEdit();
        })
      )
  }
};

function enableEdit() {
  ui.enableEditModeBtn.hide();
  
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
  
  ui.saveDetailsBtn.show();
  ui.cancelBtn.show();
  ui.editModeLabel.show();
}

$(document).ready(function() {
  ui.setup();
  ui.initGMaps();
  
  ui.enableEditModeBtn.click(function() {
    ui.editDialog.dialog("open");
  });
  
  ui.cancelBtn.click(function() {
    $(this).hide();
    ui.saveDetailsBtn.hide();
    ui.editModeLabel.hide();
    
    $(".line > .right").editableCancel();
    
    ui.enableEditModeBtn.show();
    
  });
});