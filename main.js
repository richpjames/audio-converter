import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

const form = document.querySelector("form");
const fileInput = document.getElementById("file");

form.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent the default form submission

  const files = fileInput.files; // Get the files from the file input
  const readFiles = [];
  for (const file of files) {
    // Validate the file type and size
    if (!file.type.match("audio/flac")) {
      console.error("Invalid file type:", file.type);
      continue;
    }

    // Read the file contents
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log("File contents:", e.target.result);
    };
    readFiles.push(() => reader.readAsDataURL(file));
  }
  console.log("Read files:", readFiles);
});

let ffmpeg = null;

const transcode = async ({ target: { files } }) => {
  const message = document.getElementById("message");
  const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm";

  if (ffmpeg === null) {
    ffmpeg = new FFmpeg();

    ffmpeg.on("log", ({ message }) => {
      console.log(message);
    });
    ffmpeg.on("progress", ({ progress }) => {
      message.innerHTML = `${progress * 100} %`;
    });
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
      workerURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.worker.js`,
        "text/javascript"
      ),
    });
  }
  const { name } = files[0];
  try {
    await ffmpeg.writeFile(name, await fetchFile(files[0]));
  } catch (e) {
    console.log(e);
  }
  message.innerHTML = "Start transcoding";
  await ffmpeg.exec(["-i", name, "output.mp3"]);
  message.innerHTML = "Complete transcoding";
  const data = await ffmpeg.readFile("output.mp3");

  const audioPlayer = document.getElementById("output-audio");
  audioPlayer.src = URL.createObjectURL(
    new Blob([data.buffer], { type: "audio/mp3" })
  );
};

const elm = document.getElementById("file");
elm.addEventListener("change", transcode);
