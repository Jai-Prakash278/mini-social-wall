const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    username: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    image_url: String,
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Post", postSchema);
