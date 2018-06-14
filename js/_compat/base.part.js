var jquery = require("jquery");
// eslint-disable-next-line camelcase
if (typeof __webpack_require__ === "undefined") {
    var jsdom = require("jsdom");
    global.dom = global.dom || new jsdom.JSDOM("");
    global.jQuery = global.jQuery || jquery(global.dom.window);
    module.exports.jQuery = global.jQuery;
    module.exports.window = global.dom.window;
} else {
    module.exports.jQuery = jquery;
    module.exports.window = window;
    window.$ = window.jQuery = jquery;
}
