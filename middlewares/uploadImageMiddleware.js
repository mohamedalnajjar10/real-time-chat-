const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const multerOptions = () => {
  const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/images"); 
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname); 
      const filename = `User-${uuidv4()}-${Date.now()}${ext}`;
      cb(null, filename);
    },
  });

  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new Error("Only Images allowed"), false);
    }
  };

  return multer({ storage: multerStorage, fileFilter: multerFilter });
};

exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);
