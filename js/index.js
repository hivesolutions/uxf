const async = require("./async");
const attr = require("./attr");
const base = require("./base");
const data = require("./data");
const error = require("./error");
const ui = require("./ui");

Object.assign(module.exports, async);
Object.assign(module.exports, attr);
Object.assign(module.exports, base);
Object.assign(module.exports, data);
Object.assign(module.exports, error);
Object.assign(module.exports, ui);

module.exports.VERSION = "__VERSION__";
