const assert = require("assert");
require("../../js");

describe("UxTextField", function() {
    describe("#basic", function() {
        it("should be defined", () => {
            const jQuery = global.jQuery;
            assert.notStrictEqual(jQuery.fn.uxtextfield, undefined);
        });
        it("should unset the autocomplete by default", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append('<input class="text-field" name="name" />');
            jQuery(".text-field").uxtextfield();

            const result = jQuery(".text-field").attr("autocomplete");
            assert.strictEqual(result, "off");
        });
        it("should keep the explicit autocomplete value", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append(
                '<input class="text-field" name="first_name" autocomplete="given-name" />'
            );
            jQuery(".text-field").uxtextfield();

            const result = jQuery(".text-field").attr("autocomplete");
            assert.strictEqual(result, "given-name");
        });
        it("should keep the autocomplete with the force complete flag", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append(
                '<input class="text-field" name="name" data-force_complete="1" />'
            );
            jQuery(".text-field").uxtextfield();

            const result = jQuery(".text-field").attr("autocomplete");
            assert.strictEqual(result, undefined);
        });
    });
});
