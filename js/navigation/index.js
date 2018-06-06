const cursor = require("./cursor.part");
const focus = require("./focus.part");
const next = require("./next.part");
const previous = require("./previous.part");
const scrollTo = require("./scroll_to.part");
const scroll = require("./scroll.part");
const visible = require("./visible.part");

Object.assign(module.exports, cursor);
Object.assign(module.exports, focus);
Object.assign(module.exports, next);
Object.assign(module.exports, previous);
Object.assign(module.exports, scrollTo);
Object.assign(module.exports, scroll);
Object.assign(module.exports, visible);
