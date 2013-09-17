/**
 * Keeps ui elements
 */
var ui = {
  buttonField: null,
  enableEditModeBtn: null,
  saveDetailsBtn: $("<input>"),
  cancelBtn: $("<input>"),
  editModeLabel: $("<span>"),
  
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
  }
};

$(document).ready(function() {
  ui.setup();
  
  ui.enableEditModeBtn.click(function() {
    $(this).hide();
    
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
  });
  
  ui.cancelBtn.click(function() {
    $(this).hide();
    ui.saveDetailsBtn.hide();
    ui.editModeLabel.hide();
    
    $(".line > .right").editableCancel();
    
    ui.enableEditModeBtn.show();
    
  });
});