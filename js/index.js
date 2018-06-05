const async = require("./async");
const attr = require("./attr");
const base = require("./base");
const data = require("./data");
const error = require("./error");
const event = require("./event");
const expr = require("./expr");
const external = require("./external");
const gateway = require("./gateway");
const information = require("./information");
const keyboard = require("./keyboard");
const layout = require("./layout");
const locale = require("./locale");
const ui = require("./ui");

Object.assign(module.exports, async);
Object.assign(module.exports, attr);
Object.assign(module.exports, base);
Object.assign(module.exports, data);
Object.assign(module.exports, error);
Object.assign(module.exports, event);
Object.assign(module.exports, expr);
Object.assign(module.exports, external);
Object.assign(module.exports, gateway);
Object.assign(module.exports, information);
Object.assign(module.exports, keyboard);
Object.assign(module.exports, layout);
Object.assign(module.exports, locale)
Object.assign(module.exports, ui);

module.exports.VERSION = "__VERSION__";
