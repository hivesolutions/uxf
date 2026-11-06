const assert = require("assert");
require("../../js");

global.document = global.document || global.dom.window.document;
global.window = global.window || global.dom.window;

describe("UxOverlaySearch", function() {
    describe("#basic", function() {
        afterEach(() => {
            const jQuery = global.jQuery;
            jQuery("body").removeAttr("data-locale");
        });

        it("should be defined", () => {
            const jQuery = global.jQuery;
            assert.notStrictEqual(jQuery.fn.uxoverlaysearch, undefined);
        });
        it("should add a cancel link to the overlay search", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append(
                '<div class="overlay-search"><input type="text" class="text-field" /></div>'
            );
            jQuery(".overlay-search").uxoverlaysearch();

            const cancelLink = jQuery(".overlay-search > .overlay-search-cancel");
            assert.strictEqual(cancelLink.length, 1);
            assert.strictEqual(cancelLink.text(), "Cancel");
            assert.strictEqual(cancelLink.hasClass("link"), true);
        });
        it("should localize the cancel link with the locale of the body", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").attr("data-locale", "pt_pt");
            jQuery("body").append(
                '<div class="overlay-search"><input type="text" class="text-field" /></div>'
            );
            jQuery(".overlay-search").uxoverlaysearch();

            const cancelLink = jQuery(".overlay-search > .overlay-search-cancel");
            assert.strictEqual(cancelLink.text(), "Cancelar");
        });
        it("should keep a single cancel link when applied again", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append(
                '<div class="overlay-search"><input type="text" class="text-field" /></div>'
            );
            jQuery(".overlay-search").uxoverlaysearch();
            jQuery(".overlay-search").uxoverlaysearch();

            const cancelLink = jQuery(".overlay-search > .overlay-search-cancel");
            assert.strictEqual(cancelLink.length, 1);
        });
        it("should add a cancel link to each of the overlay searches", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append(
                '<div class="overlay-search first"><input type="text" class="text-field" /></div>' +
                    '<div class="overlay-search second"><input type="text" class="text-field" /></div>'
            );
            jQuery(".overlay-search").uxoverlaysearch();

            assert.strictEqual(jQuery(".overlay-search.first > .overlay-search-cancel").length, 1);
            assert.strictEqual(jQuery(".overlay-search.second > .overlay-search-cancel").length, 1);
        });
    });

    describe("#hide", function() {
        it("should hide the overlay with the click in the cancel link", () => {
            const jQuery = global.jQuery;
            const hides = [];

            jQuery("body").empty();
            jQuery("body").append(
                '<div class="overlay"></div>' +
                    '<div class="overlay-panel overlay-search"><input type="text" class="text-field" /></div>'
            );
            jQuery(".overlay").bind("hide", (event, timeout) => hides.push(timeout));
            jQuery(".overlay-search").uxoverlaysearch();

            jQuery(".overlay-search-cancel").click();

            assert.deepStrictEqual(hides, [200]);
        });
        it("should hide the overlay as the escape key with the click in the cancel link", () => {
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
            jQuery(".overlay-search-cancel").click();

            assert.deepStrictEqual(hides, [200, 200]);
        });
        it("should hide the overlay of an overlay search that is not an overlay panel", () => {
            const jQuery = global.jQuery;
            const hides = [];

            jQuery("body").empty();
            jQuery("body").append(
                '<div class="overlay"></div>' +
                    '<div class="overlay-search"><input type="text" class="text-field" /></div>'
            );
            jQuery(".overlay").bind("hide", (event, timeout) => hides.push(timeout));
            jQuery(".overlay-search").uxoverlaysearch();

            jQuery(".overlay-search-cancel").click();

            assert.deepStrictEqual(hides, [200]);
        });
    });
});
