const assert = require("assert");
require("../../js");

global.document = global.document || global.dom.window.document;

global.dom.reconfigure({ url: "https://localhost/" });

describe("UxLinkAsync", function() {
    describe("#basic", function() {
        it("should be defined", () => {
            const jQuery = global.jQuery;
            assert.notStrictEqual(jQuery.uxlinkasync, undefined);
        });
    });

    describe("#logging", function() {
        let ajax = null;

        beforeEach(() => {
            const jQuery = global.jQuery;
            ajax = jQuery.ajax;
            jQuery("body").data("async", true);
        });

        afterEach(() => {
            const jQuery = global.jQuery;
            jQuery.ajax = ajax;
            jQuery("body").removeData("async");
        });

        it("should log the failures of the async links", () => {
            const jQuery = global.jQuery;
            const href = "https://localhost/#failure";

            jQuery.ajax = options => {
                options.error({ status: 500 }, "error", "Internal Server Error");
                return {};
            };
            let result = null;
            const records = capture(() => {
                result = jQuery.uxlinkasync(href, true);
            });

            assert.strictEqual(result, true);
            assert.strictEqual(document.location.href, href);
            assert.deepStrictEqual(records, [
                [
                    "WARNING",
                    "uxlinkasync",
                    "Async link failed, loading it:",
                    [href, 500, "Internal Server Error"]
                ]
            ]);
        });
        it("should not log the aborted async links", () => {
            const jQuery = global.jQuery;
            const href = "https://localhost/#aborted";

            jQuery.ajax = options => {
                options.error({ status: 0 }, "abort", "abort");
                return {};
            };
            let result = null;
            const records = capture(() => {
                result = jQuery.uxlinkasync(href, true);
            });

            assert.strictEqual(result, true);
            assert.strictEqual(document.location.href, href);
            assert.deepStrictEqual(records, []);
        });
    });
});

const capture = callable => {
    const logger = global.Logging.getLogger();
    const handlers = logger.handlers;
    const records = [];
    logger.handlers = [{ handle: record => records.push(record) }];
    try {
        callable();
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
