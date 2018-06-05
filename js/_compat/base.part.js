var jquery = require("jquery");
var jQuery = null;
if (typeof __webpack_require__ !== "function") { // eslint-disable-line camelcase
    var jsdom = require("jsdom");
    global.dom = global.dom || new jsdom.JSDOM("");
    global.jQuery = global.jQuery || jquery(global.dom.window);
    jQuery = global.jQuery;
} else {
    jQuery = jquery;
}

module.exports.jQuery = jQuery;
