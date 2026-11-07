const assert = require("assert");
require("../../js");

global.document = global.document || global.dom.window.document;
global.window = global.window || global.dom.window;

describe("UxOverlayPanel", function() {
    describe("#basic", function() {
        it("should be defined", () => {
            const jQuery = global.jQuery;
            assert.notStrictEqual(jQuery.fn.uxoverlaypanel, undefined);
        });
    });

    describe("#center", function() {
        afterEach(() => {
            const jQuery = global.jQuery;
            jQuery("body").removeClass("touch");
        });

        it("should center in the middle of the screen without touch", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append(
                '<div class="overlay"></div><div class="overlay-panel" data-offset="0.10"></div>'
            );
            const centers = capture(() => {
                jQuery(".overlay-panel").uxoverlaypanel();
            });

            assert.deepStrictEqual(centers, [[0.1, "center"]]);
        });
        it("should center at the top of the screen with touch", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").addClass("touch");
            jQuery("body").append(
                '<div class="overlay"></div><div class="overlay-panel" data-offset="0.10"></div>'
            );
            const centers = capture(() => {
                jQuery(".overlay-panel").uxoverlaypanel();
            });

            assert.deepStrictEqual(centers, [[0.1, "top"]]);
        });
        it("should keep the top of the screen with the resize and scroll of the window", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").addClass("touch");
            jQuery("body").append(
                '<div class="overlay"></div><div class="overlay-panel" data-offset="0.10"></div>'
            );
            jQuery(".overlay-panel").uxoverlaypanel();
            const centers = capture(() => {
                jQuery(global.window).trigger("resize");
                jQuery(global.window).trigger("scroll");
            });

            assert.deepStrictEqual(centers, [
                [0.1, "top"],
                [0.1, "top"]
            ]);
        });
        it("should use the touch of the body at the time of the resize and scroll", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").addClass("touch");
            jQuery("body").append(
                '<div class="overlay"></div><div class="overlay-panel" data-offset="0.10"></div>'
            );
            jQuery(".overlay-panel").uxoverlaypanel();
            jQuery("body").removeClass("touch");
            const centers = capture(() => {
                jQuery(global.window).trigger("resize");
                jQuery(global.window).trigger("scroll");
            });

            assert.deepStrictEqual(centers, [
                [0.1, "center"],
                [0.1, "center"]
            ]);
        });
        it("should center in the middle of the screen when shown without touch", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append(
                '<div class="overlay"></div><div class="overlay-panel" data-offset="0.10"></div>'
            );
            jQuery(".overlay-panel").uxoverlaypanel();
            const centers = capture(() => {
                jQuery(".overlay-panel").triggerHandler("show");
            });

            assert.deepStrictEqual(centers, [
                [0.1, "center"],
                [0.1, "center"]
            ]);
            assert.strictEqual(jQuery(".overlay-panel").hasClass("visible"), true);
        });
        it("should center at the top of the screen when shown with touch", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").addClass("touch");
            jQuery("body").append(
                '<div class="overlay"></div><div class="overlay-panel" data-offset="0.10"></div>'
            );
            jQuery(".overlay-panel").uxoverlaypanel();
            const centers = capture(() => {
                jQuery(".overlay-panel").triggerHandler("show");
            });

            assert.deepStrictEqual(centers, [
                [0.1, "top"],
                [0.1, "top"]
            ]);
            assert.strictEqual(jQuery(".overlay-panel").hasClass("visible"), true);
        });
        it("should use the touch of the body at the time it is shown", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append(
                '<div class="overlay"></div><div class="overlay-panel" data-offset="0.10"></div>'
            );
            jQuery(".overlay-panel").uxoverlaypanel();
            jQuery("body").addClass("touch");
            const centers = capture(() => {
                jQuery(".overlay-panel").triggerHandler("show");
            });

            assert.deepStrictEqual(centers, [
                [0.1, "top"],
                [0.1, "top"]
            ]);
        });
    });
});

const capture = callable => {
    const jQuery = global.jQuery;
    const uxcenter = jQuery.fn.uxcenter;
    const centers = [];
    jQuery.fn.uxcenter = function(
        topOffset,
        leftOffset,
        useMargin,
        avoidTop,
        avoidLeft,
        keep,
        reference,
        position
    ) {
        if (jQuery.contains(global.document.body, this[0])) centers.push([topOffset, position]);
        return this;
    };
    try {
        callable();
    } finally {
        jQuery.fn.uxcenter = uxcenter;
    }
    return centers;
};
