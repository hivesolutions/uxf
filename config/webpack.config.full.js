const config = require("./webpack.config");

config.output.filename = "ux-vue.full.min.js?[hash]";

delete config.externals.vue;

module.exports = config;
