const path = require("path");
const webpack = require("webpack");

const vueLoader = require("vue-loader");

const VueLoaderPlugin = vueLoader.VueLoaderPlugin;

module.exports = {
    entry: "./vue",
    output: {
        path: path.join(__dirname, "../dist"),
        filename: "ux-vue.min.js?[hash]",
        library: "UxVue",
        libraryTarget: "umd"
    },
    plugins: [
        new VueLoaderPlugin({})
    ],
    module: {
        rules: [{
            test: /\.vue$/,
            loader: "vue-loader",
            options: {
                loaders: {
                    js: "babel-loader!eslint-loader",
                    scss: "vue-style-loader!css-loader!sass-loader",
                    sass: "vue-style-loader!css-loader!sass-loader?indentedSyntax"
                }
            }
        }, {
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
        }, {
            test: /\.(scss|sass)$/,
            use: [{
                loader: "style-loader"
            }, {
                loader: "css-loader"
            }, {
                loader: "sass-loader"
            }]
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [{
                loader: "babel-loader",
                query: {
                    presets: ["env"]
                }
            }, {
                loader: "eslint-loader"
            }]
        }, {
            test: /\.(png|jpg|gif|svg|ico)$/,
            loader: "file-loader",
            options: {
                name: "[name].[ext]?[hash]"
            }
        }, {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            loader: "file-loader"
        }]
    },
    resolve: {
        alias: {
            "base$": "../../../js",
            "vue$": "vue/dist/vue.esm.js"
        }
    },
    externals: {
        vue: "Vue.js"
    },
    performance: {
        hints: false
    },
    devtool: "inline-source-map"
};

if (process.env.NODE_ENV === "production") {
    module.exports.devtool = "source-map";
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("production")
        })
    ]);
}
