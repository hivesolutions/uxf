const assert = require("assert");
require("../../js");

describe("UxSwitchField", function() {
    describe("#basic", function() {
        it("should be defined", () => {
            const jQuery = global.jQuery;
            assert.notStrictEqual(jQuery.fn.uxswitchfield, undefined);
        });
        it("should be registered as an object", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append('<input type="checkbox" class="switch-field" />');
            jQuery(".switch-field").uxswitchfield();

            const result = jQuery(".switch-field").attr("data-object");
            assert.strictEqual(result, "switchfield");
        });
        it("should start checked when the checked data matches the value", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append(
                '<input type="checkbox" class="switch-field" value="True" data-checked="True" />'
            );
            jQuery(".switch-field").uxswitchfield();

            const result = jQuery(".switch-field").is(":checked");
            assert.strictEqual(result, true);
        });
        it("should start unchecked when the checked data does not match the value", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append(
                '<input type="checkbox" class="switch-field" value="True" data-checked="False" />'
            );
            jQuery(".switch-field").uxswitchfield();

            const result = jQuery(".switch-field").is(":checked");
            assert.strictEqual(result, false);
        });
        it("should start unchecked when there is no checked data", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append('<input type="checkbox" class="switch-field" checked="1" />');
            jQuery(".switch-field").uxswitchfield();

            const result = jQuery(".switch-field").is(":checked");
            assert.strictEqual(result, false);
        });
        it("should update each of the fields with its own checked data", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append(
                '<input type="checkbox" class="switch-field first" value="1" data-checked="1" />' +
                    '<input type="checkbox" class="switch-field second" value="1" data-checked="0" />'
            );
            jQuery(".switch-field").uxswitchfield();

            assert.strictEqual(jQuery(".switch-field.first").is(":checked"), true);
            assert.strictEqual(jQuery(".switch-field.second").is(":checked"), false);
        });
    });

    describe("#toggle", function() {
        it("should toggle with the click in the label", () => {
            const jQuery = global.jQuery;
            const changes = [];

            jQuery("body").empty();
            jQuery("body").append(
                '<input type="checkbox" class="switch-field" />' +
                    '<span class="switch-field-label">Label</span>'
            );
            jQuery(".switch-field").uxswitchfield();
            jQuery(".switch-field").bind("change", function() {
                changes.push(jQuery(this).is(":checked"));
            });

            jQuery(".switch-field-label").click();
            assert.strictEqual(jQuery(".switch-field").is(":checked"), true);

            jQuery(".switch-field-label").click();
            assert.strictEqual(jQuery(".switch-field").is(":checked"), false);

            assert.deepStrictEqual(changes, [true, false]);
        });
        it("should toggle only the field of the clicked label", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append(
                '<input type="checkbox" class="switch-field first" />' +
                    '<span class="switch-field-label first">First</span>' +
                    '<input type="checkbox" class="switch-field second" />' +
                    '<span class="switch-field-label second">Second</span>'
            );
            jQuery(".switch-field").uxswitchfield();

            jQuery(".switch-field-label.second").click();

            assert.strictEqual(jQuery(".switch-field.first").is(":checked"), false);
            assert.strictEqual(jQuery(".switch-field.second").is(":checked"), true);
        });
        it("should not toggle a disabled field with the click in the label", () => {
            const jQuery = global.jQuery;
            const changes = [];

            jQuery("body").empty();
            jQuery("body").append(
                '<input type="checkbox" class="switch-field disabled" />' +
                    '<span class="switch-field-label">Label</span>'
            );
            jQuery(".switch-field").uxswitchfield();
            jQuery(".switch-field").bind("change", function() {
                changes.push(jQuery(this).is(":checked"));
            });

            jQuery(".switch-field-label").click();

            assert.strictEqual(jQuery(".switch-field").is(":checked"), false);
            assert.deepStrictEqual(changes, []);
        });
    });

    describe("#value", function() {
        it("should retrieve the checked state as the value", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append(
                '<input type="checkbox" class="switch-field first" value="1" data-checked="1" />' +
                    '<input type="checkbox" class="switch-field second" value="1" />'
            );
            jQuery(".switch-field").uxswitchfield();

            assert.strictEqual(jQuery(".switch-field.first").uxvalue(), true);
            assert.strictEqual(jQuery(".switch-field.second").uxvalue(), false);
        });
        it("should set the value and trigger the change event", () => {
            const jQuery = global.jQuery;
            const changes = [];

            jQuery("body").empty();
            jQuery("body").append('<input type="checkbox" class="switch-field" />');
            jQuery(".switch-field").uxswitchfield();
            jQuery(".switch-field").bind("change", function() {
                changes.push(jQuery(this).is(":checked"));
            });

            jQuery(".switch-field").uxvalue(true);
            assert.strictEqual(jQuery(".switch-field").uxvalue(), true);

            jQuery(".switch-field").uxvalue(false);
            assert.strictEqual(jQuery(".switch-field").uxvalue(), false);

            assert.deepStrictEqual(changes, [true, false]);
        });
        it("should not trigger the change event when the value is kept", () => {
            const jQuery = global.jQuery;
            const changes = [];

            jQuery("body").empty();
            jQuery("body").append(
                '<input type="checkbox" class="switch-field" value="1" data-checked="1" />'
            );
            jQuery(".switch-field").uxswitchfield();
            jQuery(".switch-field").bind("change", function() {
                changes.push(jQuery(this).is(":checked"));
            });

            jQuery(".switch-field").uxvalue(true);
            jQuery(".switch-field").uxvalue(1);
            jQuery(".switch-field").uxvalue("1");

            assert.strictEqual(jQuery(".switch-field").uxvalue(), true);
            assert.deepStrictEqual(changes, []);
        });
        it("should use the boolean version of the value", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append(
                '<input type="checkbox" class="switch-field" value="1" data-checked="1" />'
            );
            jQuery(".switch-field").uxswitchfield();

            jQuery(".switch-field").uxvalue("");
            assert.strictEqual(jQuery(".switch-field").uxvalue(), false);

            jQuery(".switch-field").uxvalue("value");
            assert.strictEqual(jQuery(".switch-field").uxvalue(), true);

            jQuery(".switch-field").uxvalue(0);
            assert.strictEqual(jQuery(".switch-field").uxvalue(), false);
        });
        it("should set the value of a disabled field", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append('<input type="checkbox" class="switch-field disabled" />');
            jQuery(".switch-field").uxswitchfield();

            jQuery(".switch-field").uxvalue(true);

            assert.strictEqual(jQuery(".switch-field").uxvalue(), true);
        });
    });

    describe("#reset", function() {
        it("should uncheck the field", () => {
            const jQuery = global.jQuery;
            const changes = [];

            jQuery("body").empty();
            jQuery("body").append(
                '<input type="checkbox" class="switch-field" value="1" data-checked="1" />'
            );
            jQuery(".switch-field").uxswitchfield();
            jQuery(".switch-field").bind("change", function() {
                changes.push(jQuery(this).is(":checked"));
            });

            jQuery(".switch-field").uxreset();
            assert.strictEqual(jQuery(".switch-field").uxvalue(), false);

            jQuery(".switch-field").uxreset();
            assert.strictEqual(jQuery(".switch-field").uxvalue(), false);

            assert.deepStrictEqual(changes, [false]);
        });
    });

    describe("#submit", function() {
        it("should submit an empty value when unchecked", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append(
                '<form><input type="checkbox" class="switch-field" name="gift" value="1" /></form>'
            );
            jQuery(".switch-field").uxswitchfield();

            jQuery("form").triggerHandler("pre_submit");
            jQuery("form").triggerHandler("pre_submit");

            const inputs = jQuery(".switch-field > input");
            assert.strictEqual(inputs.length, 1);
            assert.strictEqual(inputs.attr("type"), "hidden");
            assert.strictEqual(inputs.attr("name"), "gift");
            assert.strictEqual(inputs.attr("value"), "");
        });
        it("should not submit the empty value when checked", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append(
                '<form><input type="checkbox" class="switch-field" name="gift" value="1" /></form>'
            );
            jQuery(".switch-field").uxswitchfield();

            jQuery("form").triggerHandler("pre_submit");
            assert.strictEqual(jQuery(".switch-field > input").length, 1);

            jQuery(".switch-field").uxvalue(true);
            jQuery("form").triggerHandler("pre_submit");
            assert.strictEqual(jQuery(".switch-field > input").length, 0);
        });
        it("should not submit the empty value when there is no name", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append('<form><input type="checkbox" class="switch-field" /></form>');
            jQuery(".switch-field").uxswitchfield();

            jQuery("form").triggerHandler("pre_submit");

            assert.strictEqual(jQuery(".switch-field > input").length, 0);
        });
    });
});
