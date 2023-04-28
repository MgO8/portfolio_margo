const webpack = require("webpack");
const { merge } = require("webpack-merge");
const path = require("path");
const common = require("./webpack.common.js");

module.exports = PATHS => {
  return merge(common(PATHS), {
    mode: "development",
    devtool: "inline-source-map"
  });
};
