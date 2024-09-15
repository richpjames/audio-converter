import { uploadsPath } from "../server.js";
import { readdir } from "fs/promises";
import path from "path";
import ffmpeg from "fluent-ffmpeg";

const downloadsPath = "downloads";

export const convertFlacs = async () => {
  const filePaths = await readdir(uploadsPath);

  const mp3Files = await Promise.all(
    filePaths.map(async (filePath) => {
      const fullPath = path.join(uploadsPath, filePath);

      // Check if the file is a .flac file
      if (path.extname(filePath).toLowerCase() !== ".flac") {
        console.error(`Skipping non-flac file: ${filePath}`);
        return null;
      }

      // Convert the file to mp3
      const mp3File = filePath.replace(".flac", ".mp3");
      await new Promise((resolve, reject) => {
        ffmpeg(fullPath)
          .toFormat("mp3")
          .saveToFile(path.join(downloadsPath, mp3File))
          .on("end", resolve)
          .on("error", reject);
      });

      return mp3File;
    })
  );

  // Filter out null values (non-flac files)
  return mp3Files.filter((file) => file !== null);
};
