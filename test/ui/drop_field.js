const assert = require("assert");
require("../../js");

global.document = global.document || global.dom.window.document;
global.window = global.window || global.dom.window;

describe("UxDropField", function() {
    describe("#basic", function() {
        it("should be defined", () => {
            const jQuery = global.jQuery;
            assert.notStrictEqual(jQuery.fn.uxdropfield, undefined);
        });
    });

    describe("#update", function() {
        let uxdataquery = null;
        let callbacks = null;

        beforeEach(() => {
            const jQuery = global.jQuery;
            uxdataquery = jQuery.fn.uxdataquery;
            callbacks = [];
            jQuery.fn.uxdataquery = function(query, callback) {
                callbacks.push(callback);
            };
        });

        afterEach(() => {
            const jQuery = global.jQuery;
            jQuery.fn.uxdataquery = uxdataquery;
        });

        it("should show the results of the query of the value of the text field", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append(
                '<div class="drop-field" data-auto_size="false">' +
                    '<div class="data-source" data-type="json"></div>' +
                    "</div>"
            );
            jQuery(".drop-field").uxdropfield();
            jQuery(".drop-field .text-field").focus();
            jQuery(".drop-field .text-field").uxtextfield("value", { value: "admin" });
            const event = jQuery.Event("keyup");
            event.keyCode = 65;
            jQuery(".drop-field .text-field").trigger(event);

            callbacks[0]([{ name: "admin_user" }], false);

            assert.strictEqual(jQuery(".drop-field-contents > li").length, 1);
            assert.strictEqual(jQuery(".drop-field").hasClass("visible"), true);
            assert.strictEqual(jQuery(".drop-field").data("value"), "admin");
        });
        it("should ignore the results of the query of a value reset in between", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append(
                '<div class="drop-field" data-auto_size="false">' +
                    '<div class="data-source" data-type="json"></div>' +
                    "</div>"
            );
            jQuery(".drop-field").uxdropfield();
            jQuery(".drop-field .text-field").focus();
            jQuery(".drop-field .text-field").uxtextfield("value", { value: "admin" });
            const event = jQuery.Event("keyup");
            event.keyCode = 65;
            jQuery(".drop-field .text-field").trigger(event);
            jQuery(".drop-field").uxreset();

            callbacks[0]([{ name: "admin_user" }], false);

            assert.strictEqual(jQuery(".drop-field .text-field").val(), "");
            assert.strictEqual(jQuery(".drop-field-contents > li").length, 0);
            assert.strictEqual(jQuery(".drop-field").hasClass("visible"), false);
            assert.strictEqual(jQuery(".drop-field").data("value"), "");
        });
        it("should ignore the results of the query of a value typed over in between", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append(
                '<div class="drop-field" data-auto_size="false">' +
                    '<div class="data-source" data-type="json"></div>' +
                    "</div>"
            );
            jQuery(".drop-field").uxdropfield();
            jQuery(".drop-field .text-field").focus();
            jQuery(".drop-field .text-field").uxtextfield("value", { value: "admin" });
            const first = jQuery.Event("keyup");
            first.keyCode = 65;
            jQuery(".drop-field .text-field").trigger(first);
            jQuery(".drop-field .text-field").uxtextfield("value", { value: "admin_u" });
            const second = jQuery.Event("keyup");
            second.keyCode = 85;
            jQuery(".drop-field .text-field").trigger(second);

            callbacks[0]([{ name: "admin_user" }, { name: "admin_other" }], false);

            assert.strictEqual(jQuery(".drop-field-contents > li").length, 0);
            assert.strictEqual(jQuery(".drop-field").hasClass("visible"), false);

            callbacks[1]([{ name: "admin_user" }], false);

            assert.strictEqual(jQuery(".drop-field-contents > li").length, 1);
            assert.strictEqual(jQuery(".drop-field").data("value"), "admin_u");
        });
    });
});
