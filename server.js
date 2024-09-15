#!/usr/bin/env node

"use strict";

import express from "express";
import { upload } from "./fileHandling.js";
import { convertFlacs } from "./utils/convertFlacs.js";

const app = express();

const template = `
  <form action="/uploads" method="post" encType="multipart/form-data">
    <input type="file" name="file" />
    <input type="submit" value="Upload" />
  </form>
`;

app.get("/", (req, res) => {
  res.send(template);
});

export const uploadsPath = "uploads";

app.post(`/${uploadsPath}`, upload.single("file"), async (req, res) => {
  try {
    const mp3Files = await convertFlacs();

    // Send the converted files
    mp3Files.forEach((file) => {
      res.redirect(`/downloads
        /${file}`);
    });
  } catch (error) {
    console.error("Error processing files:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
