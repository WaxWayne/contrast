const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./js_contrast.js",
  output: {
    path: __dirname + "/dist",
    filename: "index.js"
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Image Contrast Manipulation",
      template: "./index.html"
    })
  ],
  mode: 'development'  
};
