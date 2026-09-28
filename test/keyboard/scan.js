const assert = require("assert");
require("../../js");

global.document = global.document || global.dom.window.document;

describe("UxScan", function() {
    describe("#basic", function() {
        it("should be defined", () => {
            const jQuery = global.jQuery;
            assert.notStrictEqual(jQuery.fn.uxscan, undefined);
        });
        it("should trigger the scan with the key codes", () => {
            const jQuery = global.jQuery;
            const scans = [];

            jQuery(document).unbind().removeData();
            jQuery("body").empty();
            jQuery("body").append('<div class="scan"></div>');
            jQuery(".scan").uxscan();
            jQuery(document).bind("scan", (event, value) => scans.push(value));

            for (const character of "5474010022000000001234") {
                keyup(jQuery, undefined, character.charCodeAt(0));
            }
            keyup(jQuery, undefined, 13);

            assert.deepStrictEqual(scans, ["5474010022000000001234"]);
        });
        it("should trigger the scan with the typed characters", () => {
            const jQuery = global.jQuery;
            const scans = [];
            const code = "A:123456789*B:999999990*G:FS MST/000001*H:ABCD1234-000001*Q:abcd";

            jQuery(document).unbind().removeData();
            jQuery("body").empty();
            jQuery("body").append('<div class="scan"></div>');
            jQuery(".scan").uxscan();
            jQuery(document).bind("scan", (event, value) => scans.push(value));

            for (const character of code) {
                keyup(jQuery, character, KEY_CODES[character] || character.charCodeAt(0));
            }
            keyup(jQuery, "Enter", 13);

            assert.deepStrictEqual(scans, [code]);
        });
        it("should ignore the shift key of the shifted characters", () => {
            const jQuery = global.jQuery;
            const scans = [];
            const code = "A:123456789*B:999999990*G:FS MST/000001*H:ABCD1234-000001";

            jQuery(document).unbind().removeData();
            jQuery("body").empty();
            jQuery("body").append('<div class="scan"></div>');
            jQuery(".scan").uxscan();
            jQuery(document).bind("scan", (event, value) => scans.push(value));

            for (const character of code) {
                keyup(jQuery, character, KEY_CODES[character] || character.charCodeAt(0));
                if (SHIFTED.includes(character)) keyup(jQuery, "Shift", 16);
            }
            keyup(jQuery, "Enter", 13);

            assert.deepStrictEqual(scans, [code]);
        });
        it("should ignore the shift key code when the key is not available", () => {
            const jQuery = global.jQuery;
            const scans = [];

            jQuery(document).unbind().removeData();
            jQuery("body").empty();
            jQuery("body").append('<div class="scan"></div>');
            jQuery(".scan").uxscan();
            jQuery(document).bind("scan", (event, value) => scans.push(value));

            for (const character of "ABCD1234") {
                keyup(jQuery, undefined, character.charCodeAt(0));
                if (SHIFTED.includes(character)) keyup(jQuery, undefined, 16);
            }
            keyup(jQuery, undefined, 13);

            assert.deepStrictEqual(scans, ["ABCD1234"]);
        });
        it("should ignore the non character keys of the scans", () => {
            const jQuery = global.jQuery;
            const scans = [];
            const code = "A:123456789*B:999999990*G:FS MST/000001";

            jQuery(document).unbind().removeData();
            jQuery("body").empty();
            jQuery("body").append('<div class="scan"></div>');
            jQuery(".scan").uxscan();
            jQuery(document).bind("scan", (event, value) => scans.push(value));

            for (const character of code) {
                keyup(jQuery, character, KEY_CODES[character] || character.charCodeAt(0));
                for (const [key, keyCode] of NON_CHARACTER_KEYS) keyup(jQuery, key, keyCode);
            }
            keyup(jQuery, "Enter", 13);

            assert.deepStrictEqual(scans, [code]);
        });
        it("should not count the shift key for the minimum length", () => {
            const jQuery = global.jQuery;
            const scans = [];

            jQuery(document).unbind().removeData();
            jQuery("body").empty();
            jQuery("body").append('<div class="scan"></div>');
            jQuery(".scan").uxscan();
            jQuery(document).bind("scan", (event, value) => scans.push(value));

            for (const character of "ABCDE") {
                keyup(jQuery, character, character.charCodeAt(0));
                keyup(jQuery, "Shift", 16);
            }
            keyup(jQuery, "Enter", 13);

            assert.deepStrictEqual(scans, []);
        });
    });
});

const KEY_CODES = { ":": 186, "*": 56, "/": 191, "-": 189, a: 65, b: 66, c: 67, d: 68 };

const SHIFTED = ":*ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const NON_CHARACTER_KEYS = [
    ["Control", 17],
    ["Alt", 18],
    ["AltGraph", 225],
    ["CapsLock", 20],
    ["Dead", 222]
];

const keyup = (jQuery, key, keyCode) => {
    const event = jQuery.Event("keyup", { key: key, keyCode: keyCode });
    jQuery(document).trigger(event);
};
