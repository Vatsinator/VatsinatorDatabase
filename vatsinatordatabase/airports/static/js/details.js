$(document).ready(function() {
  $(".line > .right").editable({
    defaultVal: "unknown",
    onCommit: function(oldData, newData) {
      if (newData == "unknown")
        $(this).addClass("none");
      if ($(this).attr("id") == "altitude" && !$.isNumeric(newData))
        return false;
    }
  });
});