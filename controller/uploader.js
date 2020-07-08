var multer  = require('multer');
var fs = require('fs');
var uploadedFiles = '';

//for uploading profile pictures
var profile_storage = multer.diskStorage({

  destination: function (req, file, callback) {

		var dirPath = 'uploads/profile/';
		if (!fs.existsSync(dirPath))			
			fs.mkdirSync(dirPath); 
		callback(null, dirPath);
  },
  filename: function (req, file, callback) {

      callback(null, file.originalname);

      uploadedFiles = file.originalname;
  }
});

var upload_profile_pic = multer({ storage: profile_storage }).single('image');

exports.uploadProfileImage = function(req, res) {
  upload_profile_pic(req, res, (err) => {
      res.send(uploadedFiles);
    });
};
/* ------end------ */



//for uploading comment images
var comment_storage = multer.diskStorage({

  destination: function (req, file, callback) {

		var dirPath = 'uploads/comments/';
		if (!fs.existsSync(dirPath))			
			fs.mkdirSync(dirPath); 
		callback(null, dirPath);
  },
  filename: function (req, file, callback) {

      callback(null, file.originalname);

      uploadedFiles = file.originalname;
  }
});

var upload_comment_pic = multer({ storage: comment_storage }).single('image');

exports.uploadCommentImage = function(req, res) {
  upload_comment_pic(req, res, (err) => {
      res.send(uploadedFiles);
    });
};
/* ------end------ */


//for uploading post images
var post_storage = multer.diskStorage({

  destination: function (req, file, callback) {

		var dirPath = 'uploads/posts/';
		if (!fs.existsSync(dirPath))			
			fs.mkdirSync(dirPath); 
		callback(null, dirPath);
  },
  filename: function (req, file, callback) {

      callback(null, file.originalname);

      uploadedFiles = file.originalname;
  }
});

var upload_post_pic = multer({ storage: post_storage }).single('image');

exports.uploadPostImage = function(req, res) {
  upload_post_pic(req, res, (err) => {
      res.send(uploadedFiles);
    });
};
/* ------end------ */