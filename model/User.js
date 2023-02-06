const mongoose = require("mongoose");

const { MongoProvider } = require("../lib/MongoProvider");

var User = mongoose.Schema({
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	created_at: {
		type: Date,
		default: Date.now
	},
	profile_pic: {
		type: String,
		required: true
	},
	dob: {
		type: String,
		required: true
	},
	phone_no: {
		type: String,
		required: true
	},
	address: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true
	}
});

const UserModel = mongoose.model("User", User);

class UserProvider extends MongoProvider {
	constructor() {
		super(UserModel);
	}
}

module.exports = {
	UserModel,
	UserProvider
};
