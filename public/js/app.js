$("#new_articles").on("click", function (event) {
    event.preventDefault();
    $.get("/scrape", function () {
        window.location.reload(true)
    });
});

$("#clear_articles").on("click", function (event) {
    event.preventDefault();
    $.get("/delete", function () {
        window.location.reload(true)
    });
});

$(".save_article").on("click", function () {
    var saved_article = $(this).data();
    saved_article.saved = true;
    console.log("clicked")

    var id = $(this).attr("data-articleId");
    $.ajax("/saved/" + id, {
        type: "PUT",
        data: saved_article
    }).then(
        function (data) {
            location.reload();
        }
    );
});

$(".remove_article").on("click", function () {
    var removed_article = $(this).data();
    var id = $(this).attr("data-articleId");
    removed_article.saved = false;

    $.ajax("/saved/" + id, {
        type: "PUT",
        data: removed_article
    }).then(
        function (data) {
            location.reload();
        }
    );
});

// Save a Note.
$(".save").on("click", function () {
    var id = $(this).attr("data-articleId");
    $.ajax({
        url: "/newnote/" + id,
        method: "POST",
        data: {
            // Value taken from note textarea
            note: $("#user_note").val()
        }
    })
        .then(function (data) {
            // Log the response
            // console.log(data);
            window.location.href = '/saved';
        });
    // Also, remove the values entered in the input and textarea for note entry
    $("#user_note").val("");
});





$(".save_note").on("click", function () {
    $(".new_note_modal").addClass("is-active");
});

$("#cancel_note").on("click", function () {
    $(".new_note_modal").removeClass("is-active");
});