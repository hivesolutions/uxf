const baseEnIso = require("./base.en_iso.part");
const baseEnIso2 = require("./base.en_iso2.part");
const baseEnIso3 = require("./base.en_iso3.part");
const baseEnUs = require("./base.en_us.part");
const basePtPt = require("./base.pt_pt.part");

Object.assign(module.exports, baseEnIso);
Object.assign(module.exports, baseEnIso2);
Object.assign(module.exports, baseEnIso3);
Object.assign(module.exports, baseEnUs);
Object.assign(module.exports, basePtPt);
