const assert = require("assert");
require("../../js");

describe("UxWiki", function() {
    describe("#basic", function() {
        it("should be generate simple text", () => {
            const jQuery = global.jQuery;

            const result = jQuery("body").uxwiki("hello [world]");
            assert.strictEqual(result, "hello <b>world</b>");
        });
    });
});
