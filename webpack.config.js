const path = require("path");

const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ProgressBarWebpackPlugin = require("progress-bar-webpack-plugin");
const ExtensionReloader = require("webpack-extension-reloader");
const remotedev = require("remotedev-server");

const isDev = process.env.NODE_ENV === "development";

if (isDev) {
  remotedev({ hostname: "localhost", port: 9000 });
}

module.exports = {
  mode: process.env.NODE_ENV,

  entry: {
    background: "./src/background/index.ts",
    settings: "./src/ui/settings/index.tsx",
    oauth2response: "./src/ui/oauth2response/index.tsx",
    dashboardContentScript: "./src/content_scripts/dashboard/index.ts",
    courseHomeContentScript: "./src/content_scripts/course_home/index.ts",
  },

  output: {
    path: path.join(__dirname, "bin"),
    filename: (chunkData) => {
      switch (chunkData.chunk.name) {
        case "background":
          return "background.bundle.js";
        case "settings":
          return "ui/settings/index.bundle.js";
        case "oauth2response":
          return "ui/oauth2response/index.bundle.js";
        case "dashboardContentScript":
          return "content_scripts/dashboard/index.bundle.js";
        case "courseHomeContentScript":
          return "content_scripts/course_home/index.bundle.js";
        default:
          return "[name].bundle.js";
      }
    },
  },

  devtool: isDev ? "inline-source-map" : false,

  resolve: {
    extensions: [".wasm", ".mjs", ".js", ".jsx", ".ts", ".tsx", ".json"],
  },

  module: {
    rules: [
      // using babel instead of ts-loader because of babel-plugin-import
      // {
      //   // not on test files
      //   test: /^[^.]+\.tsx?$/,
      //   use: {
      //     loader: "ts-loader",
      //   },
      // },
      {
        test: /\.css$/i,
        use: [
          // {
          //   loader: MiniCssExtractPlugin.loader,
          //   options: {},
          // },
          "style-loader",
          "css-loader",
        ],
      },
      {
        test: /\.[jt]sx?$/,
        loader: "eslint-loader",
        enforce: "pre",
      },
      {
        test: /\.[jt]sx?$/,
        loader: "babel-loader",
        options: {
          presets: [
            "@babel/preset-env",
            "@babel/preset-typescript",
            "@babel/preset-react",
          ],
          compact: true,
          plugins: [
            "@babel/proposal-class-properties",
            "@babel/proposal-object-rest-spread",
            [
              "babel-plugin-import",
              {
                libraryName: "react-bootstrap",
                style: false,
                libraryDirectory: "",
                camel2DashComponentName: false,
              },
              "babel-plugin-import-react-bootstrap",
            ],
            [
              "babel-plugin-import",
              {
                libraryName: "lodash",
                libraryDirectory: "",
                camel2DashComponentName: false,
              },
              "babel-plugin-import-lodash",
            ],
          ],
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

    // new MiniCssExtractPlugin(),

    new HtmlWebpackPlugin({
      filename: "ui/settings/index.html",
      template: "src/ui/settings/index.html",
      chunks: ["settings"],
    }),

    new HtmlWebpackPlugin({
      filename: "ui/oauth2response/index.html",
      template: "src/ui/oauth2response/index.html",
      chunks: ["oauth2response"],
    }),

    // copy static files
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/manifest.json", to: "" },
        {
          from: "src/content_scripts/",
          to: "content_scripts",
          globOptions: {
            ignore: ["**/*.(js|ts|tsx)"],
          },
        },
        { from: "img/extension", to: "img" },
        // { from: "src/ui", to: "ui" },
      ],
    }),

    // new ExtensionReloader({
    //   entries: {
    //     background: "background",
    //     "content-script": ["dashboardContentScript", "courseHomeContentScript"],
    //     extensionPage: ["settings", "oauth2response"],
    //   },
    // }),

    new ProgressBarWebpackPlugin(),

    // add banner at top of file
    new webpack.BannerPlugin({
      banner: `${
        !isDev &&
        "Reverse-engineering any part of CanvasCBL is against our terms of service, which you can find at https://go.canvascbl.com/tos. // "
      }xxhash:[hash], builtAt:${Date.now()}, isDev:${isDev ? "true" : "false"}`,
      entryOnly: true,
    }),
  ],
};
