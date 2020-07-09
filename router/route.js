

const body_parser = require('body-parser');
const mySql = require('mysql');
const path = require('path');
var express = require('express');

var image_uploader = require('../controller/uploader');
var post_controller = require('../controller/posts-controller');

var router = express.Router();

const baseUrl = 'https://socially-connect.herokuapp.com/uploads/';

const connectionParams = {
    host: 'bdwkslwwzlyvmttitazj-mysql.services.clever-cloud.com',
    user: 'ug38a2qvmwr4d1jn',
    password: 'loc9aHkJlcUOxIEMHqw2',
    database: 'bdwkslwwzlyvmttitazj',
};

router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '../../public/index.html'));
});


//send requested images
router.get('/uploads/:dirpath/:filename', function (req, res) {
    res.sendFile(path.join(__dirname + '../../uploads/' + req.params.dirpath +'/'+ req.params.filename));
});

router.get('/login', function (req, res) {
    let user_mail = req.query.email;
    let password = req.query.password;

    //open connection
    var connection = mySql.createConnection(connectionParams);

    if (user_mail && password) {
        connection.query('select * from users where email = ? and password = ?', [user_mail, password], (err, result, field) => {
            if (result && result.length > 0) {
                let userdetail = {
                    email: result[0].email,
                    username: result[0].username,
                    password: result[0].password,
                    profile_pic: result[0].profile_pic,
                    dob: result[0].dob,
                    phone_no: result[0].phone_no,
                    address: result[0].address,
                    user_id: result[0].user_id,
                };
                res.send({ message: 'login success', user: userdetail });
            } else {
                res.send({ message: 'email not exists', user: undefined });
            }
        });
    }
});

router.get('/register-user', function (req, res) {
    var user_details = {
        email: req.query.email,
        username: req.query.username,
        password: req.query.password,
        profile_pic: baseUrl + 'profile/' + req.query.profile_pic_name,
        dob: req.query.dob,
        address: req.query.address,
        phone_no: req.query.phone_no,
    };

    //open connection
    var connection = mySql.createConnection(connectionParams);

    if (user_details.email) {
        connection.query('select * from users where email = ?', [user_details.email], (err, result, field) => {
            if (err) {
                res.send({ message: 'something went wrong' });
            } else if (result && result.length > 0) {
                res.send({ message: 'email exists' });
            } else {
                connection.query('insert into  users (email, password, profile_pic, dob, phone_no, address, username) values (?, ?, ?, ?, ?, ?, ?)', [user_details.email, user_details.password, user_details.profile_pic, user_details.dob, user_details.phone_no, user_details.address, user_details.username], (err, result, field) => {
                    if (err) {
                        res.send({ message: 'something went wrong' });
                    } else if (result.affectedRows > 0) {
                        res.send({ message: 'added successfully' });
                    }
                });
            }
        });
    }

    //res.end();
});
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