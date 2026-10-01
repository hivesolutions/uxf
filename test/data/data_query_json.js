const assert = require("assert");
require("../../js");

global.document = global.document || global.dom.window.document;

describe("UxDataQueryJson", function() {
    describe("#basic", function() {
        it("should be defined", () => {
            const jQuery = global.jQuery;
            assert.notStrictEqual(jQuery.fn.uxdataqueryjson, undefined);
        });
    });

    describe("#logging", function() {
        let ajax = null;
        let uxinfo = null;
        let infos = null;

        beforeEach(() => {
            const jQuery = global.jQuery;
            ajax = jQuery.ajax;
            uxinfo = jQuery.fn.uxinfo;
            infos = [];
            jQuery.fn.uxinfo = function(message, title, type) {
                infos.push(type);
            };
        });

        afterEach(() => {
            const jQuery = global.jQuery;
            jQuery.ajax = ajax;
            jQuery.fn.uxinfo = uxinfo;
        });

        it("should log the failures of the requests", async () => {
            const jQuery = global.jQuery;
            const results = [];

            jQuery("body").empty();
            jQuery("body").append('<div class="data-source" data-type="json" data-url="/items"></div>');
            jQuery.ajax = options =>
                options.error(
                    { status: 500, responseText: '{"message": "Failure", "uid": "1234"}' },
                    "error",
                    "Internal Server Error"
                );
            const records = await capture(async () => {
                jQuery(".data-source").uxdataqueryjson({}, (validItems, moreItems) =>
                    results.push([validItems, moreItems])
                );
                await tick();
            });

            assert.deepStrictEqual(results, [[null, null]]);
            assert.deepStrictEqual(infos, ["warning"]);
            assert.deepStrictEqual(records, [
                [
                    "ERROR",
                    "uxdataqueryjson",
                    "Query of data source failed:",
                    ["/items", 500, "Internal Server Error"]
                ]
            ]);
        });
        it("should log the failures of the requests with no JSON", async () => {
            const jQuery = global.jQuery;
            const results = [];

            jQuery("body").empty();
            jQuery("body").append('<div class="data-source" data-type="json" data-url="/items"></div>');
            jQuery.ajax = options =>
                options.error(
                    { status: 502, responseText: "<html><body>Bad Gateway</body></html>" },
                    "error",
                    "Bad Gateway"
                );
            const records = await capture(async () => {
                jQuery(".data-source").uxdataqueryjson({}, (validItems, moreItems) =>
                    results.push([validItems, moreItems])
                );
                await tick();
            });

            assert.deepStrictEqual(results, [[null, null]]);
            assert.deepStrictEqual(infos, ["warning"]);
            assert.deepStrictEqual(records, [
                ["ERROR", "uxdataqueryjson", "Query of data source failed:", ["/items", 502, "Bad Gateway"]]
            ]);
        });
        it("should log the failures of the requests with no response", async () => {
            const jQuery = global.jQuery;
            const results = [];

            jQuery("body").empty();
            jQuery("body").append('<div class="data-source" data-type="json" data-url="/items"></div>');
            jQuery.ajax = options => options.error({ status: 0, responseText: "" }, "error", "");
            const records = await capture(async () => {
                jQuery(".data-source").uxdataqueryjson({}, (validItems, moreItems) =>
                    results.push([validItems, moreItems])
                );
                await tick();
            });

            assert.deepStrictEqual(results, [[null, null]]);
            assert.deepStrictEqual(infos, ["warning"]);
            assert.deepStrictEqual(records, [
                ["ERROR", "uxdataqueryjson", "Query of data source failed:", ["/items", 0, ""]]
            ]);
        });
        it("should not log the failures of the outdated requests", async () => {
            const jQuery = global.jQuery;
            const results = [];

            jQuery("body").empty();
            jQuery("body").append('<div class="data-source" data-type="json" data-url="/items"></div>');
            jQuery.ajax = options => {
                jQuery(".data-source").data("current", 0);
                options.error({ status: 500, responseText: "" }, "error", "Internal Server Error");
            };
            const records = await capture(async () => {
                jQuery(".data-source").uxdataqueryjson({}, (validItems, moreItems) =>
                    results.push([validItems, moreItems])
                );
                await tick();
            });

            assert.deepStrictEqual(results, []);
            assert.deepStrictEqual(infos, []);
            assert.deepStrictEqual(records, []);
        });
    });
});

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
