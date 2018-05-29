const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const config = require("./webpack.config.full");

config.entry = "./vue/examples";
config.output.filename = "ux-vue.examples.min.js?[hash]";
config.devServer = {
    contentBase: path.join(__dirname, "../dist"),
    compress: false,
    port: 3000,
    stats: "minimal",
    hot: true
};

config.plugins.push(
    new HtmlWebpackPlugin({
        title: "UX Framework Vue",
        template: "examples/vue/index.html",
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
