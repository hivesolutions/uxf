const assert = require("assert");
require("../../js");

describe("UxButton", function() {
    describe("#basic()", function() {
        it("should be able to modify DOM properly", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append("<div class=\"button\" data-link=\"http://hive.pt\"></div>");
            jQuery(".button").uxbutton();

            const result = jQuery(".button").data("link");
            assert.equal(result, "http://hive.pt");
        });
    });
});
