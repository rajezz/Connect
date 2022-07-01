

const body_parser = require('body-parser');
const mySql = require('mysql');
const path = require('path');
var express = require('express');

var image_uploader = require('../controllers/uploader');
var post_controller = require('../controllers/posts.controller');

const { postsController, userController } = require("../controllers")

var router = express.Router();

const baseUrl = 'http://localhost:3000/uploads/';

const remoteConnectionParams = {
    host: 'bdwkslwwzlyvmttitazj-mysql.services.clever-cloud.com',
    user: 'ug38a2qvmwr4d1jn',
    password: 'loc9aHkJlcUOxIEMHqw2',
    database: 'bdwkslwwzlyvmttitazj',
};

const connectionParams = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'TestDB',
};

router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '../../public/index.html'));
});


//send requested images
router.get('/uploads/:dirpath/:filename', function (req, res) {
    res.sendFile(path.join(__dirname + '../../uploads/' + req.params.dirpath + '/' + req.params.filename));
});

//api...
router.get("/api/login", userController.login)
router.get("/api/register", userController.register)

//upload profile pictures
router.post('/upload/profile', image_uploader.uploadProfileImage);

//upload comment pictures
router.post('/upload/comment', image_uploader.uploadCommentImage);

//upload post pictures
router.post('/upload/post', image_uploader.uploadPostImage);

router.get('/route-to-register', function (req, res) {
    res.redirect('/register');
});

router.get('/route-to-login', function (req, res) {
    res.redirect('/');
});

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname + '../../public/register.html'));
});

router.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname + '../../public/home.html'));
});

router.get('/getposts', post_controller.getposts);

router.get('/post/like', post_controller.likePost);

router.get('/post/comment', post_controller.commentPost);

router.get('/post/create', post_controller.createPost);

router.get('/generateposts', post_controller.generateposts);

module.exports = router;