require("dotenv").config();
const webpack = require("webpack");

module.exports = ({ webpackPublicPath, src }) => {
  return {
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            chunks: "initial",
            name: "vendor",
            test: "vendor",
            enforce: true
          }
        }
      }
    },
    output: {
      publicPath: webpackPublicPath,
      filename: "[name].js",
      chunkFilename: "[name].js"
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".json"],
      alias: {
        "@": src.js.root
      },
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: "babel-loader",
          exclude: /node_modules/
        },
        {
          test: /\.ts?$/,
          exclude: /node_modules/,
          use: ["babel-loader"]
        },
        {
          test: /\.ejs$/,
          exclude: /node_modules/,
          loader: "ejs-loader"
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        API_HOST: JSON.stringify(process.env.API_HOST)
      })
    ]
  };
};
