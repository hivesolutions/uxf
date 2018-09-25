const assert = require("assert");
require("../../js");

describe("UxButton", function() {
    describe("#basic", function() {
        it("should be defined", () => {
            const jQuery = global.jQuery;
            assert.notStrictEqual(jQuery.fn.uxbutton, undefined);
        });
        it("should be able to read DOM properly", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append('<div class="button" data-link="http://hive.pt"></div>');
            jQuery(".button").uxbutton();

            const result = jQuery(".button").data("link");
            assert.strictEqual(result, "http://hive.pt");
        });
    });
});
