const datetime = require("./datetime.part");
const enumeration = require("./enumeration.part");
const money = require("./money.part");
const number = require("./number.part");
const template = require("./template.part");
const timestamp = require("./timestamp.part");
const wiki = require("./wiki.part");

Object.assign(module.exports, datetime);
Object.assign(module.exports, enumeration);
Object.assign(module.exports, money);
Object.assign(module.exports, number);
Object.assign(module.exports, template);
Object.assign(module.exports, timestamp);
Object.assign(module.exports, wiki);
