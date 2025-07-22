// multer is a middleware for handling multipart/form-data, which is primarily used for file uploads

import multer from "multer";
// storage
const storage = multer.memoryStorage();

// filter file
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    // call back function, no error
    cb(null, true);
  } else {
    // if file is not image, error
    cb(new Error("Only image files are allowed"), false);
  }
};

// upload function
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export default upload;
