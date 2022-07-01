const body_parser = require('body-parser');
const mySql = require('mysql');
const path = require('path');
var express = require('express');
const faker = require('faker');
const async = require('async');

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

exports.getposts = function (req, res) {
    var posts = [];
    var start_index = parseInt(req.query.start_index);
    async.waterfall([
        function (callback) {
            //open connection
            var connection = mySql.createConnection(connectionParams);
            connection.query('select post_id from posts order by post_id desc limit 1', function (err, result, field) {
                connection.end();
                if (result && result.length > 0) {
                    callback(null, result[0].post_id);
                } else {
                    callback(null, 0);
                }
            });

        },
        function (post_id, callback) {
            post_id = parseInt(post_id);
            //open connection
            var connection = mySql.createConnection(connectionParams);
            connection.query('select posts.*, comments.content, comments.comment_pic, comments.user_id, comments.username, comments.user_pic from posts left JOIN comments ON posts.post_id=comments.post_id where posts.post_id <= ? and posts.post_id > ?', [post_id - start_index, post_id - start_index - 20], function (err, result, field) {
                connection.end();
                if (result) {
                    var last_post_id = 0;
                    var postdetails;
                    result.forEach(post => {
                        if (post.post_id == last_post_id) {
                            postdetails.comments.push({
                                user_id: post.user_id,
                                comment_pic: post.comment_pic,
                                content: post.content,
                                post_id: post.post_id,
                                username: post.username,
                                user_pic: post.user_pic,
                            });
                        } else {
                            if (post.content || post.comment_pic) {
                                postdetails = {
                                    image: post.picture,
                                    desc: post.description,
                                    likes: post.likes,
                                    comments_count: post.comments,
                                    post_id: post.post_id,
                                    posted_on: post.posted_on,
                                    comments: [{
                                        user_id: post.user_id,
                                        comment_pic: post.comment_pic,
                                        content: post.content,
                                        post_id: post.post_id,
                                        username: post.username,
                                        user_pic: post.user_pic,
                                    }],
                                };
                            } else {
                                postdetails = {
                                    image: post.picture,
                                    desc: post.description,
                                    likes: post.likes,
                                    comments_count: post.comments,
                                    post_id: post.post_id,
                                    posted_on: post.posted_on,
                                    comments: [],
                                };
                            }
                            last_post_id = post.post_id;
                            posts.push(postdetails);
                        }
                    });
                    callback(null, posts)
                }
            });
        },
    ], function (err, posts) {
        res.send({ posts: posts });
    });
};


exports.generateposts = function (req, res) {
    for (let i = 0; i < 100; i++) {
        generatepost();
    }
    res.send({ message: 'posts generated' });
}

function generatepost() {
    var postdata = {
        picture: faker.fake('{{image.image}}'),
        description: faker.fake('{{lorem.paragraph}}'),
    };

    //open connection
    var connection = mySql.createConnection(connectionParams);

    connection.query('insert into  posts (picture, description) values (?, ?)', [postdata.picture, postdata.description], (err, result, field) => {
        if (err) { }
    });
}

exports.likePost = function (req, res) {
    var post_id = req.query.post_id;
    var user_id = req.query.user_id;
    async.waterfall([
        function (callback) {
            //open connection
            var connection = mySql.createConnection(connectionParams);
            connection.query('select * from likes where post_id=? and user_id=?', [post_id, user_id], function (err, result, field) {
                connection.end();
                callback(null, result);
            });

        },
        function (result, callback) {
            //result contain data from above function
            if (result && result.length > 0) {
                //open connection
                var connection = mySql.createConnection(connectionParams);
                connection.query('delete from likes where post_id=? and user_id=?', [post_id, user_id], function (remove_err, remove_result, remove_field) {
                    connection.end();
                    callback(null, 'decrement');
                });
            } else {
                //open connection
                var connection = mySql.createConnection(connectionParams);
                connection.query('insert into likes (post_id, user_id) values (?, ?)', [post_id, user_id], function (add_err, add_result, add_field) {
                    connection.end();
                    callback(null, 'increment');
                });
            }
        },
        function (process, callback) {
            //process contain either decrement or increment
            if (process == 'decrement') {
                //open connection
                var connection = mySql.createConnection(connectionParams);
                connection.query('update posts set likes=likes-1 where post_id=?', [post_id], function (decrement_err, decrement_result, decrement_field) {
                    if (decrement_result) {
                        connection.end();
                        callback(null, 'success', 'disliked');
                    } else {
                        connection.end();
                        callback(null, 'failed', 'disliked');
                    }

                });
            } else if (process == 'increment') {
                //open connection
                var connection = mySql.createConnection(connectionParams);
                connection.query('update posts set likes=likes+1 where post_id=?', [post_id], function (increment_err, increment_result, increment_field) {
                    if (increment_result) {
                        connection.end();
                        callback(null, 'success', 'liked');
                    } else {
                        connection.end();
                        callback(null, 'failed', 'liked');
                    }

                });
            }

        }
    ], function (err, result, process) {
        console.log(result);
        res.send({ message: result, process: process, });
    });
};

exports.commentPost = function (req, res) {
    var commentDetails = {
        post_id: req.query.post_id,
        user_id: req.query.user_id,
        comment: req.query.comment,
        pic_name: req.query.pic_name != undefined ? baseUrl + 'comments/' + req.query.pic_name : null,
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
        res.send({ message: result });
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
        res.send({ message: result });
    });
};