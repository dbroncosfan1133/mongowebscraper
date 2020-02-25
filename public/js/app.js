$("#new_articles").on("click", function (event) {
    event.preventDefault();
    $.get("/scrape", function(data) {
        window.location.reload(true)
    });
});