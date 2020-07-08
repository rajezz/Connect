var multer  = require('multer');
var fs = require('fs');
var uploadedFiles = '';
var storage = multer.diskStorage({

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

var upload = multer({ storage: storage }).single('image');

exports.uploadImage = function(req, res) {
    upload(req, res, (err) => {
      res.send(uploadedFiles);
    }); 

    
};