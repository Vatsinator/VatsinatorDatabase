/**
 * Airports module.
 */

//=require jquery.dialog.js
var airports = (function () {

    var ui = (function () {

        var enableEditModeButton, saveDetailsButton, editCancelButton,
            editModelLabel, editables,
            confirmDialog, confirmDialogConfirmButton,
            editDialog, editDialogContinueButton, editDialogCancelButton,
            successDialog, successDialogCloseButton,
            errorDialog, errorDialogCloseButton;

        /**
         * Gathers all ui elements.
         */
        var init = function () {
            enableEditModeButton = $("#enableEditModeButton");
            saveDetailsButton = $("#saveDetailsButton");
            editCancelButton = $("#editCancelButton");
            editModelLabel = $("#editModeLabel");
            editables = $(".line > .editable");
            confirmDialog = $("#confirmDialog");
            confirmDialogConfirmButton = confirmDialog.children(".confirmButton");
            editDialog = $("#editDialog");
            editDialogContinueButton = editDialog.children(".continueButton");
            editDialogCancelButton = editDialog.children(".cancelButton");
            successDialog = $("#successMsg");
            successDialogCloseButton = successDialog.children(".closeButton");
            errorDialog = $("#errorMsg");
            errorDialogCloseButton = errorDialog.children(".closeButton");

            bindCallbacks();
        };

        /**
         * Defines ui behaviour.
         */
        var bindCallbacks = function () {
            enableEditModeButton.click(function () {
                editDialog.dialog("ooen");
            });
            editDialogContinueButton.click(function() {
                editDialog.dialog("close");
                enableEdit();
            });
            editDialogCancelButton.click(function() {
                editDialog.dialog("close");
            });
            editCancelButton.click(function() {
                disableEdit();
            });
            saveDetailsButton.click(function() {
                confirmDialog.dialog("open");
            });
            successDialogCloseButton.click(function() {
                successDialog.dialog("close");
            });
            errorDialogCloseButton.click(function() {
                errorDialog.dialog("close");
            });
            confirmDialogConfirmButton.click(function() {
                $(this)
                    .val("Processing...")
                    .attr("disabled", "disabled");

                // TODO DataHandler
            });
        };

        var enableEdit = function() {

        };

        var disableEdit = function(){

        };

    }());


}());
