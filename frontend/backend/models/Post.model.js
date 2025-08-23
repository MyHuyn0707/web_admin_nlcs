const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const Schema = mongoose.Schema;

let postSchema = new Schema(
    {
        className: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
        },
        scientificName: {
            type: String,
        },
        description: {
            type: String,
        },
        medicalInfo: {
            type: String,
        },
        image: {
            type: String,
        },
    },
    {
        collection: "posts",
    }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
