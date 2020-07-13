const mongoose = require("mongoose");

var Post = mongoose.Schema({
    picture: {
        type: String,
        default: null,
    },
    description: {
        type: String,
        default: null,
    },
    likes: {
        type: String,
        default: 0,
    },
    comments: [{
        comment_pic: String,
        text: String,
        username: String,
        user_pic: String,
    }],
    posted_on: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Post", Post);
