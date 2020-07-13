const mongoose = require("mongoose");

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
    },
});

module.exports = mongoose.model("User", User);
