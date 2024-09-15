import path from "path";

import multer from "multer";

const fileFilter = (req, file, cb) => {
  // Allowed file types
  const fileTypes = /flac/;
  // Check the file extension
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  // Check the mime type
  const mimetype = fileTypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(
      new Error(
        "Error: File upload only supports the following filetypes - " +
          fileTypes
      )
    );
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});
