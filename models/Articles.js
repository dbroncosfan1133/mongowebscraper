var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticlesSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Notes"
    }
});


//Create the mongoose model using the schema above
var Articles = mongoose.model("Articles", ArticlesSchema);

// Export the model
module.exports = Articles;