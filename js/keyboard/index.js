const ctrl = require("./ctrl.part");
const key = require("./key.part");
const scan = require("./scan.part");
const shortcuts = require("./shortcuts.part");

Object.assign(module.exports, ctrl);
Object.assign(module.exports, key);
Object.assign(module.exports, scan);
Object.assign(module.exports, shortcuts);
