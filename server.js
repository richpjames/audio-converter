#!/usr/bin/env node

"use strict";

import path from "path";
import express from "express";
import multer from "multer";

// Define the file filter function
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

const upload = multer({
  storage: storage,

  fileFilter: fileFilter,
});

const app = express();

app.get("/", (req, res) => {
  res.send(`
    <form action="/upload" method="post" encType="multipart/form-data">
      <input type="file" name="file" />
      <input type="submit" value="Upload" />
    </form>
  `);
});

app.post("/upload", upload.single("file"), (req, res) => {
  console.log(req.file); // File information
  res.send(`bosh
    <form action="/upload" method="post" encType="multipart/form-data">
      <input type="file" name="file" />
      <input type="submit" value="Upload" />
    </form>
  `);
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
