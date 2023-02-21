$(document).ready(function () {
  const obj = {};
  $("#update-btn").click(function () {
    let tr = $("#tblLocations tr");
    for (let i = 0; i < tr.length; i++) {
      let tds = $(tr[i]).children();
      obj[tds[1].innerText] = {
        name: tds[1].innerText,
        order: tds[2].innerText,
        type: tds[3].innerText,
        _id: tds[4].innerText,
      };
    }
    $.ajax("/sort/data", {
      type: "POST",
      data: obj,
      success: function (data, status, xhr) {
        $("#modal-btn").click();
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      },
      error: function (jqXhr, textStatus, errorMessage) {
        console.log("Error: " + errorMessage);
      },
    });
  });
});
