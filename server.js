var express = require("express");
var exphbs = require("express-handlebars");
var logger = require("morgan");
var mongoose = require("mongoose");

// Web Scraper tools
var axios = require("axios");
var cheerio = require("cheerio");

// Require models folder and its contents
var db = require("./models");

var PORT = process.env.PORT || 3000;

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
app.use(express.static("views"));

app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/mongoWebScraper", { useNewUrlParser: true });

// Routes

app.get("/", function (req, res) {
    db.Articles.find({
        saved: false
    },

        function (error, dbArticles) {
            if (error) {
                console.log(error);
            } else {
                res.render("index", {
                    articles: dbArticles
                });
            }
        }).lean();
});

// GET route for scraping hjnews website
app.get("/scrape", function (req, res) {
    //Axios grabs HTML body
    axios.get("https://www.hjnews.com/").then(function (response) {
        //Loads in to cheerio and create shorthand
        var $ = cheerio.load(response.data);

        //What we are grabbing from target site
        $("div.card-body").each(function (i, element) {
            // var result = {};

            var title = $(this).children("div.card-headline").children("h3.tnt-headline").text().trim();
            var link = "https://www.hjnews.com" + $(this).children("div.card-headline").children("h3.tnt-headline").children("a").attr("href");
            var info = $(this).children("div.card-lead").children("p.tnt-summary").text().trim();

            if (title && link && info) {
                db.Articles.create({
                    title: title,
                    link: link,
                    info: info
                },
                    function (error, results) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log(results);
                        }
                    });
            }
        });
        res.sendStatus(204);
    });
});

app.get("/saved", function (req, res) {
    db.Articles.find({ 
        saved: true 
    },
        function(error, dbArticles) {
            if(error) {
                console.log(error)
            } else {
                res.render("saved_articles", {
                    articles: dbArticles
                });
            }
        }).lean();
});

app.put("/saved/:id", function (req, res) {
    db.Articles.findByIdAndUpdate(
        req.params.id, {
        $set: req.body
    }, {
        new: true
    })
        .then(function (dbArticles) {
            res.json(dbArticles)
            // res.render("saved_articles", {
            //     articles: dbArticles
            // }).lean();
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.get("/delete", function (req, res) {
    db.Articles.deleteMany({})
        .then(
            res.sendStatus(204));
});

app.listen(PORT, function () {
    console.log("App is running on port " + PORT);
});