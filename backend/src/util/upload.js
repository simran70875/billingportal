const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "assets/images/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name for storage
  },
});

const upload = multer({ storage: storage });

module.exports = upload;

exports.icContainesFiles = (files) => {
  return new Promise((resolve, reject) => {
    if (JSON.stringify(files) == "{}") {
      reject("does not containes any files");
    }
    resolve(true);
  });
};
