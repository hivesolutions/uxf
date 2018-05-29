const config = require("./webpack.config");

config.output.filename = "vue-uxf.full.min.js?[hash]";

delete config.externals.vue;

module.exports = config;
