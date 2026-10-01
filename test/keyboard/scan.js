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
        it("should use the key codes of the unidentified keys", () => {
            const jQuery = global.jQuery;
            const scans = [];

            jQuery(document).unbind().removeData();
            jQuery("body").empty();
            jQuery("body").append('<div class="scan"></div>');
            jQuery(".scan").uxscan();
            jQuery(document).bind("scan", (event, value) => scans.push(value));

            for (const character of "ABCD1234") {
                keyup(jQuery, "Unidentified", character.charCodeAt(0));
                if (SHIFTED.includes(character)) keyup(jQuery, "Unidentified", 16);
            }
            keyup(jQuery, "Unidentified", 13);

            assert.deepStrictEqual(scans, ["ABCD1234"]);
        });
        it("should keep the legacy space key of the scans", () => {
            const jQuery = global.jQuery;
            const scans = [];
            const code = "A:123456789*B:999999990*G:FS MST/000001";

            jQuery(document).unbind().removeData();
            jQuery("body").empty();
            jQuery("body").append('<div class="scan"></div>');
            jQuery(".scan").uxscan();
            jQuery(document).bind("scan", (event, value) => scans.push(value));

            for (const character of code) {
                const key = character === " " ? "Spacebar" : character;
                keyup(jQuery, key, KEY_CODES[character] || character.charCodeAt(0));
            }
            keyup(jQuery, "Enter", 13);

            assert.deepStrictEqual(scans, [code]);
        });
        it("should use the characters of the US layout of the pressed keys", () => {
            const jQuery = global.jQuery;
            const code = "A:123456789*B:999999990*G:FS MST/000001*H:ABCD1234-000001*Q:abyz";

            for (const layout of [PT_TYPED, FR_TYPED, DE_TYPED]) {
                const scans = [];
                const typedCode = [...code].map(character => layout[character] || character);

                jQuery(document).unbind().removeData();
                jQuery("body").empty();
                jQuery("body").append('<div class="scan"></div>');
                jQuery(".scan").uxscan();
                jQuery(document).bind("scan", (event, value, alternative) =>
                    scans.push([value, alternative])
                );

                for (const character of code) {
                    const [physical, shift] = physicalKey(character, US_KEYS);
                    const typed = layout[character] || character;
                    const keyCode = KEY_CODES[character] || character.charCodeAt(0);
                    keydown(jQuery, typed, keyCode, physical, shift);
                    keyup(jQuery, typed, keyCode, physical, shift);
                }
                keyup(jQuery, "Enter", 13);

                assert.deepStrictEqual(scans, [[code, typedCode.join("")]]);
            }
        });
        it("should use the shift state of the key presses", () => {
            const jQuery = global.jQuery;
            const scans = [];

            jQuery(document).unbind().removeData();
            jQuery("body").empty();
            jQuery("body").append('<div class="scan"></div>');
            jQuery(".scan").uxscan();
            jQuery(document).bind("scan", (event, value, alternative) =>
                scans.push([value, alternative])
            );

            for (const [type, key, code, keyCode, shiftKey] of SCANNER_EVENTS) {
                const trigger = type === "keydown" ? keydown : keyup;
                trigger(jQuery, key, keyCode, code, shiftKey);
            }
            keyup(jQuery, "Enter", 13);

            assert.deepStrictEqual(scans, [["A:506721086*", "AÇ506721086("]]);
        });
        it("should keep the typed characters of the pressed keys", () => {
            const jQuery = global.jQuery;
            const code = "A:123456789*B:999999990*G:FS MST/000001*H:ABCD1234-000001*Q:abyz";

            for (const [keys, value] of [
                [PT_KEYS, "A>123456789{B>999999990{G>FS MST&000001{H>ABCD1234/000001{Q>abyz"],
                [DE_KEYS, "A>123456789}B>999999990}G>FS MST&000001}H>ABCD1234/000001}Q>abzy"]
            ]) {
                const scans = [];

                jQuery(document).unbind().removeData();
                jQuery("body").empty();
                jQuery("body").append('<div class="scan"></div>');
                jQuery(".scan").uxscan();
                jQuery(document).bind("scan", (event, value, alternative) =>
                    scans.push([value, alternative])
                );

                for (const character of code) {
                    const [physical, shift] = physicalKey(character, keys);
                    const keyCode = KEY_CODES[character] || character.charCodeAt(0);
                    keydown(jQuery, character, keyCode, physical, shift);
                    keyup(jQuery, character, keyCode, physical, shift);
                }
                keyup(jQuery, "Enter", 13);

                assert.deepStrictEqual(scans, [[value, code]]);
            }
        });
        it("should use the typed digits of the scans", () => {
            const jQuery = global.jQuery;
            const code = "5474010022000000001234";

            for (const [shift, typed, alternative] of [
                [true, character => character, "%$&$)!))@@))))))))!@#$"],
                [false, character => FR_TYPED[character], code]
            ]) {
                const scans = [];

                jQuery(document).unbind().removeData();
                jQuery("body").empty();
                jQuery("body").append('<div class="scan"></div>');
                jQuery(".scan").uxscan();
                jQuery(document).bind("scan", (event, value, alternative) =>
                    scans.push([value, alternative])
                );

                for (const character of code) {
                    const keyCode = character.charCodeAt(0);
                    keydown(jQuery, typed(character), keyCode, "Digit" + character, shift);
                    keyup(jQuery, typed(character), keyCode, "Digit" + character, shift);
                }
                keyup(jQuery, "Enter", 13);

                assert.deepStrictEqual(scans, [
                    [code, shift ? alternative : [...code].map(typed).join("")]
                ]);
            }
        });
        it("should restart the sequences after the scan interval", () => {
            const jQuery = global.jQuery;
            const scans = [];
            const code = "A:123456789*B:999999990";

            jQuery(document).unbind().removeData();
            jQuery("body").empty();
            jQuery("body").append('<div class="scan"></div>');
            jQuery(".scan").uxscan();
            jQuery(document).bind("scan", (event, value, alternative) =>
                scans.push([value, alternative])
            );

            const scan = time => {
                clock(time);
                for (const character of code) {
                    const [physical, shift] = physicalKey(character, US_KEYS);
                    const typed = PT_TYPED[character] || character;
                    keydown(jQuery, typed, KEY_CODES[character], physical, shift);
                    keyup(jQuery, typed, KEY_CODES[character], physical, shift);
                }
                keyup(jQuery, "Enter", 13);
            };

            try {
                clock(1000);
                keydown(jQuery, "x", 88, "KeyX", false);
                keyup(jQuery, "x", 88, "KeyX", false);
                clock(1200);
                keydown(jQuery, "y", 89, "KeyY", false);
                keyup(jQuery, "y", 89, "KeyY", false);
                scan(2000);
                clock(3000);
                keydown(jQuery, "z", 90, "KeyZ", false);
                keyup(jQuery, "z", 90, "KeyZ", false);
                scan(4000);
            } finally {
                global.Date = DATE;
            }

            assert.deepStrictEqual(scans, [
                [code, "AÇ123456789(BÇ999999990"],
                [code, "AÇ123456789(BÇ999999990"]
            ]);
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
        it("should stop the propagation of the keys of a scan", () => {
            const jQuery = global.jQuery;
            const scans = [];
            const propagated = [];
            const code = "5474010022000000001234";

            jQuery(document).unbind().removeData();
            jQuery("body").empty();
            jQuery("body").append('<div class="scan"></div>');
            jQuery(".scan").uxscan();
            jQuery(document).bind("scan", (event, value) => scans.push(value));
            jQuery(document).bind("keydown keyup", event =>
                propagated.push(event.type + ":" + event.key)
            );

            for (const character of code) {
                keydown(jQuery, character, character.charCodeAt(0), "Digit" + character, false);
                keyup(jQuery, character, character.charCodeAt(0), "Digit" + character, false);
            }
            keydown(jQuery, "Enter", 13, "Enter", false);
            keyup(jQuery, "Enter", 13, "Enter", false);

            assert.deepStrictEqual(scans, [code]);
            assert.deepStrictEqual(propagated, ["keydown:5"]);
        });
        it("should stop the propagation of the keys of an invalid scan", () => {
            const jQuery = global.jQuery;
            const scans = [];
            const propagated = [];

            jQuery(document).unbind().removeData();
            jQuery("body").empty();
            jQuery("body").append('<div class="scan"></div>');
            jQuery(".scan").uxscan();
            jQuery(document).bind("scan", (event, value) => scans.push(value));
            jQuery(document).bind("keydown keyup", event =>
                propagated.push(event.type + ":" + event.key)
            );

            for (const character of "jjkj") {
                const keyCode = character.toUpperCase().charCodeAt(0);
                keydown(jQuery, character, keyCode, "Key" + character.toUpperCase(), false);
                keyup(jQuery, character, keyCode, "Key" + character.toUpperCase(), false);
            }
            keydown(jQuery, "Enter", 13, "Enter", false);
            keyup(jQuery, "Enter", 13, "Enter", false);

            assert.deepStrictEqual(scans, []);
            assert.deepStrictEqual(propagated, ["keydown:j"]);
        });
        it("should keep the propagation of the keys typed into a field", () => {
            const jQuery = global.jQuery;
            const scans = [];
            const propagated = [];
            const code = "5474010022000000001234";

            jQuery(document).unbind().removeData();
            jQuery("body").empty();
            jQuery("body").append('<div class="scan"></div><input type="text" />');
            jQuery(".scan").uxscan();
            jQuery(document).bind("scan", (event, value) => scans.push(value));
            jQuery(document).bind("keydown keyup", event =>
                propagated.push(event.type + ":" + event.key)
            );

            const input = jQuery("input");
            for (const character of code) {
                keydown(
                    jQuery,
                    character,
                    character.charCodeAt(0),
                    "Digit" + character,
                    false,
                    input
                );
                keyup(
                    jQuery,
                    character,
                    character.charCodeAt(0),
                    "Digit" + character,
                    false,
                    input
                );
            }
            keydown(jQuery, "Enter", 13, "Enter", false, input);
            keyup(jQuery, "Enter", 13, "Enter", false, input);

            assert.deepStrictEqual(scans, [code]);
            assert.deepStrictEqual(
                propagated,
                [...code].flatMap(character => ["keydown:" + character, "keyup:" + character])
            );
        });
        it("should keep the propagation of the keys of a person", () => {
            const jQuery = global.jQuery;
            const propagated = [];

            jQuery(document).unbind().removeData();
            jQuery("body").empty();
            jQuery("body").append('<div class="scan"></div>');
            jQuery(".scan").uxscan();
            jQuery(document).bind("keydown keyup", event =>
                propagated.push(event.type + ":" + event.key)
            );

            try {
                clock(1000);
                keydown(jQuery, "j", 74, "KeyJ", false);
                clock(1100);
                keyup(jQuery, "j", 74, "KeyJ", false);
                clock(1300);
                keydown(jQuery, "k", 75, "KeyK", false);
                clock(1400);
                keyup(jQuery, "k", 75, "KeyK", false);
            } finally {
                global.Date = DATE;
            }

            assert.deepStrictEqual(propagated, ["keydown:j", "keyup:j", "keydown:k", "keyup:k"]);
        });
        it("should keep the propagation of a key held by a person", () => {
            const jQuery = global.jQuery;
            const propagated = [];

            jQuery(document).unbind().removeData();
            jQuery("body").empty();
            jQuery("body").append('<div class="scan"></div>');
            jQuery(".scan").uxscan();
            jQuery(document).bind("keydown keyup", event =>
                propagated.push(event.type + ":" + event.key)
            );

            try {
                clock(1000);
                keydown(jQuery, "j", 74, "KeyJ", false);
                clock(1600);
                keydown(jQuery, "j", 74, "KeyJ", false, jQuery(document), true);
                clock(1630);
                keydown(jQuery, "j", 74, "KeyJ", false, jQuery(document), true);
                clock(1635);
                keyup(jQuery, "j", 74, "KeyJ", false);
            } finally {
                global.Date = DATE;
            }

            assert.deepStrictEqual(propagated, ["keydown:j", "keydown:j", "keydown:j", "keyup:j"]);
        });
        it("should blur the focused element of a scan", () => {
            const jQuery = global.jQuery;
            const scans = [];
            const focused = [];
            const code = "5474010022000000001234";

            jQuery(document).unbind().removeData();
            jQuery("body").empty();
            jQuery("body").append('<div class="scan"></div><a href="#">link</a>');
            jQuery(".scan").uxscan();
            jQuery(document).bind("scan", (event, value) => scans.push(value));

            const link = jQuery("a");
            link[0].focus();
            for (const character of code) {
                keydown(
                    jQuery,
                    character,
                    character.charCodeAt(0),
                    "Digit" + character,
                    false,
                    link
                );
                keyup(jQuery, character, character.charCodeAt(0), "Digit" + character, false, link);
                focused.push(document.activeElement === link[0]);
            }
            keydown(jQuery, "Enter", 13, "Enter", false, link);
            keyup(jQuery, "Enter", 13, "Enter", false, link);

            assert.deepStrictEqual(scans, [code]);
            assert.deepStrictEqual(focused, [...code].fill(false));
            assert.strictEqual(document.activeElement, document.body);
        });
        it("should blur the focused element of an invalid scan", () => {
            const jQuery = global.jQuery;
            const scans = [];

            jQuery(document).unbind().removeData();
            jQuery("body").empty();
            jQuery("body").append('<div class="scan"></div><a href="#">link</a>');
            jQuery(".scan").uxscan();
            jQuery(document).bind("scan", (event, value) => scans.push(value));

            const link = jQuery("a");
            link[0].focus();
            for (const character of "jjkj") {
                const keyCode = character.toUpperCase().charCodeAt(0);
                keydown(jQuery, character, keyCode, "Key" + character.toUpperCase(), false, link);
                keyup(jQuery, character, keyCode, "Key" + character.toUpperCase(), false, link);
            }
            keydown(jQuery, "Enter", 13, "Enter", false, link);
            keyup(jQuery, "Enter", 13, "Enter", false, link);

            assert.deepStrictEqual(scans, []);
            assert.strictEqual(document.activeElement, document.body);
        });
        it("should keep the focus of the field of a scan", () => {
            const jQuery = global.jQuery;
            const scans = [];
            const code = "5474010022000000001234";

            jQuery(document).unbind().removeData();
            jQuery("body").empty();
            jQuery("body").append('<div class="scan"></div><input type="text" />');
            jQuery(".scan").uxscan();
            jQuery(document).bind("scan", (event, value) => scans.push(value));

            const input = jQuery("input");
            input[0].focus();
            for (const character of code) {
                keydown(
                    jQuery,
                    character,
                    character.charCodeAt(0),
                    "Digit" + character,
                    false,
                    input
                );
                keyup(
                    jQuery,
                    character,
                    character.charCodeAt(0),
                    "Digit" + character,
                    false,
                    input
                );
            }
            keydown(jQuery, "Enter", 13, "Enter", false, input);
            keyup(jQuery, "Enter", 13, "Enter", false, input);

            assert.deepStrictEqual(scans, [code]);
            assert.strictEqual(document.activeElement, input[0]);
        });
        it("should keep the focus of the keys of a person", () => {
            const jQuery = global.jQuery;

            jQuery(document).unbind().removeData();
            jQuery("body").empty();
            jQuery("body").append('<div class="scan"></div><a href="#">link</a>');
            jQuery(".scan").uxscan();

            const link = jQuery("a");
            link[0].focus();
            try {
                clock(1000);
                keydown(jQuery, "j", 74, "KeyJ", false, link);
                clock(1100);
                keyup(jQuery, "j", 74, "KeyJ", false, link);
                clock(1300);
                keydown(jQuery, "k", 75, "KeyK", false, link);
                clock(1400);
                keyup(jQuery, "k", 75, "KeyK", false, link);
            } finally {
                global.Date = DATE;
            }

            assert.strictEqual(document.activeElement, link[0]);
        });
        it("should keep the focus of a key held by a person", () => {
            const jQuery = global.jQuery;

            jQuery(document).unbind().removeData();
            jQuery("body").empty();
            jQuery("body").append('<div class="scan"></div><a href="#">link</a>');
            jQuery(".scan").uxscan();

            const link = jQuery("a");
            link[0].focus();
            try {
                clock(1000);
                keydown(jQuery, "ArrowDown", 40, "ArrowDown", false, link);
                clock(1600);
                keydown(jQuery, "ArrowDown", 40, "ArrowDown", false, link, true);
                clock(1630);
                keydown(jQuery, "ArrowDown", 40, "ArrowDown", false, link, true);
                clock(1635);
                keyup(jQuery, "ArrowDown", 40, "ArrowDown", false, link);
            } finally {
                global.Date = DATE;
            }

            assert.strictEqual(document.activeElement, link[0]);
        });
    });

    describe("#logging", function() {
        afterEach(() => {
            const jQuery = global.jQuery;
            jQuery("body").removeData("log_level");
        });

        it("should log the errors of the scans with only their length", () => {
            const jQuery = global.jQuery;
            const errors = [];

            jQuery(document).unbind().removeData();
            jQuery("body").empty();
            jQuery("body").data("log_level", "debug");
            jQuery("body").append('<div class="scan"></div>');
            jQuery(".scan").uxscan();
            jQuery(document).bind("scan_error", (event, sequence) => errors.push(sequence));

            let records = null;
            try {
                records = capture(() => {
                    clock(1000);
                    for (const character of "secret") {
                        keyup(jQuery, character, character.toUpperCase().charCodeAt(0));
                    }
                    clock(1200);
                    keyup(jQuery, "Enter", 13);
                    clock(1300);
                    keyup(jQuery, "Enter", 13);
                });
            } finally {
                global.Date = DATE;
            }

            assert.deepStrictEqual(errors, ["secret", ""]);
            assert.deepStrictEqual(records, [
                ["DEBUG", "uxscan", "Scan error with length:", [6]],
                ["DEBUG", "uxscan", "Scan error with length:", [0]]
            ]);
            assert.strictEqual(JSON.stringify(records).includes("secret"), false);
        });
        it("should log the detected scans", () => {
            const jQuery = global.jQuery;
            const code = "A:123456789*B:999999990";

            jQuery(document).unbind().removeData();
            jQuery("body").empty();
            jQuery("body").data("log_level", "debug");
            jQuery("body").append('<div class="scan"></div>');
            jQuery(".scan").uxscan();

            const records = capture(() => {
                for (const character of code) {
                    const [physical, shift] = physicalKey(character, US_KEYS);
                    const typed = PT_TYPED[character] || character;
                    keydown(jQuery, typed, KEY_CODES[character], physical, shift);
                    keyup(jQuery, typed, KEY_CODES[character], physical, shift);
                }
                keyup(jQuery, "Enter", 13);
            });

            assert.deepStrictEqual(records, [
                ["DEBUG", "uxscan", "Scan detected:", [code, "AÇ123456789(BÇ999999990"]]
            ]);
        });
        it("should not log the scans with the default level", () => {
            const jQuery = global.jQuery;
            const scans = [];

            jQuery(document).unbind().removeData();
            jQuery("body").empty();
            jQuery("body").append('<div class="scan"></div>');
            jQuery(".scan").uxscan();
            jQuery(document).bind("scan", (event, value) => scans.push(value));

            const records = capture(() => {
                for (const character of "5474010022000000001234") {
                    keyup(jQuery, undefined, character.charCodeAt(0));
                }
                keyup(jQuery, undefined, 13);
            });

            assert.deepStrictEqual(scans, ["5474010022000000001234"]);
            assert.deepStrictEqual(records, []);
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

const US_KEYS = {
    ":": ["Semicolon", true],
    "*": ["Digit8", true],
    "/": ["Slash", false],
    "-": ["Minus", false]
};

const PT_KEYS = {
    ":": ["Period", true],
    "*": ["BracketLeft", true],
    "/": ["Digit7", true],
    "-": ["Slash", false]
};

const DE_KEYS = {
    ":": ["Period", true],
    "*": ["BracketRight", true],
    "/": ["Digit7", true],
    "-": ["Slash", false],
    y: ["KeyZ", false],
    z: ["KeyY", false]
};

const PT_TYPED = { ":": "Ç", "*": "(", "/": "-", "-": "'" };

const FR_TYPED = {
    ":": "M",
    "*": "8",
    "/": "!",
    "-": ")",
    A: "Q",
    M: "?",
    a: "q",
    z: "w",
    1: "&",
    2: "é",
    3: '"',
    4: "'",
    5: "(",
    6: "-",
    7: "è",
    8: "_",
    9: "ç",
    0: "à"
};

const DE_TYPED = { ":": "Ö", "*": "(", "/": "-", "-": "ß", y: "z", z: "y" };

const SCANNER_EVENTS = [
    ["keydown", "Shift", "ShiftLeft", 16, true],
    ["keydown", "A", "KeyA", 65, true],
    ["keyup", "A", "KeyA", 65, true],
    ["keydown", "Ç", "Semicolon", 186, true],
    ["keyup", "CapsLock", "ShiftLeft", 20, true],
    ["keyup", "ç", "Semicolon", 186, false],
    ["keydown", "5", "Digit5", 53, false],
    ["keyup", "5", "Digit5", 53, false],
    ["keydown", "0", "Digit0", 48, false],
    ["keyup", "0", "Digit0", 48, false],
    ["keydown", "6", "Digit6", 54, false],
    ["keyup", "6", "Digit6", 54, false],
    ["keydown", "7", "Digit7", 55, false],
    ["keyup", "7", "Digit7", 55, false],
    ["keydown", "2", "Digit2", 50, false],
    ["keyup", "2", "Digit2", 50, false],
    ["keydown", "1", "Digit1", 49, false],
    ["keyup", "1", "Digit1", 49, false],
    ["keydown", "0", "Digit0", 48, false],
    ["keyup", "0", "Digit0", 48, false],
    ["keydown", "8", "Digit8", 56, false],
    ["keyup", "8", "Digit8", 56, false],
    ["keydown", "6", "Digit6", 54, false],
    ["keydown", "Shift", "ShiftLeft", 16, true],
    ["keyup", "&", "Digit6", 54, true],
    ["keydown", "(", "Digit8", 56, true],
    ["keyup", "(", "Digit8", 56, true]
];

const DATE = global.Date;

const physicalKey = (character, keys) => {
    if (keys[character]) return keys[character];
    if (character === " ") return ["Space", false];
    if (character >= "0" && character <= "9") return ["Digit" + character, false];
    return ["Key" + character.toUpperCase(), character !== character.toLowerCase()];
};

const clock = time => {
    global.Date = class extends DATE {
        constructor() {
            super(time);
        }
    };
};

const keydown = (jQuery, key, keyCode, code, shiftKey, target, repeat) => {
    const event = jQuery.Event("keydown", {
        key: key,
        keyCode: keyCode,
        code: code,
        shiftKey: shiftKey,
        repeat: repeat
    });
    (target || jQuery(document)).trigger(event);
};

const keyup = (jQuery, key, keyCode, code, shiftKey, target) => {
    const event = jQuery.Event("keyup", {
        key: key,
        keyCode: keyCode,
        code: code,
        shiftKey: shiftKey
    });
    (target || jQuery(document)).trigger(event);
};

const capture = callable => {
    const logger = global.Logging.getLogger();
    const handlers = logger.handlers;
    const records = [];
    logger.handlers = [{ handle: record => records.push(record) }];
    try {
        callable();
    } finally {
        logger.handlers = handlers;
    }
    return records.map(record => [
        record.getLevelString(),
        record.getName(),
        record.getMessage(),
        record.getArgs()
    ]);
};
