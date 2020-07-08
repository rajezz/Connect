const body_parser = require('body-parser');
const mySql = require('mysql');
const path = require('path');
var express = require('express');
const faker = require('faker');
const async = require('async');

const connectionParams = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'TestDB',
};

exports.getposts = function (req, res) {
    var posts = [];
    var start_index = req.query.start_index;
    //open connection
    var connection = mySql.createConnection(connectionParams);

    connection.query('select posts.*, comments.content, comments.comment_pic, comments.user_id from posts left JOIN comments ON posts.post_id=comments.post_id where posts.post_id > ? and posts.post_id <= ?;', [start_index, parseInt(start_index) + 20], function (err, result, field) {
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
                    });
                } else {
                    if (post.content) {
                        postdetails = {
                            image: post.picture,
                            desc: post.description,
                            likes: post.likes,
                            comments_count: post.comments,
                            post_id: post.post_id,
                            comments: [{
                                user_id: post.user_id,
                                comment_pic: post.comment_pic,
                                content: post.content,
                                post_id: post.post_id,
                            }],
                        };
                    } else {
                        postdetails = {
                            image: post.picture,
                            desc: post.description,
                            likes: post.likes,
                            comments_count: post.comments,
                            post_id: post.post_id,
                            comments: [],
                        };
                    }
                    last_post_id = post.post_id;
                    posts.push(postdetails);
                }

            });
            connection.end();
            res.send({ posts: posts });
        }
    });
    //getcomments(posts, res);
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
                    if (remove_result) {
                        connection.end();
                        callback(null, 'decrement');
                    }
                });
            } else {
                //open connection
                var connection = mySql.createConnection(connectionParams);
                connection.query('insert into likes (post_id, user_id) values (?, ?)', [post_id, user_id], function (add_err, add_result, add_field) {
                    if (add_result) {
                        connection.end();
                        callback(null, 'increment');
                    }
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
        // result now equals to 'Task1 and Task2 completed'
        console.log(result);
        res.send({ message: result, process: process, });
    });


    /* connection.query('select * from likes where post_id=? and user_id=?', [post_id, user_id], function (err, result, field) {
        if (result && result.length > 0) {
            connection.end();
            connection.query('delete from likes where post_id=? and user_id=?', [post_id, user_id], function (remove_err, remove_result, remove_field) {
                if (remove_result) {
                    connection.end();
                    connection.query('update posts set likes=likes-1 where post_id=? and user_id=?', [post_id, user_id], function (decrement_err, decrement_result, decrement_field) {
                        if (decrement_result) {
                            connection.end();
                            res.send({ message: 'success'});
                        }
                        connection.end();
                        res.send({ message: 'failed'});
                    });
                }
            });
        } else {
            connection.end();
            connection.query('insert into likes (post_id, user_id) values (?, ?)', [post_id, user_id], function (add_err, add_result, add_field) {
                if (add_result) {
                    connection.end();
                    connection.query('update posts set likes=likes+1 where post_id=? and user_id=?', [post_id, user_id], function (increment_err, increment_result, increment_field) {
                        if (increment_result) {
                            connection.end();
                            res.send({ message: 'success'});
                        }
                        connection.end();
                        res.send({ message: 'failed'});
                    });
                }
            });
        }
    }); */
};


/*function getcomments(post) {

    connection.query('select * from comments where post_id=?', [post.post_id], function (comment_err, comment_result, comment_field) {
        if (comment_err) {
            console.log(comment_err);
        }
        if (comment_result && comment_result.length > 0) {
            let comments = [];
            comment_result.forEach(comment => {
                comments.push({
                    content: comment.content,
                    type: comment.type,
                    user_id: comment.user_id,
                })
            });
            post.comments = comments;
        }
    });
     posts.forEach(post => {
        connection.query('select * from comments where post_id=?', [post.post_id], function (comment_err, comment_result, comment_field) {
            if (comment_err) {
                console.log(comment_err);
            }
            if (comment_result && comment_result.length > 0) {
                let comments = [];
                comment_result.forEach(comment => {
                    comments.push({
                        content: comment.content,
                        type: comment.type,
                        user_id: comment.user_id,
                    })
                });
                post.comments = comments;
            }
        });
    });

}*/