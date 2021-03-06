/**
 * Commits module.
 * This module is responsible for handling changes made by users.
 */

var commits = (function() {

    //=require jquery.dialog.js
    var ui = (function() {

        /**
         * This dialog should be opened before user is allowed to modify the given object.
         */
        var editDialog = (function() {
            var captionText = _("You are now about to enter the edit mode.");
            var contentText = _(
                "In the edit mode, you can modify every attribute of this airport you want.     \
                 Although, after you commit the changes, they need to be reviewed and accepted  \
                 by one of our moderators. You will be notified when your modifications are     \
                 applied to the database.");
            var questionText = _("Do you want to continue?");
            var continueText = _("Continue");
            var cancelText = _("Cancel");

            /* callbacks */
            var onAccept, onCancel;

            /* The dialog */
            var dialog = $("<div>")
                .addClass("editDialog")
                .css("display", "none")
                .append($("<p>")
                    .addClass("caption")
                    .text(captionText)
                )
                .append($("<p>")
                    .addClass("content")
                    .text(contentText)
                )
                .append($("<p>")
                    .addClass("question")
                    .text(questionText)
                )
                .append($("<input>")
                    .attr("type", "button")
                    .val(continueText)
                    .addClass("cyan")
                    .click(function() {
                        close();
                        if (typeof(onAccept) == "function")
                            onAccept();
                    })
                )
                .append($("<input>")
                    .attr("type", "button")
                    .val(cancelText)
                    .addClass("red")
                    .click(function() {
                        close();
                        if (typeof(onCancel) == "function")
                            onCancel();
                    })
                );

            /**
             * Opens the dialog.
             */
            var open = function() {
                dialog.dialog("open");
            };

            /**
             * Closes the dialog.
             */
            var close = function() {
                dialog.dialog("close");
            };

            /**
             * Sets function to be called when user decides to enable the edit mode.
             * The dialog is automatically hidden, user does not need to worry about it.
             * @param callback The callback function.
             */
            var accept = function(callback) {
                onAccept = callback;
            };

            /**
             * Sets function to be called when user clicks "Cancel".
             * The dialog is automatically hidden, user does not need to worry about it.
             * @param callback The callback function.
             */
            var cancel = function(callback) {
                onCancel = callback;
            };

            /* Add the dialog to DOM */
            $(document).ready(function() {
                dialog.appendTo($("body"));
            });

            // public scope
            return {
                open: open,
                close: close,
                accept: accept,
                cancel: cancel
            };
        }());

        var confirmDialog = (function() {
            var captionText = _("Confirm your changes");
            var contentText = _(
                "Please confirm your changes by describing them briefly and giving us your    \
                 e-mail address, so we can let you know when they are committed.");
            var descriptionText = _("Brief description:");
            var emailText = _("E-mail address:");
            var returnText = _("Return");
            var confirmText = _("Confirm");

            /* Callbacks */
            var onConfirm;

            /* Description input */
            var description = $("<input>")
                .attr("type", "text");

            /* Confirm button */
            var confirmButton = $("<input>")
                .attr("type", "button")
                .attr("disabled", "disabled")
                .val(confirmText)
                .addClass("cyan")
                .click(function() {
                    close();
                    if (typeof(onConfirm) == "function")
                        onConfirm(description.val(), email.val());
                });

            /* E-mail input */
            var email = $("<input>")
                .attr("type", "text")
                .keyup(function() {
                    if (isEmail(email.val()))
                        confirmButton.removeAttr("disabled");
                    else
                        confirmButton.attr("disabled", "disabled");
                });

            /* The dialog */
            var dialog = $("<div>")
                .addClass("confirmDialog")
                .css("display", "none")
                .append($("<p>")
                    .addClass("caption")
                    .text(captionText)
                )
                .append($("<p>")
                    .addClass("content")
                    .text(contentText)
                )
                .append($("<div>")
                    .addClass("spacer")
                )
                .append($("<div>")
                    .addClass("left")
                    .text(descriptionText)
                )
                .append($("<div>")
                    .addClass("right")
                    .append(description)
                )
                .append($("<div>")
                    .addClass("spacer")
                )
                .append($("<div>")
                    .addClass("left")
                    .text(emailText)
                )
                .append($("<div>")
                    .addClass("right")
                    .append(email)
                )
                .append($("<div>")
                    .addClass("spacer")
                )
                .append($("<input>")
                    .attr("type", "button")
                    .val(returnText)
                    .addClass("red")
                    .click(function() {
                        close();
                    })
                )
                .append(confirmButton);

            /**
             * Opens the dialog.
             */
            var open = function() {
                dialog.dialog("open");
            };

            /**
             * Closes the dialog.
             */
            var close = function() {
                dialog.dialog("close");
            };

            /**
             * Sets the function to be called when user confirms changes.
             * @param callback(description, email) The callback to be called.
             */
            var confirm = function(callback) {
                onConfirm = callback;
            };

            /* Add the dialog to DOM */
            $(document).ready(function() {
                dialog.appendTo($("body"));
            });

            // public scope
            return {
                open: open,
                close: close,
                confirm: confirm
            };

        }());

        var progressDialog = (function() {

            var progressText = _("Processing...");

            var dialog = $("<div>")
                .addClass("progressDialog")
                .css("display", "none")
                .text(progressText);

            /**
             * Opens the dialog.
             */
            var open = function() {
                dialog.dialog("open", {
                    height: 30
                });
            };

            /**
             * Closes the dialog.
             */
            var close = function() {
                dialog.dialog("close");
            };

            $(document).ready(function() {
                dialog.appendTo($("body"));
            });


            // public scope
            return {
                open: open,
                close: close
            };

        }());

        var successDialog = (function() {

            var captionText = _("Thank you");
            var contentText = _(
                "Thank you for contributing to the Vatsinator project. Our moderators will have your    \
                 commit reviewed soon, and you will be notified when your changes are merged with the   \
                 database.");
            var closeText = _("Close");

            var dialog = $("<div>")
                .addClass("successDialog")
                .css("display", "none")
                .append($("<p>")
                    .addClass("caption")
                    .text(captionText)
                )
                .append($("<p>")
                    .addClass("content")
                    .text(contentText)
                )
                .append($("<input>")
                    .attr("type", "button")
                    .val(closeText)
                    .addClass("cyan")
                    .click(function() {
                        close();
                    })
                );


            /**
             * Opens the dialog.
             */
            var open = function() {
                dialog.dialog("open");
            };

            /**
             * Closes the dialog.
             */
            var close = function() {
                dialog.dialog("close");
            };

            $(document).ready(function() {
                dialog.appendTo($("body"));
            });


            // public scope
            return {
                open: open,
                close: close
            };

        }());

        var errorDialog = (function() {

            var captionText = _("Error");
            var contentText = _(
                "We are sorry, but an error occurred during processing your request.    \
                 Please try again later.");
            var closeText = _("Close");

            var dialog = $("<div>")
                .addClass("errorDialog")
                .css("display", "none")
                .append($("<p>")
                    .addClass("caption")
                    .text(captionText)
                )
                .append($("<p>")
                    .addClass("content")
                    .text(contentText)
                )
                .append($("<p>")
                    .addClass("reason")
                )
                .append($("<input>")
                    .attr("type", "button")
                    .val(closeText)
                    .addClass("red")
                    .click(function() {
                        close();
                    })
                );


            /**
             * Opens the dialog.
             */
            var open = function(reason) {
                if (reason) {
                    dialog.children("p.reason").text(reason);
                } else {
                    dialog.children("p.reason").text("");
                }
                dialog.dialog("open");
            };

            /**
             * Closes the dialog.
             */
            var close = function() {
                dialog.dialog("close");
            };

            $(document).ready(function() {
                dialog.appendTo($("body"));
            });


            // public scope
            return {
                open: open,
                close: close
            };

        }());

        // public scope
        return {
            editDialog: editDialog,
            confirmDialog: confirmDialog,
            progressDialog: progressDialog,
            successDialog: successDialog,
            errorDialog: errorDialog
        };

    }());

    var add = function(url, data, success, error) {
        $.ajax({
            url: url,
            type: "post",
            data: data,

            error: function(jqXHR, textStatus, errorThrown) {
                error(errorThrown);
            },

            success: function(data) {
                if (data.result == 1)
                    success();
                else
                    error(data.reason);
            }
        });
    };

    var $token, $acceptButton, $rejectButton;

    /**
     * Accepts the commit.
     */
    var accept = function() {
        ui.progressDialog.open();

        var token = $token.val();

        $.ajax({
            url: "/commits/accept/" + token,
            type: "post",

            success: function(data) {
                if (data.result == 1)
                    window.location.replace(data.url);
            }
        });
    };

    /**
     * Rejects the commit.
     */
    var reject = function() {
        ui.progressDialog.open();

        var token = $token.val();

        $.ajax({
            url: "/commits/reject/" + token,
            type: "post",

            success: function(data) {
                if (data.result == 1)
                    window.location.replace(data.url);
            }
        });
    };

    /**
     * Verifies the e-mail address.
     */
    var isEmail = function(email) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
    };

    $(document).ready(function() {
        $token = $("#commitToken");
        if ($token.length) {
            $acceptButton = $("#commitAccept");
            $rejectButton = $("#commitReject");

            $acceptButton.click(accept);
            $rejectButton.click(reject);
        }
    });

    // public scope
    return {
        ui: ui,
        add: add
    };

}());
