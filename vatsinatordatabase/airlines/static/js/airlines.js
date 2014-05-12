/**
 * Airlines module.
 */

//=require commits/commits.js
var airlines = (function() {
    var $editButton, $saveButton, $cancelButton, $fields, $logoField, $logoForm, $logoInput, $logoUploadProgress, $logoImg, logoFile, origLogo;

    /**
     * When user picks the file, prepares it for the upload.
     * @param event The event.
     */
    var prepareUpload = function(event) {
        if (event.target.files.length) {
            logoFile = event.target.files[0];
        } else {
            logoFile = null;
        }
    };

    /**
     * Replaces the airline logo with the given url.
     * @param url The new image URL.
     */
    var replaceLogo = function(url) {
        $logoImg.attr("src", url);
        $logoImg.show();
    };

    /**
     * If the logo is hidden (the airline does not have any yet), shows its container.
     * Additionally, it shows the "upload new logo" "form".
     */
    var enableLogo = function() {
        $logoField.show();
        $logoForm.show();
    };

    /**
     * Hides logo upload "form".
     * If user did not upload any logo, hides its container.
     */
    var disableLogo = function() {
        if (!origLogo.length) {
            var src = $logoImg.attr("src");
            if (!src.length) {
                $logoField.hide();
                $logoImg.hide();
            }
        } else {
            $logoImg.attr("src", origLogo);
        }

        $logoForm.hide();
    };

    /**
     * Gets the current airline ICAO code.
     */
    var getIcao = function() {
        return $("#details #icao").text();
    };

    /**
     *
     * @param event
     */
    var uploadLogo = function(event) {
        if (event !== undefined) {
            event.stopPropagation();
            event.preventDefault();
        }

        if (!logoFile) {
            console.error("File not specified");
            return;
        }

        $logoInput.hide();
        $logoUploadProgress.show();

        var data = new FormData();

        if (!logoFile.type.match('image.*')) {
            console.error(logoFile.name + " is not an image");
            return;
        }

        data.append('file', logoFile, logoFile.name);

        var icao = getIcao();

        $.ajax({
            url: '/airlines/upload-logo/' + icao,
            type: 'post',
            data: data,
            cache: false,
            dataType: 'json',
            processData: false,
            contentType: false,
            success: function(data, textStatus, jqXHR) {
                if (data.result == 1) {
                    if (data.url.length)
                        replaceLogo(data.url);
                } else {
                    console.log("Error: " + data.reason);
                    commits.ui.errorDialog.open();
                }

                $logoUploadProgress.hide();
                $logoInput.show();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("Error: " + textStatus);

                commits.ui.errorDialog.open();

                $logoUploadProgress.hide();
                $logoInput.show();
            }
        });
    };

    /**
     * Enables the edit mode.
     */
    var editEnable = function() {
        $editButton.hide();

        $fields.editable({
            defaultVal: "unknown",
            editIcon: "/static/img/edit.png",
            onCommit: function(oldData, newData) {
                if (newData == "unknown")
                    $(this).addClass("none");
                else
                    $(this).removeClass("none");
                return true;
            }
        });

        enableLogo();

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
        disableLogo();

        $editButton.show();
    };

    /**
     * Prepares data required by the commits module to create the single commit.
     * @returns Data object.
     */
    var getData = function() {
        return {
            icao: $("#details #icao").text(),
            name: $("#details #name").text(),
            country: $("#details #country").text(),
            website: $("#details #website").text(),
            logo: $logoImg.attr("src")
        };
    };

    /**
     * Generates a valid url for AJAX query.
     * @param icao The ICAO of the airline.
     * @returns {string} The URL.
     */
    var getCommitUrl = function(icao) {
        return "/airlines/save/" + icao;
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
        $logoField = $(".logo-field");
        $logoImg = $logoField.children('img.airline-logo');
        origLogo = $logoImg.attr("src");

        $logoForm = $(".logo-form");

        $logoInput = $logoForm.children("#logoInput");
        $logoInput.on('change', function(event) {
            prepareUpload(event);
            uploadLogo();
        });

        $logoUploadProgress = $logoForm.children('.logo-upload-progress');

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