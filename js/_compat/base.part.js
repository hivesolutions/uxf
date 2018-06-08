var jquery = require("jquery");
if (typeof __webpack_require__ === "undefined") { // eslint-disable-line camelcase
    var jsdom = require("jsdom");
    global.dom = global.dom || new jsdom.JSDOM("");
    global.jQuery = global.jQuery || jquery(global.dom.window);
    module.exports.jQuery = global.jQuery;
    module.exports.window = global.dom.window;
} else {
    module.exports.jQuery = jquery;
    module.exports.window = window;
}
