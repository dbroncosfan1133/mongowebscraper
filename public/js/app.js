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

$("#save_article").on("click", function () {
    var saved_article = $(this).data();
    saved_article.saved = true;

    var id = $(this).attr("data-articleId");
    $.ajax("/saved/" + id, {
        type: "PUT",
        data: saved_article
    }).then(
        function(data) {
            location.reload();
        }
    );
});

$("#remove_article").on("click", function (event) {
    event.preventDefault();
    var removed_article = $(this).data();
    var id = $(this).attr("data-articleId");
    removed_article.saved = false;

    $.ajax("/saved/" + id, {
        type: "PUT",
        data: removed_article
    }).then(
        function(data) {
            location.reload();
        }
    );
});