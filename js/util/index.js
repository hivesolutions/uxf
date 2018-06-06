const _eval = require("./eval.part");
const nameChange = require("./name_change.part");
const width = require("./width.part");

Object.assign(module.exports, _eval);
Object.assign(module.exports, nameChange);
Object.assign(module.exports, width);
