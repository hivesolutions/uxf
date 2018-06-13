const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const config = require("uxf-webpack/config/webpack.config.full");

config.entry = "./main.js";
config.devServer = {
    contentBase: path.join(__dirname, "dist"),
    compress: false,
    port: 3000,
    stats: "minimal",
    hot: true
};

config.plugins.push(
    new HtmlWebpackPlugin({
        title: "uxFramework Vue",
        template: "./index.html",
        cache: false,
        inject: "head",
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            conservativeCollapse: false,
            preserveLineBreaks: false
        }
    })
);

module.exports = config;
