const path = require("path");
const express = require("express");
const upload = require("multer").multer();

const imageUploader = require("../lib/uploader");
const {
	getposts,
	likePost,
	commentPost,
	createPost,
	generateposts
} = require("../controller/post.controller");

const { login, register } = require("../controller/user.controller");
const { sendResonse } = require("../lib/HttpResponse");
const { HttpStatusAndCode } = require("../lib/HttpStatus");
const {
	REGISTER_USER_BODY_SCHEMA,
	LOGIN_USER_BODY_SCHEMA
	
} = require("../_data/user");
const { validateUser } = require("../middleware/user.validator");

const router = express.Router();

router.get("/", function (req, res) {
	res.sendFile(path.join(__dirname + "../../public/index.html"));
});

//send requested images
router.get("/uploads/:dirpath/:filename", function (req, res) {
	res.sendFile(
		path.join(__dirname + "../../uploads/" + req.params.dirpath + "/" + req.params.filename)
	);
});

router.post("/login", validateUser(LOGIN_USER_BODY_SCHEMA), login);

router.post("/register", validateUser(REGISTER_USER_BODY_SCHEMA), upload.single("profile"), register);

//upload profile pictures
router.post("/upload/profile", imageUploader.uploadProfileImage);

//upload comment pictures
router.post("/upload/comment", imageUploader.uploadCommentImage);

//upload post pictures
router.post("/upload/post", imageUploader.uploadPostImage);

router.get("/route-to-register", function (req, res) {
	res.redirect("/register");
});

router.get("/route-to-login", function (req, res) {
	res.redirect("/");
});

router.get("/register", (req, res) => {
	res.sendFile(path.join(__dirname + "../../public/register.html"));
});

router.get("/home", (req, res) => {
	res.sendFile(path.join(__dirname + "../../public/home.html"));
});

router.get("/post/get", getposts);

router.get("/post/like", likePost);

router.get("/post/comment", commentPost);

router.get("/post/create", createPost);

router.get("/generateposts", generateposts);

router.all("*", (req, res) =>
	sendResonse(res, HttpStatusAndCode.NOT_FOUND_ERROR, "Route/method not available")
);
module.exports = router;
