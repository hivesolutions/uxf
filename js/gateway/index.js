const base = require("./base.part");
const gateway = require("./gateway.part");
const print = require("./print.part");

Object.assign(module.exports, base);
Object.assign(module.exports, gateway);
Object.assign(module.exports, print);
