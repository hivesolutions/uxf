const assert = require("assert");
require("../../js");

global.document = global.document || global.dom.window.document;

describe("UxDataQuery", function() {
    describe("#basic", function() {
        it("should be defined", () => {
            const jQuery = global.jQuery;
            assert.notStrictEqual(jQuery.fn.uxdataquery, undefined);
        });
    });

    describe("#logging", function() {
        beforeEach(() => {
            const jQuery = global.jQuery;
            jQuery.fn.uxdataquerytest = function(query, callback) {
                callback(["item"], false);
            };
        });

        afterEach(() => {
            const jQuery = global.jQuery;
            delete jQuery.fn.uxdataquerytest;
            jQuery("body").removeData("log_level");
        });

        it("should log the queries of the data sources with no type", () => {
            const jQuery = global.jQuery;
            const results = [];
            const query = { filterString: "name" };

            jQuery("body").empty();
            jQuery("body").append('<div class="data-source"></div>');
            const records = capture(() => {
                jQuery(".data-source").uxdataquery(query, (validItems, moreItems) =>
                    results.push([validItems, moreItems])
                );
            });

            assert.deepStrictEqual(results, [[[], false]]);
            assert.deepStrictEqual(records, [
                ["WARNING", "uxdataquery", "Query of data source with no type:", [query]]
            ]);
        });
        it("should log the queries of the data sources", () => {
            const jQuery = global.jQuery;
            const results = [];
            const query = { filterString: "name" };

            jQuery("body").empty();
            jQuery("body").data("log_level", "debug");
            jQuery("body").append('<div class="data-source" data-type="test"></div>');
            const records = capture(() => {
                jQuery(".data-source").uxdataquery(query, (validItems, moreItems) =>
                    results.push([validItems, moreItems])
                );
            });

            assert.deepStrictEqual(results, [[["item"], false]]);
            assert.deepStrictEqual(records, [
                ["DEBUG", "uxdataquery", "Query of data source:", ["test", query]]
            ]);
        });
        it("should not log the queries with the default level", () => {
            const jQuery = global.jQuery;
            const results = [];

            jQuery("body").empty();
            jQuery("body").append('<div class="data-source" data-type="test"></div>');
            const records = capture(() => {
                jQuery(".data-source").uxdataquery({}, (validItems, moreItems) =>
                    results.push([validItems, moreItems])
                );
            });

            assert.deepStrictEqual(results, [[["item"], false]]);
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
