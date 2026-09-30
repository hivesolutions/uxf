const assert = require("assert");
require("../../js");

global.document = global.document || global.dom.window.document;
global.window = global.window || global.dom.window;

describe("UxFilter", function() {
    describe("#basic", function() {
        it("should be defined", () => {
            const jQuery = global.jQuery;
            assert.notStrictEqual(jQuery.fn.uxfilter, undefined);
        });
    });

    describe("#sort", function() {
        let uxdataquery = null;
        let queries = null;

        beforeEach(() => {
            const jQuery = global.jQuery;
            uxdataquery = jQuery.fn.uxdataquery;
            queries = [];
            jQuery.fn.uxdataquery = function(query, callback) {
                queries.push(query);
            };
        });

        afterEach(() => {
            const jQuery = global.jQuery;
            jQuery.fn.uxdataquery = uxdataquery;
        });

        it("should name the default sort option", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append(
                '<ul class="filter" data-advanced="1">' +
                    '<div class="data-source" data-type="json">' +
                    '<ul class="order"><li data-name="name">name</li></ul>' +
                    "</div>" +
                    "</ul>"
            );
            jQuery(".filter").uxfilter();

            const option = jQuery(".filter-sort-option.selected");
            assert.strictEqual(option.length, 1);
            assert.strictEqual(option.attr("data-name"), "default");
            assert.strictEqual(option.text(), "default");
        });
        it("should query with the default sort option", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append(
                '<ul class="filter" data-advanced="1">' +
                    '<div class="data-source" data-type="json">' +
                    '<ul class="order"><li data-name="name">name</li></ul>' +
                    "</div>" +
                    "</ul>"
            );
            jQuery(".filter").uxfilter();

            assert.strictEqual(queries.length, 1);
            assert.deepStrictEqual(queries[0].sort, ["default", "descending"]);
        });
        it("should query with the default sort option once translated", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append(
                '<ul class="filter" data-advanced="1">' +
                    '<div class="data-source" data-type="json">' +
                    '<ul class="order"><li data-name="name">name</li></ul>' +
                    "</div>" +
                    "</ul>"
            );
            jQuery(".filter").uxfilter();

            jQuery(".filter-sort-option.selected").html(
                '<font dir="auto" style="vertical-align: inherit;">' +
                    '<font dir="auto" style="vertical-align: inherit;">padrão</font>' +
                    "</font>"
            );
            jQuery(".filter").triggerHandler("update");

            assert.strictEqual(queries.length, 2);
            assert.deepStrictEqual(queries[1].sort, ["default", "descending"]);
        });
        it("should query with the name of the selected sort option", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append(
                '<ul class="filter" data-advanced="1">' +
                    '<div class="data-source" data-type="json">' +
                    '<ul class="order">' +
                    '<li data-name="name" data-order="ascending">name</li>' +
                    '<li data-name="create_date">created</li>' +
                    "</ul>" +
                    "</div>" +
                    "</ul>"
            );
            jQuery(".filter").uxfilter();

            jQuery(".filter-sort-option[data-name='name']").click();
            assert.strictEqual(queries.length, 2);
            assert.deepStrictEqual(queries[1].sort, ["name", "ascending"]);

            jQuery(".filter-sort-option[data-name='create_date']").click();
            assert.strictEqual(queries.length, 3);
            assert.deepStrictEqual(queries[2].sort, ["create_date", "descending"]);

            jQuery(".filter-sort-option[data-name='create_date']").click();
            assert.strictEqual(queries.length, 4);
            assert.deepStrictEqual(queries[3].sort, ["create_date", "ascending"]);
        });
        it("should query with the text of the selected sort option without name", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append(
                '<ul class="filter" data-advanced="1">' +
                    '<div class="data-source" data-type="json">' +
                    '<ul class="order">' +
                    '<li><font dir="auto" style="vertical-align: inherit;">criado</font></li>' +
                    "</ul>" +
                    "</div>" +
                    "</ul>"
            );
            jQuery(".filter").uxfilter();

            const option = jQuery(".filter-sort-option:not(.equals)");
            assert.strictEqual(option.attr("data-name"), undefined);

            option.click();
            assert.strictEqual(queries.length, 2);
            assert.deepStrictEqual(queries[1].sort, ["criado", "descending"]);
        });
    });
});
