const config = require("./webpack.config");

config.entry = "./vue/examples";
config.output.filename = "vue-uxf.examples.min.js?[hash]";

delete config.externals.vue;

module.exports = config;
