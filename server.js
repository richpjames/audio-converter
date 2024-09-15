#!/usr/bin/env node

"use strict";

import express from "express";
import { upload } from "./fileHandling.js";
import { convertFlacs } from "./utils/convertFlacs.js";
import { readFile } from "fs/promises";

const app = express();

const template = `
  <form action="/uploads" method="post" encType="multipart/form-data">
    <input type="file" name="file" multiple="multiple"/>
    <input type="submit" value="Upload" />
  </form>
`;

app.get("/", (req, res) => {
  res.send(template);
});

export const uploadsPath = "uploads";

app.post(`/${uploadsPath}`, upload.array("file"), async (req, res) => {
  try {
    const mp3Files = await convertFlacs();

    // Send the converted files
    mp3Files.forEach((file) => {
      console.log(file);
      const path = `/downloads/${file}`;
      app.get(path, async (req, res) => {
        const file = await readFile(path);
        res.send(file);
      });
    });
    console.log("done!");
    res.redirect(`/downloads`);
  } catch (error) {
    console.error("Error processing files:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
