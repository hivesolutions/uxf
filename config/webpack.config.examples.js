const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const config = require("./webpack.config.full");

config.entry = "./vue/examples";
config.output.filename = "vue-uxf.examples.min.js?[hash]";
config.devServer = {
    contentBase: path.join(__dirname, "../dist"),
    compress: false,
    port: 3000,
    stats: "minimal",
    hot: true
};

config.plugins.push(
    new HtmlWebpackPlugin({
        title: "Vue UXF",
        template: "examples/vue/index.html",
        cache: false,
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            conservativeCollapse: false,
            preserveLineBreaks: false
        }
    })
);

module.exports = config;
