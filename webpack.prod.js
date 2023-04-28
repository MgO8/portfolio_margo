const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = PATHS => {
  return merge(common(PATHS), {
    mode: "production",
    devtool: false
  });
};
