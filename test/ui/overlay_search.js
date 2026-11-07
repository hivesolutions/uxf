const assert = require("assert");
require("../../js");

global.document = global.document || global.dom.window.document;
global.window = global.window || global.dom.window;

describe("UxOverlaySearch", function() {
    describe("#basic", function() {
        it("should be defined", () => {
            const jQuery = global.jQuery;
            assert.notStrictEqual(jQuery.fn.uxoverlaysearch, undefined);
        });
        it("should add a clear button to the overlay search", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append(
                '<div class="overlay-search"><input type="text" class="text-field" /></div>'
            );
            jQuery(".overlay-search").uxoverlaysearch();

            const clearButton = jQuery(".overlay-search > .overlay-search-clear");
            assert.strictEqual(clearButton.length, 1);
        });
        it("should keep a single clear button when applied again", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append(
                '<div class="overlay-search"><input type="text" class="text-field" /></div>'
            );
            jQuery(".overlay-search").uxoverlaysearch();
            jQuery(".overlay-search").uxoverlaysearch();

            const clearButton = jQuery(".overlay-search > .overlay-search-clear");
            assert.strictEqual(clearButton.length, 1);
        });
        it("should add a clear button to each of the overlay searches", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append(
                '<div class="overlay-search first"><input type="text" class="text-field" /></div>' +
                    '<div class="overlay-search second"><input type="text" class="text-field" /></div>'
            );
            jQuery(".overlay-search").uxoverlaysearch();

            assert.strictEqual(jQuery(".overlay-search.first > .overlay-search-clear").length, 1);
            assert.strictEqual(jQuery(".overlay-search.second > .overlay-search-clear").length, 1);
        });
    });

    describe("#hide", function() {
        it("should hide the overlay with the escape key", () => {
            const jQuery = global.jQuery;
            const hides = [];

            jQuery("body").empty();
            jQuery("body").append(
                '<div class="overlay"></div>' +
                    '<div class="overlay-panel overlay-search"><input type="text" class="text-field" /></div>'
            );
            jQuery(".overlay").bind("hide", (event, timeout) => hides.push(timeout));
            jQuery(".overlay-search").uxoverlaysearch();

            const event = jQuery.Event("keydown");
            event.keyCode = 27;
            jQuery(".overlay-search .text-field").trigger(event);

            assert.deepStrictEqual(hides, [200]);
        });
    });

    describe("#clear", function() {
        it("should keep the focus with the mouse down in the clear button", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append(
                '<div class="overlay-search"><input type="text" class="text-field" /></div>'
            );
            jQuery(".overlay-search").uxoverlaysearch();

            const event = jQuery.Event("mousedown");
            jQuery(".overlay-search-clear").trigger(event);

            assert.strictEqual(event.isDefaultPrevented(), true);
            assert.strictEqual(event.isPropagationStopped(), true);
        });
        it("should clear the drop field with the click in the clear button", () => {
            const jQuery = global.jQuery;
            const hides = [];

            jQuery("body").empty();
            jQuery("body").append(
                '<div class="overlay-panel overlay-search">' +
                    '<div class="drop-field"><div class="data-source" data-type="local"></div></div>' +
                    "</div>"
            );
            jQuery(".drop-field").uxdropfield();
            jQuery(".overlay-search").uxoverlaysearch();
            jQuery(".drop-field").bind("hide_drop", () => hides.push(true));
            jQuery(".drop-field .text-field").uxtextfield("value", { value: "admin" });
            jQuery(".drop-field").data("value", "admin");
            jQuery(".drop-field-contents").append("<li>admin_user</li>");
            jQuery(".drop-field-contents").show();

            jQuery(".overlay-search-clear").click();

            assert.strictEqual(jQuery(".drop-field .text-field").val(), "");
            assert.strictEqual(jQuery(".drop-field").data("value"), "");
            assert.strictEqual(jQuery(".drop-field-contents > li").length, 0);
            assert.strictEqual(jQuery(".drop-field-contents").css("display"), "none");
            assert.deepStrictEqual(hides, [true]);
        });
        it("should clear the text field with the click in the clear button", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append(
                '<div class="overlay-search"><input type="text" class="text-field" /></div>'
            );
            jQuery(".overlay-search .text-field").uxtextfield();
            jQuery(".overlay-search").uxoverlaysearch();
            jQuery(".overlay-search .text-field").uxtextfield("value", { value: "admin" });

            jQuery(".overlay-search-clear").click();

            assert.strictEqual(jQuery(".overlay-search .text-field").val(), "");
        });
        it("should focus the text field with the click in the clear button", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append(
                '<div class="overlay-search"><input type="text" class="text-field" /></div>' +
                    '<input type="text" class="other" />'
            );
            jQuery(".overlay-search .text-field").uxtextfield();
            jQuery(".overlay-search").uxoverlaysearch();
            jQuery(".other").focus();

            jQuery(".overlay-search-clear").click();

            assert.strictEqual(
                global.document.activeElement,
                jQuery(".overlay-search .text-field")[0]
            );
        });
        it("should keep the overlay shown with the click in the clear button", () => {
            const jQuery = global.jQuery;
            const hides = [];

            jQuery("body").empty();
            jQuery("body").append(
                '<div class="overlay"></div>' +
                    '<div class="overlay-panel overlay-search"><input type="text" class="text-field" /></div>'
            );
            jQuery(".overlay").bind("hide", (event, timeout) => hides.push(timeout));
            jQuery(".overlay-search .text-field").uxtextfield();
            jQuery(".overlay-search").uxoverlaysearch();

            jQuery(".overlay-search-clear").click();

            assert.deepStrictEqual(hides, []);
        });
    });
});
