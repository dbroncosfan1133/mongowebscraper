var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Web Scraper tools
var axios = require("axios");
var cheerio = require("cheerio");

// Require models folder and its contents
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Middleware config

// Log requests with morgan logger
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/mongoWebScraper", { useNewUrlParser: true });

// Routes

// GET route for scraping hjnews website
app.get("/scrape", function (req, res) {
    //Axios grabs HTML body
    axios.get("https://www.cachevalleydaily.com/").then(function (response) {
        //Loads in to cheerio and create shorthand
        var $ = cheerio.load(response.data);

        //What we are grabbing from target site
        $("h3.recent-title").each(function (i, element) {
            var result = {};

            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");

            db.Articles.create(result)
                .then(function (dbArticles) {
                    console.log(dbArticles);
                })
                .catch(function (err) {
                    console.log(err);
                });


        });
        res.send("Scrape Complete");
    });
});




app.listen(PORT, function () {
    console.log("App is running on port " + PORT);
});