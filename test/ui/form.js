const assert = require("assert");
require("../../js");

global.document = global.document || global.dom.window.document;
global.window = global.window || global.dom.window;

describe("UxForm", function() {
    describe("#basic", function() {
        it("should be defined", () => {
            const jQuery = global.jQuery;
            assert.notStrictEqual(jQuery.fn.uxform, undefined);
        });
    });

    describe("#logging", function() {
        let ajax = null;

        beforeEach(() => {
            const jQuery = global.jQuery;
            ajax = jQuery.ajax;
        });

        afterEach(() => {
            const jQuery = global.jQuery;
            jQuery.ajax = ajax;
        });

        it("should log the submissions with no data received", async () => {
            const jQuery = global.jQuery;
            const errors = [];

            jQuery.ajax = options => {
                options.success("");
                options.complete();
            };
            const records = await capture(async () => {
                submit(jQuery, errors);
                await tick();
            });

            assert.deepStrictEqual(errors, [undefined]);
            assert.deepStrictEqual(records, [
                ["WARNING", "uxform", "Submission with no data received:", ["/submit"]]
            ]);
        });
        it("should log the failures of the submissions", async () => {
            const jQuery = global.jQuery;
            const errors = [];

            jQuery.ajax = options => {
                options.error(
                    { status: 400, responseText: '{"message": "Invalid", "exception": {"errors": {}}}' },
                    "error",
                    "Bad Request"
                );
                options.complete();
            };
            const records = await capture(async () => {
                submit(jQuery, errors);
                await tick();
            });

            assert.deepStrictEqual(errors, ["Invalid"]);
            assert.strictEqual(jQuery(".form .error-message").text(), "Invalid");
            assert.deepStrictEqual(records, [
                ["WARNING", "uxform", "Submission failed:", ["/submit", 400, "Bad Request"]]
            ]);
        });
        it("should log the failures of the submissions with no JSON", async () => {
            const jQuery = global.jQuery;
            const errors = [];

            jQuery.ajax = options => {
                options.error(
                    { status: 502, responseText: "<html><body>Bad Gateway</body></html>" },
                    "error",
                    "Bad Gateway"
                );
                options.complete();
            };
            const records = await capture(async () => {
                submit(jQuery, errors);
                await tick();
            });

            assert.deepStrictEqual(errors, ["There was an error"]);
            assert.strictEqual(jQuery(".form .error-message").text(), "There was an error");
            assert.deepStrictEqual(records, [
                ["WARNING", "uxform", "Submission failed:", ["/submit", 502, "Bad Gateway"]]
            ]);
        });
    });
});

const submit = (jQuery, errors) => {
    jQuery("body").empty();
    jQuery("body").append(
        '<form class="form form-ajax" method="post" action="/submit">' +
            '<div class="error-message"></div>' +
            '<input type="text" name="name" value="value" />' +
            "</form>"
    );
    jQuery(".form").uxform();
    jQuery(".form").bind("error", (event, exception, message) => errors.push(message));
    jQuery(".form").submit();
};

const capture = async callable => {
    const logger = global.Logging.getLogger();
    const handlers = logger.handlers;
    const records = [];
    logger.handlers = [{ handle: record => records.push(record) }];
    try {
        await callable();
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

const tick = () => new Promise(resolve => setTimeout(resolve, 10));
