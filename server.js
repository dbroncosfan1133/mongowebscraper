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

// Route for grabbing all articles stored in DB
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

// Route for scraping hjnews website
app.get("/scrape", function (req, res) {
    //Axios grabs HTML body
    axios.get("https://www.hjnews.com/").then(function (response) {
        //Loads in to cheerio and create shorthand
        var $ = cheerio.load(response.data);

        // Elements from target site to scrape
        $("div.card-body").each(function (i, element) {
            var title = $(this).children("div.card-headline").children("h3.tnt-headline").text().trim();
            var link = "https://www.hjnews.com" + $(this).children("div.card-headline").children("h3.tnt-headline").children("a").attr("href");
            var info = $(this).children("div.card-lead").children("p.tnt-summary").text().trim();

            // Only displays articles to page if all three values are available
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

// Route to save articles to saved page
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

// Route to update article saved value to true
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

// *****************************************************************
// Notes are stored in DB but not currently tied to specific articles.
//Currently you cannot view or modify notes either.
//******************************************************************

app.post("/newnote/:id", function(req, res) {
    console.log(req.body);
    console.log(req.params.id);
    db.Notes.create(req.body)
    .then(function(dbNotes) {
        return db.Articles.findOneAndUpdate(
            {_id: req.params.id},
            {$push:
                {notes: dbNotes._id}
            },
            {new: true }
        );
    })
    .then(function(dbArticles) {
        res.json(dbArticles);
    })
    .catch(function(error) {
        res.json(error);
    });
});

// Route to delete scraped articles in database
app.get("/delete", function (req, res) {
    db.Articles.deleteMany({})
        .then(
            res.sendStatus(204));
});

app.listen(PORT, function () {
    console.log("App is running on port " + PORT);
});