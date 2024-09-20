import html from "@rollup/plugin-html";
import nodeResolve from "@rollup/plugin-node-resolve";

export default {
  input: "./main.js",
  output: {
    dir: "./dist",
    format: "esm",
  },
  preview: {
    port: 3000,
  },

  server: {
    port: 3000,
    host: "0.0.0.0",
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
  optimizeDeps: {
    exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util"],
  },

  plugins: [
    html({
      attributes: { lang: "en" },
      fileName: "index.html",
      meta: [{ charset: "utf-8" }],
    }),
  ],
};
