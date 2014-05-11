/**
 * Airlines module.
 */

//=require commits/commits.js
var airlines = (function () {
    var $editButton, $saveButton, $cancelButton, $fields, $logoForm, $logoInput, $logoSubmit, $logoUploadProgress, $logoImg, logoFile;

    var prepareUpload = function (event) {
        if (event.target.files.length) {
            logoFile = event.target.files;
            $logoSubmit.removeAttr("disabled");
        }
    };

    var replaceLogo = function (url) {
        $logoImg.attr("src", url);
    };

    var uploadLogo = function (event) {
        event.stopPropagation();
        event.preventDefault();

        if (!logoFile.length) {
            console.error("File not specified");
            return;
        }

        $logoInput.hide();
        $logoSubmit.hide();
        $logoUploadProgress.show();

        var data = new FormData();
        var f = logoFile[0];

        if (!f.type.match('image.*')) {
            console.error(f.name + " is not an image");
            return;
        }

        data.append('file', f, f.name);

        var icao = $("#details #icao").text();

        $.ajax({
            url: '/airlines/upload-logo/' + icao,
            type: 'post',
            data: data,
            cache: false,
            dataType: 'json',
            processData: false,
            contentType: false,
            success: function (data, textStatus, jqXHR) {
                if (data.result == 1) {
                    if (data.url.length)
                        replaceLogo(data.url);
                } else {
                    console.log("Error: " + data.reason);
                    commits.ui.errorDialog.open();
                }

                $logoUploadProgress.hide();
                $logoInput.show();
                $logoSubmit.show();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("Error: " + textStatus);

                commits.ui.errorDialog.open();

                $logoUploadProgress.hide();
                $logoInput.show();
                $logoSubmit.show();
            }
        });
    };

    /**
     * Enables the edit mode.
     */
    var editEnable = function () {
        $editButton.hide();
        $logoForm.show();

        $fields.editable({
            defaultVal: "unknown",
            editIcon: "/static/img/edit.png",
            onCommit: function (oldData, newData) {
                if (newData == "unknown")
                    $(this).addClass("none");
                else
                    $(this).removeClass("none");
                return true;
            }
        });

        $saveButton.show();
        $cancelButton.show();
    };

    /**
     * Disables the edit mode.
     */
    var editDisable = function () {
        $logoForm.hide();

        $saveButton.hide();
        $cancelButton.hide();

        $fields.editableCancel();

        $editButton.show();
    };

    /**
     * Prepares data required by the commits module to create the single commit.
     * @returns Data object.
     */
    var getData = function () {
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
    var getCommitUrl = function (icao) {
        return "/airlines/save/" + icao;
    };

    /**
     * Queries server to create the commit.
     * @param description Description of the commit.
     * @param email Author e-mail address.
     */
    var commit = function (description, email) {
        commits.ui.progressDialog.open();

        var data = $.extend({}, getData(), {
            description: description,
            email: email
        });

        var url = getCommitUrl(data.icao);

        commits.add(url, data, function () {
            commits.ui.successDialog.open();
        }, function () {
            commits.ui.errorDialog.open();
        });

        editDisable();
    };

    /**
     * Initializes the module.
     */
    var init = function () {

        $logoForm = $("form#logoUpload");
        $logoForm.on('submit', uploadLogo);

        $logoInput = $logoForm.children("#logoInput");
        $logoInput.on('change', prepareUpload);

        $logoUploadProgress = $logoForm.children('.logo-upload-progress');
        $logoSubmit = $logoForm.children('input[type=submit]');

        $logoImg = $('.logo-field img.airline-logo');

        commits.ui.editDialog.accept(editEnable);
        commits.ui.confirmDialog.confirm(commit);

        $editButton = $("#enableButton");
        $editButton.click(function () {
            commits.ui.editDialog.open();
        });

        $saveButton = $("#saveButton");
        $saveButton.click(function () {
            commits.ui.confirmDialog.open();
        });

        $cancelButton = $("#cancelButton");
        $cancelButton.click(function () {
            editDisable();
        });

        $fields = $(".editable");
    };

    $(document).ready(function () {
        init();
    });

    // public scope
    return {};

}());