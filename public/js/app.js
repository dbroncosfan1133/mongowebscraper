$.getJSON("/articles", function (data) {
    console.log(data);
    for (var i = 0; i < data.length; i++) {

        $(".articles").prepend("<article class='tile is-child'>" + "<div class='card'>"
            + "<p class='card-header-title header_color' data-id='" + data[i]._id + "'><a class='header_font' href='" + data[i].link + "'>"
            + data[i].title + "</p><div class='card-content'>" + "<div class='content'>" + "<a href='"
            + data[i].link + "'>" + data[i].link + "</a></div></div></article>")
    }
})

$("#new_articles").on("click", function () {

})