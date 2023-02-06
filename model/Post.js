const mongoose = require("mongoose");

const { MongoProvider } = require("../lib/MongoProvider");

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

const PostModel = mongoose.model("Post", Post);

class PostProvider extends MongoProvider {
	constructor() {
		super(PostModel);
	}
}

module.exports = {
	PostModel,
	PostProvider
};