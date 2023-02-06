const mySql = require('mysql');
const faker = require('faker');
const async = require('async');
const Post = require('../model/Post');

const baseUrl = process.env.UPLOAD_PATH | "http://localhost:3000/uploads/";

exports.getposts = function (req, res) {
    var posts = [];
    var start_index = parseInt(req.query.start_index);
    
    //method implemented with mongodb
    Post.count().then(count => {
        Post.find().skip(start_index).limit(20).sort({
            _id: -1
        }).then(document => {
            res.send({
                posts: document,
            });
        });
    });
};


exports.generateposts = function (req, res) {
    for (let i = 0; i < 100; i++) {
        generatepost();
    }
    res.send({
        message: 'posts generated'
    });
}

function generatepost() {
    var postdata = {
        picture: faker.fake('{{image.image}}'),
        description: faker.fake('{{lorem.paragraph}}'),
        comment: [],
    };

    //method implemented with mongodb
    var newPost = new Post(postdata);

    newPost.save();
}

exports.likePost = function (req, res) {
    var post_id = req.query.post_id;
    var user_id = req.query.user_id;
    //method implemented with mongodb
    Post.find({ _id: post_id, }).then(document => {
        if (document) {
            
        }
    })
};

exports.commentPost = function (req, res) {
    var commentDetails = {
        post_id: req.query.post_id,
        user_id: req.query.user_id,
        comment: req.query.comment,
        pic_name: req.query.pic_name != undefined ? req.url + 'comments/' + req.query.pic_name : null,
        username: req.query.username,
        user_pic: req.query.user_pic,
    };
    async.waterfall([
        function (callback) {
            //open connection
            var connection = mySql.createConnection(connectionParams);
            connection.query('update posts set comments=comments+1 where post_id=?', [commentDetails.post_id], function (err, result, field) {
                connection.end();
                callback(null, result);
            });

        },
        function (result, callback) {
            //result contain data from above function
            if (result) {
                //open connection
                var connection = mySql.createConnection(connectionParams);
                connection.query('insert into comments (post_id, user_id, comment_pic, content, username, user_pic) values (?, ?, ?, ?, ?, ?)', [commentDetails.post_id, commentDetails.user_id, commentDetails.pic_name, commentDetails.comment, commentDetails.username, commentDetails.user_pic], function (insert_err, insert_result, insert_field) {
                    connection.end();
                    callback(null, 'success');
                });
            }
        }
    ], function (err, result) {
        console.log(result);
        res.send({
            message: result
        });
    });
};

exports.createPost = function (req, res) {
    var postDetails = {
        picture: req.query.pic_name != undefined ? baseUrl + 'posts/' + req.query.pic_name : null,
        description: req.query.post_desc,
    };
    //open connection
    var connection = mySql.createConnection(connectionParams);
    connection.query('insert into posts (picture , description) values (?, ?)', [postDetails.picture, postDetails.description], function (err, result, field) {
        connection.end();
        res.send({
            message: result
        });
    });
};