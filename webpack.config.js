const path = require("path");

const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";

module.exports = {
  mode: process.env.NODE_ENV,

  entry: {
    background: "./src/background/index.ts",
  },

  output: {
    path: path.join(__dirname, "bin"),
    filename: (chunkData) => {
      switch (chunkData.chunk.name) {
        case "background":
          return "background.bundle.js";
        default:
          return "[name].bundle.js";
      }
    },
  },

  devtool: isDev ? "source-map" : false,

  resolve: {
    extensions: [".wasm", ".mjs", ".js", ".jsx", ".ts", ".tsx", ".json"],
  },

  module: {
    rules: [
      {
        // not on test files
        test: /^[^.]+\.tsx?$/,
        use: {
          loader: "ts-loader",
        },
      },
    ],
  },

  plugins: [
    // remove old build files before run (prod only!)
    new CleanWebpackPlugin({
      dry: isDev,
      cleanOnceBeforeBuildPatterns: ["**/*"],
    }),

    // copy static files
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/manifest.json", to: "" },
        {
          from: "src/content_scripts",
          to: "content_scripts",
        },
        { from: "img/extension", to: "img" },
        { from: "src/ui", to: "ui" },
      ],
    }),

    // add banner at top of file
    new webpack.BannerPlugin({
      banner: `hash:[hash], builtAt:${Date.now()}, isDev:${
        isDev ? "true" : "false"
      }`,
      entryOnly: true,
    }),
  ],
};
