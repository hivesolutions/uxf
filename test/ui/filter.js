const assert = require("assert");
require("../../js");

global.document = global.document || global.dom.window.document;
global.window = global.window || global.dom.window;

global.dom.reconfigure({ url: "https://localhost/" });

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
            global.dom.reconfigure({ url: "https://localhost/" });
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
        it("should query with the sort attribute without the advanced panel", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append(
                '<ul class="filter" data-sort="name:ascending">' +
                    '<div class="data-source" data-type="json">' +
                    '<ul class="order"><li data-name="name">name</li></ul>' +
                    "</div>" +
                    "</ul>"
            );
            jQuery(".filter").uxfilter();

            assert.strictEqual(jQuery(".filter-sort-option").length, 0);
            assert.strictEqual(queries.length, 1);
            assert.deepStrictEqual(queries[0].sort, ["name", "ascending"]);
        });
        it("should select the sort option of the sort attribute", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append(
                '<ul class="filter" data-advanced="1" data-sort="create_date:ascending">' +
                    '<div class="data-source" data-type="json">' +
                    '<ul class="order">' +
                    '<li data-name="name" data-order="ascending">name</li>' +
                    '<li data-name="create_date">created</li>' +
                    "</ul>" +
                    "</div>" +
                    "</ul>"
            );
            jQuery(".filter").uxfilter();

            const option = jQuery(".filter-sort-option.selected");
            assert.strictEqual(option.length, 1);
            assert.strictEqual(option.attr("data-name"), "create_date");
            assert.strictEqual(option.hasClass("ascending"), true);
            assert.strictEqual(jQuery(".filter-sort-option.equals").length, 0);
            assert.strictEqual(queries.length, 1);
            assert.deepStrictEqual(queries[0].sort, ["create_date", "ascending"]);
        });
        it("should keep the default sort option with an unknown sort attribute", () => {
            const jQuery = global.jQuery;

            for (const sort of ["unknown:ascending", "name:sideways", "name"]) {
                jQuery("body").empty();
                jQuery("body").append(
                    '<ul class="filter" data-advanced="1" data-sort="' +
                        sort +
                        '">' +
                        '<div class="data-source" data-type="json">' +
                        '<ul class="order"><li data-name="name">name</li></ul>' +
                        "</div>" +
                        "</ul>"
                );
                jQuery(".filter").uxfilter();

                const option = jQuery(".filter-sort-option.selected");
                assert.strictEqual(option.length, 1);
                assert.strictEqual(option.attr("data-name"), "default");
                assert.strictEqual(option.hasClass("equals"), true);
            }

            assert.strictEqual(queries.length, 3);
            assert.deepStrictEqual(queries[2].sort, ["default", "descending"]);
        });
    });

    describe("#search", function() {
        let uxdataquery = null;
        let queries = null;
        let callbacks = null;

        beforeEach(() => {
            const jQuery = global.jQuery;
            uxdataquery = jQuery.fn.uxdataquery;
            queries = [];
            callbacks = [];
            jQuery.fn.uxdataquery = function(query, callback) {
                queries.push(query);
                callbacks.push(callback);
            };
        });

        afterEach(() => {
            const jQuery = global.jQuery;
            jQuery.fn.uxdataquery = uxdataquery;
        });

        it("should query once the search changes", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append(
                '<ul class="filter"><div class="data-source" data-type="json"></div></ul>'
            );
            jQuery(".filter").uxfilter();
            callbacks[0]([], false);
            assert.strictEqual(queries.length, 1);
            assert.strictEqual(queries[0].filterString, "");

            jQuery(".filter-input").uxtextfield("value", { value: "paper" });
            jQuery(".filter-input").keyup();
            assert.strictEqual(queries.length, 2);
            assert.strictEqual(queries[1].filterString, "paper");
            assert.strictEqual(queries[1].startRecord, 0);
        });
        it("should not query while the search is the same", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append(
                '<ul class="filter"><div class="data-source" data-type="json"></div></ul>'
            );
            jQuery(".filter").uxfilter();
            callbacks[0]([], false);

            jQuery(".filter-input").keyup();
            assert.strictEqual(queries.length, 1);

            jQuery(".filter-input").uxtextfield("value", { value: "paper" });
            jQuery(".filter-input").keyup();
            jQuery(".filter-input").keyup();
            assert.strictEqual(queries.length, 2);

            callbacks[1]([], false);
            jQuery(".filter-input").keyup();
            assert.strictEqual(queries.length, 2);
        });
        it("should query when the search changes before the previous query ends", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append(
                '<ul class="filter"><div class="data-source" data-type="json"></div></ul>'
            );
            jQuery(".filter").uxfilter();
            callbacks[0]([], false);

            jQuery(".filter-input").uxtextfield("value", { value: "paper" });
            jQuery(".filter-input").keyup();
            jQuery(".filter-input").uxtextfield("value", { value: "" });
            jQuery(".filter-input").keyup();
            assert.strictEqual(queries.length, 3);
            assert.strictEqual(queries[2].filterString, "");

            jQuery(".filter-input").uxtextfield("value", { value: "paper" });
            jQuery(".filter-input").keyup();
            assert.strictEqual(queries.length, 4);
            assert.strictEqual(queries[3].filterString, "paper");

            callbacks[3]([], false);
            jQuery(".filter-input").keyup();
            assert.strictEqual(queries.length, 4);
        });
        it("should query again the search of a query that failed", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append(
                '<ul class="filter"><div class="data-source" data-type="json"></div></ul>'
            );
            jQuery(".filter").uxfilter();
            callbacks[0]([], false);

            jQuery(".filter-input").uxtextfield("value", { value: "paper" });
            jQuery(".filter-input").keyup();
            callbacks[1](null, null);
            jQuery(".filter-input").keyup();
            assert.strictEqual(queries.length, 3);
            assert.strictEqual(queries[2].filterString, "paper");

            callbacks[2]([], false);
            jQuery(".filter-input").uxtextfield("value", { value: "" });
            jQuery(".filter-input").keyup();
            callbacks[3](null, null);
            jQuery(".filter-input").keyup();
            assert.strictEqual(queries.length, 5);
            assert.strictEqual(queries[4].filterString, "");
        });
    });

    describe("#state", function() {
        let uxdataquery = null;
        let uxapply = null;
        let queries = null;
        let lookups = null;
        let results = null;

        beforeEach(() => {
            const jQuery = global.jQuery;
            uxdataquery = jQuery.fn.uxdataquery;
            uxapply = jQuery.fn.uxapply;
            queries = [];
            lookups = [];
            results = {};
            jQuery.fn.uxdataquery = function(query, callback) {
                const url = this.attr("data-url");
                if (url === "/products.json") {
                    queries.push(query);
                } else {
                    lookups.push([url, query]);
                }
                results[url] && callback.apply(this, results[url]);
            };
            jQuery.fn.uxapply = function() {
                return this;
            };
        });

        afterEach(() => {
            const jQuery = global.jQuery;
            jQuery.fn.uxdataquery = uxdataquery;
            jQuery.fn.uxapply = uxapply;
            delete window.history.replaceState;
            global.dom.reconfigure({ url: "https://localhost/" });
        });

        it("should not read the state without the advanced panel", () => {
            const jQuery = global.jQuery;

            build(jQuery, "https://localhost/products?filter_string=paper&view=table", "");

            assert.strictEqual(jQuery(".filter-input").val(), "");
            assert.strictEqual(jQuery(".filter").hasClass("list-list"), true);
            assert.strictEqual(queries.length, 1);
            assert.strictEqual(queries[0].filterString, "");
        });
        it("should not read the state with the no state flag", () => {
            const jQuery = global.jQuery;
            const search =
                "?filter_string=paper&filters[]=name:like:a4&sort=name:ascending&view=table";

            results["/products.json"] = [[{ object_id: 1 }], false];
            build(
                jQuery,
                "https://localhost/products" + search,
                'data-advanced="1" data-no_state="1"'
            );

            assert.strictEqual(jQuery(".filter-input").val(), "");
            assert.strictEqual(jQuery(".filter").hasClass("list-list"), true);
            assert.deepStrictEqual(lines(jQuery), [["name", "contains", ""]]);
            assert.strictEqual(queries.length, 1);
            assert.deepStrictEqual(queries[0].sort, ["default", "descending"]);
            assert.deepStrictEqual(queries[0].filters, []);

            jQuery(".filter-sort-option[data-name='create_date']").click();
            jQuery(".filter-input-toggle-views").click();
            assert.strictEqual(queries.length, 2);
            assert.strictEqual(jQuery(".filter").hasClass("table-list"), true);
            assert.strictEqual(window.location.search, search);
        });
        it("should not read the state with no input", () => {
            const jQuery = global.jQuery;
            const search = "?filter_string=paper&view=table";

            build(
                jQuery,
                "https://localhost/products" + search,
                'data-advanced="1" data-no_input="1"'
            );

            assert.strictEqual(jQuery(".filter-input").length, 0);
            assert.strictEqual(jQuery(".filter-advanced").length, 0);
            assert.strictEqual(jQuery(".filter").hasClass("list-list"), true);
            assert.strictEqual(queries.length, 1);
            assert.strictEqual(queries[0].filterString, "");

            jQuery(".filter").triggerHandler("update", ["a4"]);
            assert.strictEqual(queries.length, 2);
            assert.strictEqual(queries[1].filterString, "a4");
            assert.strictEqual(window.location.search, search);
        });
        it("should set the search of the state in the created input", () => {
            const jQuery = global.jQuery;

            build(jQuery, "https://localhost/products?filter_string=paper+a4");

            assert.strictEqual(jQuery(".filter-input").val(), "paper a4");
            assert.strictEqual(queries.length, 1);
            assert.strictEqual(queries[0].filterString, "paper a4");
        });
        it("should set the search of the state over the value attribute", () => {
            const jQuery = global.jQuery;

            build(jQuery, "https://localhost/products", 'data-advanced="1" value="initial"');
            assert.strictEqual(jQuery(".filter-input").val(), "initial");
            assert.strictEqual(queries[0].filterString, "initial");

            build(
                jQuery,
                "https://localhost/products?filter_string=paper",
                'data-advanced="1" value="initial"'
            );
            assert.strictEqual(jQuery(".filter-input").val(), "paper");
            assert.strictEqual(queries[1].filterString, "paper");

            build(
                jQuery,
                "https://localhost/products?filter_string=",
                'data-advanced="1" value="initial"'
            );
            assert.strictEqual(jQuery(".filter-input").val(), "");
            assert.strictEqual(queries[2].filterString, "");
        });
        it("should set the search of the state in the existing input", () => {
            const jQuery = global.jQuery;

            global.dom.reconfigure({ url: "https://localhost/products?filter_string=paper" });
            jQuery("body").empty();
            jQuery("body").append(
                '<ul class="filter" data-advanced="1" data-no_input="1">' +
                    '<input type="text" class="text-field filter-input" />' +
                    '<div class="data-source" data-url="/products.json" data-type="json"></div>' +
                    "</ul>"
            );
            jQuery(".filter").uxfilter();

            assert.strictEqual(jQuery(".filter-input").length, 1);
            assert.strictEqual(jQuery(".filter-input").val(), "paper");
            assert.strictEqual(queries.length, 1);
            assert.strictEqual(queries[0].filterString, "paper");
        });
        it("should show the advanced panel with the filters of the state", () => {
            const jQuery = global.jQuery;

            build(jQuery, "https://localhost/products?filters[]=name:like:paper");

            const toggle = jQuery(".filter-input-toggle-advanced");
            assert.strictEqual(toggle.hasClass("filter-input-less"), true);
            assert.strictEqual(toggle.hasClass("filter-input-more"), false);
            assert.strictEqual(jQuery(".filter-advanced").css("display"), "block");
        });
        it("should show the advanced panel with the sort of the state", () => {
            const jQuery = global.jQuery;

            build(jQuery, "https://localhost/products?sort=name:descending");

            const toggle = jQuery(".filter-input-toggle-advanced");
            assert.strictEqual(toggle.hasClass("filter-input-less"), true);
            assert.strictEqual(toggle.hasClass("filter-input-more"), false);
            assert.strictEqual(jQuery(".filter-advanced").css("display"), "block");
        });
        it("should show the advanced panel hidden by a style applied later", () => {
            const jQuery = global.jQuery;

            global.dom.reconfigure({ url: "https://localhost/products?sort=name:ascending" });
            jQuery("body").empty();
            jQuery("body").append(
                '<ul class="filter" data-advanced="1">' +
                    '<div class="data-source" data-url="/products.json" data-type="json">' +
                    '<ul class="order"><li data-name="name">name</li></ul>' +
                    "</div>" +
                    "</ul>"
            );
            jQuery(".filter").uxfilter();
            jQuery("body").append("<style>.filter-advanced { display: none; }</style>");
            assert.strictEqual(jQuery(".filter-advanced").css("display"), "block");

            jQuery(".filter-input-toggle-advanced").click();
            assert.strictEqual(jQuery(".filter-advanced").css("display"), "none");

            jQuery(".filter-input-toggle-advanced").click();
            assert.strictEqual(jQuery(".filter-advanced").css("display"), "block");
        });
        it("should keep the advanced panel hidden with the remaining state", () => {
            const jQuery = global.jQuery;

            for (const search of ["", "?filter_string=paper&view=table", "?sort=unknown:ascending"]) {
                build(jQuery, "https://localhost/products" + search);

                const toggle = jQuery(".filter-input-toggle-advanced");
                assert.strictEqual(toggle.hasClass("filter-input-less"), false);
                assert.strictEqual(toggle.hasClass("filter-input-more"), true);
                assert.strictEqual(jQuery(".filter-advanced").css("display"), "none");
            }
        });
        it("should query only once with the complete state", () => {
            const jQuery = global.jQuery;

            results["/brands.json"] = [[{ object_id: 12, name: "Seiko" }], false];
            build(
                jQuery,
                "https://localhost/products?filter_string=paper&filters[]=name:like:a4" +
                    "&filters[]=brand:equals:12&sort=name:descending&view=gallery"
            );

            assert.strictEqual(queries.length, 1);
            assert.deepStrictEqual(queries[0], {
                filterString: "paper",
                sort: ["name", "descending"],
                filters: [
                    ["name", "like", "a4"],
                    ["brand", "equals", "12"]
                ],
                startRecord: 0,
                numberRecords: 9
            });
        });
        it("should keep the URL while starting", () => {
            const jQuery = global.jQuery;
            const search = "?filter_string=paper&filters[]=unknown:equals:1&sort=name&view=grid";
            let count = 0;

            window.history.replaceState = () => count++;
            build(jQuery, "https://localhost/products" + search);

            assert.strictEqual(queries.length, 1);
            assert.strictEqual(count, 0);
            assert.strictEqual(window.location.search, search);
        });
        it("should write the view once toggled", () => {
            const jQuery = global.jQuery;

            results["/products.json"] = [[{ object_id: 1 }], false];
            build(jQuery, "https://localhost/products");

            jQuery(".filter-input-toggle-views").click();
            assert.strictEqual(jQuery(".filter").hasClass("table-list"), true);
            assert.strictEqual(window.location.search, "?view=table");

            jQuery(".filter-input-toggle-views").click();
            assert.strictEqual(jQuery(".filter").hasClass("gallery-list"), true);
            assert.strictEqual(window.location.search, "?view=gallery");

            jQuery(".filter-input-toggle-views").click();
            assert.strictEqual(jQuery(".filter").hasClass("list-list"), true);
            assert.strictEqual(window.location.search, "");
        });
        it("should keep the URL when the view can't be toggled", () => {
            const jQuery = global.jQuery;

            global.dom.reconfigure({ url: "https://localhost/products?view=grid" });
            jQuery("body").empty();
            jQuery("body").append(
                '<ul class="filter list-list" data-advanced="1">' +
                    '<div class="data-source" data-url="/products.json" data-type="json"></div>' +
                    '<li class="template"><div class="list-view"></div></li>' +
                    "</ul>"
            );
            jQuery(".filter").uxfilter();

            jQuery(".filter-input-toggle-views").click();
            assert.strictEqual(jQuery(".filter").hasClass("list-list"), true);
            assert.strictEqual(window.location.search, "?view=grid");
        });
        it("should write the search once changed", () => {
            const jQuery = global.jQuery;

            results["/products.json"] = [[], false];
            build(jQuery, "https://localhost/products");

            jQuery(".filter-input").uxtextfield("value", { value: "paper a4" });
            jQuery(".filter-input").keyup();
            assert.strictEqual(queries.length, 2);
            assert.strictEqual(queries[1].filterString, "paper a4");
            assert.strictEqual(window.location.search, "?filter_string=paper%20a4");

            jQuery(".filter-input").uxtextfield("value", { value: "" });
            jQuery(".filter-input").keyup();
            assert.strictEqual(queries.length, 3);
            assert.strictEqual(queries[2].filterString, "");
            assert.strictEqual(window.location.search, "");
        });
        it("should write the search changed before the previous query ends", () => {
            const jQuery = global.jQuery;

            build(jQuery, "https://localhost/products");

            jQuery(".filter-input").uxtextfield("value", { value: "paper" });
            jQuery(".filter-input").keyup();
            assert.strictEqual(window.location.search, "?filter_string=paper");

            jQuery(".filter-input").uxtextfield("value", { value: "" });
            jQuery(".filter-input").keyup();
            assert.strictEqual(queries.length, 3);
            assert.strictEqual(queries[2].filterString, "");
            assert.strictEqual(window.location.search, "");
        });
        it("should write the sort once changed", () => {
            const jQuery = global.jQuery;

            build(jQuery, "https://localhost/products");

            jQuery(".filter-sort-option[data-name='name']").click();
            assert.strictEqual(window.location.search, "?sort=name:ascending");

            jQuery(".filter-sort-option[data-name='name']").click();
            assert.strictEqual(window.location.search, "?sort=name:descending");

            jQuery(".filter-sort-option[data-name='default']").click();
            assert.deepStrictEqual(queries[3].sort, ["default", "descending"]);
            assert.strictEqual(window.location.search, "");
        });
        it("should write the filters once changed", () => {
            const jQuery = global.jQuery;

            build(jQuery, "https://localhost/products");

            const line = jQuery(".filter-advanced-filter");
            jQuery("> .value-field", line).uxtextfield("value", { value: "a4" });
            assert.deepStrictEqual(queries[1].filters, [["name", "like", "a4"]]);
            assert.strictEqual(window.location.search, "?filters[]=name:like:a4");

            jQuery("> .operation-field", line).uxdropfield("set", { value: "matches" });
            jQuery("> .operation-field", line).triggerHandler("value_select");
            assert.strictEqual(window.location.search, "?filters[]=name:equals:a4");

            jQuery("> .drop-field:not(.operation-field)", line).triggerHandler("value_select", [
                "stock"
            ]);
            assert.strictEqual(window.location.search, "");

            jQuery("> .value-field", line).uxtextfield("value", { value: "3" });
            jQuery(".filter-advanced > .filter-input-add").click();
            jQuery(".filter-advanced-filter > .value-field")
                .first()
                .uxtextfield("value", { value: "a4" });
            assert.strictEqual(
                window.location.search,
                "?filters[]=name:like:a4&filters[]=stock:equals:3"
            );

            jQuery(".filter-advanced-filter > .filter-input-remove")
                .first()
                .click();
            assert.strictEqual(window.location.search, "?filters[]=stock:equals:3");
        });
        it("should query and write the filters with the zero value", () => {
            const jQuery = global.jQuery;

            build(
                jQuery,
                "https://localhost/products?filters[]=create_date:in_day:0&filters[]=stock:equals:0"
            );

            assert.deepStrictEqual(lines(jQuery), [
                ["create_date", "in", "1970/01/01"],
                ["stock", "equals", "0"]
            ]);
            assert.deepStrictEqual(queries[0].filters, [
                ["create_date", "in_day", 0],
                ["stock", "equals", "0"]
            ]);

            jQuery(".filter-sort-option[data-name='name']").click();
            assert.deepStrictEqual(queries[1].filters, queries[0].filters);
            assert.strictEqual(
                window.location.search,
                "?filters[]=create_date:in_day:0&filters[]=stock:equals:0&sort=name:ascending"
            );
        });
        it("should not write the filters with no value", () => {
            const jQuery = global.jQuery;

            build(jQuery, "https://localhost/products");

            jQuery(".filter-advanced > .filter-input-add").click();
            assert.strictEqual(jQuery(".filter-advanced-filter").length, 2);
            assert.strictEqual(queries.length, 2);
            assert.deepStrictEqual(queries[1].filters, []);
            assert.strictEqual(window.location.search, "");
        });
        it("should not write the base filters", () => {
            const jQuery = global.jQuery;

            build(jQuery, "https://localhost/products?filters[]=name:like:a4");

            jQuery(".filter").data("filters", [["status", "equals", 1]]);
            jQuery(".filter-sort-option[data-name='name']").click();
            assert.deepStrictEqual(queries[1].filters, [
                ["status", "equals", 1],
                ["name", "like", "a4"]
            ]);
            assert.strictEqual(
                window.location.search,
                "?filters[]=name:like:a4&sort=name:ascending"
            );
        });
        it("should not write the state when loading more", () => {
            const jQuery = global.jQuery;
            let count = 0;

            results["/products.json"] = [[], true];
            build(jQuery, "https://localhost/products?view=grid");

            window.history.replaceState = () => count++;
            jQuery(".filter-more").click();
            assert.strictEqual(queries.length, 2);
            assert.strictEqual(queries[1].startRecord, 9);
            assert.strictEqual(count, 0);
            assert.strictEqual(window.location.search, "?view=grid");
        });
        it("should add the filter lines with the first field", () => {
            const jQuery = global.jQuery;

            build(jQuery, "https://localhost/products");
            assert.deepStrictEqual(lines(jQuery), [["name", "contains", ""]]);

            jQuery("> .value-field", ".filter-advanced-filter").uxtextfield("value", {
                value: "a4"
            });
            jQuery(".filter-advanced > .filter-input-add").click();
            jQuery(".filter-advanced-filter > .filter-input-add")
                .last()
                .click();
            assert.deepStrictEqual(lines(jQuery), [
                ["name", "contains", ""],
                ["name", "contains", "a4"],
                ["name", "contains", ""]
            ]);
        });
        it("should add the filter lines with the first field when another has no name", () => {
            const jQuery = global.jQuery;

            global.dom.reconfigure({ url: "https://localhost/products" });
            jQuery("body").empty();
            jQuery("body").append(
                '<ul class="filter" data-advanced="1">' +
                    '<div class="data-source" data-url="/products.json" data-type="json">' +
                    '<ul class="filtering">' +
                    '<li data-name="name" data-type="string">name</li>' +
                    '<li data-type="number">stock</li>' +
                    "</ul>" +
                    "</div>" +
                    "</ul>"
            );
            jQuery(".filter").uxfilter();

            assert.deepStrictEqual(lines(jQuery), [["name", "contains", ""]]);
        });
        it("should restore the filter lines of the state", () => {
            const jQuery = global.jQuery;

            results["/brands.json"] = [[{ object_id: 12, name: "Seiko" }], false];
            build(
                jQuery,
                "https://localhost/products?filters[]=brand:equals:12&filters[]=name:rlike:paper" +
                    "&filters[]=stock:lesser:-3&filters[]=weight:greater:1.5" +
                    "&filters[]=create_date:in_day:1767225600&filters[]=stock:greater:-9"
            );

            assert.deepStrictEqual(lines(jQuery), [
                ["brand", "search", "Seiko"],
                ["name", "begins with", "paper"],
                ["stock", "less than", "-3"],
                ["weight", "greater than", "1.5"],
                ["create_date", "in", "2026/01/01"],
                ["stock", "greater than", "-9"]
            ]);
            assert.strictEqual(queries.length, 1);
            assert.deepStrictEqual(queries[0].filters, [
                ["brand", "equals", "12"],
                ["name", "rlike", "paper"],
                ["stock", "lesser", "-3"],
                ["weight", "greater", "1.5"],
                ["create_date", "in_day", 1767225600],
                ["stock", "greater", "-9"]
            ]);
        });
        it("should ignore the filters of the state with unknown fields", () => {
            const jQuery = global.jQuery;

            build(
                jQuery,
                "https://localhost/products?filters[]=unknown:equals:1" +
                    "&filters[]=constructor:equals:1&filters[]=name:like:paper"
            );

            assert.deepStrictEqual(lines(jQuery), [["name", "contains", "paper"]]);
            assert.deepStrictEqual(queries[0].filters, [["name", "like", "paper"]]);
        });
        it("should ignore the filters of the state with unknown operations", () => {
            const jQuery = global.jQuery;

            build(
                jQuery,
                "https://localhost/products?filters[]=name:greater:paper" +
                    "&filters[]=brand:like:12&filters[]=stock:equals:3&filters[]=weight:in_day:1"
            );

            assert.deepStrictEqual(lines(jQuery), [["stock", "equals", "3"]]);
            assert.deepStrictEqual(queries[0].filters, [["stock", "equals", "3"]]);
            assert.deepStrictEqual(lookups, []);
        });
        it("should ignore the filters of the state with invalid values", () => {
            const jQuery = global.jQuery;

            build(
                jQuery,
                "https://localhost/products?filters[]=stock:equals:abc&filters[]=stock:equals:1.5" +
                    "&filters[]=weight:equals:1,5&filters[]=weight:equals:." +
                    "&filters[]=weight:equals:-&filters[]=weight:equals:1.2.3" +
                    "&filters[]=create_date:in_day:2026-01-01&filters[]=name:like:" +
                    "&filters[]=create_date:in_day:9999999999999" +
                    "&filters[]=brand:equals:&filters[]=weight:lesser:2.50"
            );

            assert.deepStrictEqual(lines(jQuery), [["weight", "less than", "2.50"]]);
            assert.deepStrictEqual(queries[0].filters, [["weight", "lesser", "2.50"]]);
            assert.deepStrictEqual(lookups, []);
        });
        it("should restore the float values as accepted by the field", () => {
            const jQuery = global.jQuery;

            build(
                jQuery,
                "https://localhost/products?filters[]=weight:equals:.5" +
                    "&filters[]=weight:greater:1.&filters[]=weight:lesser:-0.25"
            );

            assert.deepStrictEqual(lines(jQuery), [
                ["weight", "equals", ".5"],
                ["weight", "greater than", "1."],
                ["weight", "less than", "-0.25"]
            ]);
            assert.deepStrictEqual(queries[0].filters, [
                ["weight", "equals", ".5"],
                ["weight", "greater", "1."],
                ["weight", "lesser", "-0.25"]
            ]);
        });
        it("should add the initial filter line when no filter of the state is valid", () => {
            const jQuery = global.jQuery;

            build(jQuery, "https://localhost/products?filters[]=unknown:equals:1");

            assert.deepStrictEqual(lines(jQuery), [["name", "contains", ""]]);
            assert.deepStrictEqual(queries[0].filters, []);
            assert.strictEqual(
                jQuery(".filter-input-toggle-advanced").hasClass("filter-input-more"),
                true
            );
        });
        it("should not restore the filter lines without the filtering", () => {
            const jQuery = global.jQuery;

            global.dom.reconfigure({ url: "https://localhost/products?filters[]=name:like:paper" });
            jQuery("body").empty();
            jQuery("body").append(
                '<ul class="filter" data-advanced="1">' +
                    '<div class="data-source" data-url="/products.json" data-type="json"></div>' +
                    "</ul>"
            );
            jQuery(".filter").uxfilter();

            assert.deepStrictEqual(lines(jQuery), []);
            assert.strictEqual(queries.length, 1);
            assert.deepStrictEqual(queries[0].filters, []);
            assert.strictEqual(
                jQuery(".filter-input-toggle-advanced").hasClass("filter-input-more"),
                true
            );
        });
        it("should restore the dates of the state as days", () => {
            const jQuery = global.jQuery;

            build(
                jQuery,
                "https://localhost/products?filters[]=create_date:greater:1767225600" +
                    "&filters[]=create_date:lesser:1767311999&filters[]=create_date:in_day:-86400"
            );

            assert.deepStrictEqual(lines(jQuery), [
                ["create_date", "after", "2026/01/01"],
                ["create_date", "before", "2026/01/01"],
                ["create_date", "in", "1969/12/31"]
            ]);
            assert.deepStrictEqual(queries[0].filters, [
                ["create_date", "greater", 1767225600],
                ["create_date", "lesser", 1767225600],
                ["create_date", "in_day", -86400]
            ]);
        });
        it("should resolve the display value of the references of the state", () => {
            const jQuery = global.jQuery;

            results["/brands.json"] = [[{ object_id: 12, name: "Seiko" }], false];
            build(jQuery, "https://localhost/products?filters[]=brand:equals:12");

            const valueField = jQuery(".filter-advanced-filter > .value-field");
            assert.deepStrictEqual(lookups, [
                [
                    "/brands.json",
                    { filters: [["object_id", "equals", "12"]], startRecord: 0, numberRecords: 1 }
                ]
            ]);
            assert.strictEqual(jQuery(".text-field", valueField).val(), "Seiko");
            assert.strictEqual(jQuery(".hidden-field", valueField).val(), "12");
            assert.strictEqual(valueField.hasClass("drop-field-lock"), true);
            assert.strictEqual(queries.length, 1);
            assert.deepStrictEqual(queries[0].filters, [["brand", "equals", "12"]]);
        });
        it("should resolve the falsy display values of the references of the state", () => {
            const jQuery = global.jQuery;

            for (const name of [0, false]) {
                results["/brands.json"] = [[{ object_id: 12, name: name }], false];
                build(jQuery, "https://localhost/products?filters[]=brand:equals:12");

                const valueField = jQuery(".filter-advanced-filter > .value-field");
                assert.strictEqual(jQuery(".text-field", valueField).val(), String(name));
                assert.strictEqual(jQuery(".hidden-field", valueField).val(), "12");
            }
        });
        it("should keep the identifier of the references that are not resolved", () => {
            const jQuery = global.jQuery;

            for (const result of [
                undefined,
                [[], false],
                [null, null],
                [[{ object_id: 99, name: "Casio" }], false],
                [[{ object_id: 12 }], false],
                [[{ object_id: 12, name: null }], false],
                [[{ object_id: 12, name: "" }], false]
            ]) {
                results["/brands.json"] = result;
                build(jQuery, "https://localhost/products?filters[]=brand:equals:12");

                const valueField = jQuery(".filter-advanced-filter > .value-field");
                assert.strictEqual(jQuery(".text-field", valueField).val(), "12");
                assert.strictEqual(jQuery(".hidden-field", valueField).val(), "12");
            }

            assert.strictEqual(queries.length, 7);
            assert.deepStrictEqual(queries[6].filters, [["brand", "equals", "12"]]);
        });
        it("should keep the references changed while being resolved", () => {
            const jQuery = global.jQuery;
            const callbacks = [];

            jQuery.fn.uxdataquery = function(query, callback) {
                this.attr("data-url") === "/brands.json" && callbacks.push(callback);
            };
            build(jQuery, "https://localhost/products?filters[]=brand:equals:12");

            const valueField = jQuery(".filter-advanced-filter > .value-field");
            valueField.uxdropfield("set", { value: "Casio", valueLogic: "13" });
            assert.strictEqual(callbacks.length, 1);
            callbacks[0]([{ object_id: 12, name: "Seiko" }], false);

            assert.strictEqual(jQuery(".text-field", valueField).val(), "Casio");
            assert.strictEqual(jQuery(".hidden-field", valueField).val(), "13");
        });
        it("should select the sort option of the state", () => {
            const jQuery = global.jQuery;

            build(jQuery, "https://localhost/products?sort=create_date:ascending");

            const option = jQuery(".filter-sort-option.selected");
            assert.strictEqual(option.length, 1);
            assert.strictEqual(option.attr("data-name"), "create_date");
            assert.strictEqual(option.hasClass("ascending"), true);
            assert.strictEqual(option.hasClass("descending"), false);
            assert.strictEqual(jQuery(".filter-sort-option.equals").length, 0);
            assert.strictEqual(queries.length, 1);
            assert.deepStrictEqual(queries[0].sort, ["create_date", "ascending"]);
        });
        it("should ignore the sort of the state with an unknown option", () => {
            const jQuery = global.jQuery;

            build(jQuery, "https://localhost/products?sort=unknown:ascending");

            const option = jQuery(".filter-sort-option.selected");
            assert.strictEqual(option.length, 1);
            assert.strictEqual(option.attr("data-name"), "default");
            assert.deepStrictEqual(queries[0].sort, ["default", "descending"]);
        });
        it("should ignore the sort of the state with an invalid order", () => {
            const jQuery = global.jQuery;

            for (const sort of ["name:sideways", "name:equals", "name", "name:ascending:1"]) {
                build(jQuery, "https://localhost/products?sort=" + sort);

                const option = jQuery(".filter-sort-option.selected");
                assert.strictEqual(option.length, 1);
                assert.strictEqual(option.attr("data-name"), "default");
                assert.strictEqual(option.hasClass("equals"), true);
            }

            assert.deepStrictEqual(queries[3].sort, ["default", "descending"]);
        });
        it("should select the default sort option of the state over the sort attribute", () => {
            const jQuery = global.jQuery;

            build(
                jQuery,
                "https://localhost/products?sort=default:descending",
                'data-advanced="1" data-sort="name:ascending"'
            );

            const option = jQuery(".filter-sort-option.selected");
            assert.strictEqual(option.length, 1);
            assert.strictEqual(option.attr("data-name"), "default");
            assert.strictEqual(option.hasClass("equals"), true);
            assert.deepStrictEqual(queries[0].sort, ["default", "descending"]);

            jQuery(".filter").triggerHandler("update");
            assert.strictEqual(window.location.search, "?sort=default:descending");
        });
        it("should ignore the default sort of the state with an invalid order", () => {
            const jQuery = global.jQuery;

            for (const sort of ["default:sideways", "default:equals", "default"]) {
                build(
                    jQuery,
                    "https://localhost/products?sort=" + sort,
                    'data-advanced="1" data-sort="name:ascending"'
                );

                const option = jQuery(".filter-sort-option.selected");
                assert.strictEqual(option.length, 1);
                assert.strictEqual(option.attr("data-name"), "name");
                assert.strictEqual(option.hasClass("ascending"), true);
                assert.strictEqual(
                    jQuery(".filter-input-toggle-advanced").hasClass("filter-input-more"),
                    true
                );
            }

            assert.deepStrictEqual(queries[2].sort, ["name", "ascending"]);
        });
        it("should select the sort option of the state by its text", () => {
            const jQuery = global.jQuery;

            global.dom.reconfigure({ url: "https://localhost/products?sort=criado:ascending" });
            jQuery("body").empty();
            jQuery("body").append(
                '<ul class="filter" data-advanced="1">' +
                    '<div class="data-source" data-url="/products.json" data-type="json">' +
                    '<ul class="order"><li>criado</li></ul>' +
                    "</div>" +
                    "</ul>"
            );
            jQuery(".filter").uxfilter();

            const option = jQuery(".filter-sort-option.selected");
            assert.strictEqual(option.text(), "criado");
            assert.strictEqual(option.hasClass("ascending"), true);
            assert.deepStrictEqual(queries[0].sort, ["criado", "ascending"]);
        });
        it("should select the view of the state", () => {
            const jQuery = global.jQuery;

            build(jQuery, "https://localhost/products?view=table");

            const toggle = jQuery(".filter-input-toggle-views");
            assert.strictEqual(jQuery(".filter").hasClass("table-list"), true);
            assert.strictEqual(jQuery(".filter").hasClass("list-list"), false);
            assert.strictEqual(toggle.hasClass("filter-input-table"), true);
            assert.strictEqual(toggle.hasClass("filter-input-list"), false);
            assert.strictEqual(queries.length, 1);
            assert.strictEqual(queries[0].numberRecords, 14);
        });
        it("should select the view of the state with a plain template", () => {
            const jQuery = global.jQuery;

            global.dom.reconfigure({ url: "https://localhost/products?view=gallery" });
            jQuery("body").empty();
            jQuery("body").append(
                '<ul class="filter list-list" data-advanced="1">' +
                    '<div class="data-source" data-url="/products.json" data-type="json"></div>' +
                    '<li class="template">' +
                    '<div class="list-view"></div><div class="left gallery-view"></div>' +
                    "</li>" +
                    "</ul>"
            );
            jQuery(".filter").uxfilter();
            assert.strictEqual(jQuery(".filter").hasClass("gallery-list"), true);
            assert.strictEqual(jQuery(".filter").hasClass("list-list"), false);

            jQuery("body").empty();
            jQuery("body").append(
                '<ul class="filter list-list" data-advanced="1">' +
                    '<div class="data-source" data-url="/products.json" data-type="json"></div>' +
                    '<li class="template">' +
                    '<div data-class="list-view"></div><div data-class="left gallery-view"></div>' +
                    "</li>" +
                    "</ul>"
            );
            jQuery(".filter").uxfilter();
            assert.strictEqual(jQuery(".filter").hasClass("gallery-list"), true);
            assert.strictEqual(jQuery(".filter").hasClass("list-list"), false);
        });
        it("should ignore the unknown view of the state", () => {
            const jQuery = global.jQuery;

            for (const view of ["grid", "list-list", "Table", ""]) {
                build(jQuery, "https://localhost/products?view=" + view);

                const toggle = jQuery(".filter-input-toggle-views");
                assert.strictEqual(jQuery(".filter").hasClass("list-list"), true);
                assert.strictEqual(jQuery(".filter").hasClass(view + "-list"), false);
                assert.strictEqual(jQuery(".filter").hasClass("table-list"), false);
                assert.strictEqual(toggle.hasClass("filter-input-list"), true);
            }
        });
        it("should ignore the view of the state that can't be displayed", () => {
            const jQuery = global.jQuery;

            global.dom.reconfigure({ url: "https://localhost/products?view=gallery" });
            jQuery("body").empty();
            jQuery("body").append(
                '<ul class="filter list-list" data-advanced="1">' +
                    '<div class="data-source" data-url="/products.json" data-type="json"></div>' +
                    '<li class="template">' +
                    '<div class="list-view"></div><div class="table-view"></div>' +
                    "</li>" +
                    "</ul>"
            );
            jQuery(".filter").uxfilter();

            assert.strictEqual(jQuery(".filter").hasClass("list-list"), true);
            assert.strictEqual(jQuery(".filter").hasClass("gallery-list"), false);
        });
        it("should select the view of the state with no default view", () => {
            const jQuery = global.jQuery;

            global.dom.reconfigure({ url: "https://localhost/products?view=gallery" });
            jQuery("body").empty();
            jQuery("body").append(
                '<ul class="filter" data-advanced="1">' +
                    '<div class="data-source" data-url="/products.json" data-type="json"></div>' +
                    '<li class="template">' +
                    '<div class="list-view"></div><div class="gallery-view"></div>' +
                    "</li>" +
                    "</ul>"
            );
            jQuery(".filter").uxfilter();

            assert.strictEqual(jQuery(".filter").hasClass("gallery-list"), true);

            jQuery(".filter-input-toggle-views").click();
            assert.strictEqual(jQuery(".filter").hasClass("list-list"), true);
            assert.strictEqual(window.location.search, "?view=list");
        });
        it("should read the state from the encoded parameters", () => {
            const jQuery = global.jQuery;

            build(
                jQuery,
                "https://localhost/products?filter%5Fstring=paper%20a4+500" +
                    "&filters%5B%5D=name%3Arlike%3Apaper+a4&sort=name%3Adescending&view=%74able"
            );

            assert.strictEqual(jQuery(".filter-input").val(), "paper a4 500");
            assert.deepStrictEqual(lines(jQuery), [["name", "begins with", "paper a4"]]);
            assert.strictEqual(jQuery(".filter").hasClass("table-list"), true);
            assert.deepStrictEqual(queries[0].sort, ["name", "descending"]);
        });
        it("should read the filters of the state with no brackets", () => {
            const jQuery = global.jQuery;

            build(jQuery, "https://localhost/products?filters=name:like:paper&filters=stock:equals:3");

            assert.deepStrictEqual(queries[0].filters, [
                ["name", "like", "paper"],
                ["stock", "equals", "3"]
            ]);
        });
        it("should ignore the incomplete filters of the state", () => {
            const jQuery = global.jQuery;

            build(
                jQuery,
                "https://localhost/products?filters[]=name:like&filters[]=name&filters[]=" +
                    "&filters[]&filters[]=:like:paper&filters[]=stock:equals:3"
            );

            assert.deepStrictEqual(lines(jQuery), [["stock", "equals", "3"]]);
            assert.deepStrictEqual(queries[0].filters, [["stock", "equals", "3"]]);
        });
        it("should keep the separators in the values of the filters", () => {
            const jQuery = global.jQuery;

            build(jQuery, "https://localhost/products?filters[]=name:like:10:30:a4");

            assert.deepStrictEqual(lines(jQuery), [["name", "contains", "10:30:a4"]]);
            assert.deepStrictEqual(queries[0].filters, [["name", "like", "10:30:a4"]]);
        });
        it("should ignore the malformed parameters", () => {
            const jQuery = global.jQuery;

            build(
                jQuery,
                "https://localhost/products?filter_string=%E0%A4%A&filters[]=name:like:%" +
                    "&=paper&&view=table"
            );

            assert.strictEqual(jQuery(".filter-input").val(), "");
            assert.deepStrictEqual(lines(jQuery), [["name", "contains", ""]]);
            assert.strictEqual(jQuery(".filter").hasClass("table-list"), true);
            assert.strictEqual(queries.length, 1);
            assert.strictEqual(queries[0].filterString, "");
        });
        it("should ignore the parameters with no value", () => {
            const jQuery = global.jQuery;

            build(jQuery, "https://localhost/products?filter_string&filters[]&sort&view");

            assert.strictEqual(jQuery(".filter-input").val(), "");
            assert.deepStrictEqual(lines(jQuery), [["name", "contains", ""]]);
            assert.strictEqual(jQuery(".filter").hasClass("list-list"), true);
            assert.deepStrictEqual(queries[0].sort, ["default", "descending"]);
        });
        it("should keep the other parameters and the fragment", () => {
            const jQuery = global.jQuery;

            build(
                jQuery,
                "https://localhost/products?page=2&filter_string=paper&debug" +
                    "&name=a%20b+c&filters=name:like:a4&%E0%A4%A=1#top"
            );

            jQuery(".filter-sort-option[data-name='name']").click();
            assert.strictEqual(window.location.pathname, "/products");
            assert.strictEqual(
                window.location.search,
                "?page=2&debug&name=a%20b+c&%E0%A4%A=1&filter_string=paper" +
                    "&filters[]=name:like:a4&sort=name:ascending"
            );
            assert.strictEqual(window.location.hash, "#top");
        });
        it("should keep the state of the history entry", () => {
            const jQuery = global.jQuery;
            const state = { uuid: "1234", href: "https://localhost/products" };

            build(jQuery, "https://localhost/products");
            window.history.replaceState(state, null, "https://localhost/products");

            jQuery(".filter-sort-option[data-name='name']").click();
            assert.strictEqual(window.location.search, "?sort=name:ascending");
            assert.deepStrictEqual(window.history.state, state);
        });
        it("should leave the default values out", () => {
            const jQuery = global.jQuery;

            global.dom.reconfigure({ url: "https://localhost/products" });
            jQuery("body").empty();
            jQuery("body").append(
                '<ul class="filter table-list" data-advanced="1" data-sort="name:ascending">' +
                    '<div class="data-source" data-url="/products.json" data-type="json">' +
                    '<ul class="order"><li data-name="name" data-order="ascending">name</li></ul>' +
                    "</div>" +
                    '<li class="template">' +
                    '<div class="list-view"></div><div class="table-view"></div>' +
                    "</li>" +
                    "</ul>"
            );
            jQuery(".filter").uxfilter();

            jQuery(".filter-sort-option[data-name='name']").click();
            jQuery(".filter-input-toggle-views").click();
            assert.deepStrictEqual(queries[1].sort, ["name", "descending"]);
            assert.strictEqual(jQuery(".filter").hasClass("list-list"), true);
            assert.strictEqual(window.location.search, "?sort=name:descending&view=list");

            jQuery(".filter-sort-option[data-name='name']").click();
            jQuery(".filter-input-toggle-views").click();
            assert.deepStrictEqual(queries[2].sort, ["name", "ascending"]);
            assert.strictEqual(jQuery(".filter").hasClass("table-list"), true);
            assert.strictEqual(window.location.search, "");

            jQuery(".filter-sort-option[data-name='default']").click();
            assert.deepStrictEqual(queries[3].sort, ["default", "descending"]);
            assert.strictEqual(window.location.search, "?sort=default:descending");
        });
        it("should write the search cleared over the default one", () => {
            const jQuery = global.jQuery;

            results["/products.json"] = [[], false];
            build(jQuery, "https://localhost/products", 'data-advanced="1" value="initial"');

            jQuery(".filter-sort-option[data-name='name']").click();
            assert.strictEqual(queries[1].filterString, "initial");
            assert.strictEqual(window.location.search, "?sort=name:ascending");

            jQuery(".filter-input").uxtextfield("value", { value: "" });
            jQuery(".filter-input").keyup();
            assert.strictEqual(queries[2].filterString, "");
            assert.strictEqual(window.location.search, "?filter_string=&sort=name:ascending");

            jQuery(".filter-input").uxtextfield("value", { value: "paper" });
            jQuery(".filter-input").keyup();
            assert.strictEqual(
                window.location.search,
                "?filter_string=paper&sort=name:ascending"
            );

            jQuery(".filter-input").uxtextfield("value", { value: "initial" });
            jQuery(".filter-input").keyup();
            assert.strictEqual(queries[4].filterString, "initial");
            assert.strictEqual(window.location.search, "?sort=name:ascending");
        });
        it("should write the search cleared over the one of the existing input", () => {
            const jQuery = global.jQuery;

            for (const search of ["", "?filter_string="]) {
                results["/products.json"] = [[], false];
                global.dom.reconfigure({ url: "https://localhost/products" + search });
                jQuery("body").empty();
                jQuery("body").append(
                    '<ul class="filter" data-advanced="1">' +
                        '<input type="text" class="text-field filter-input" value="initial" />' +
                        '<div class="data-source" data-url="/products.json" data-type="json">' +
                        "</div>" +
                        "</ul>"
                );
                jQuery(".filter").uxfilter();
            }

            assert.strictEqual(queries[0].filterString, "initial");
            assert.strictEqual(queries[1].filterString, "");
            assert.strictEqual(jQuery(".filter-input").attr("data-value"), "");

            jQuery(".filter-input").uxtextfield("value", { value: "paper" });
            jQuery(".filter-input").keyup();
            assert.strictEqual(window.location.search, "?filter_string=paper");

            jQuery(".filter-input").uxtextfield("value", { value: "" });
            jQuery(".filter-input").keyup();
            assert.strictEqual(window.location.search, "?filter_string=");

            jQuery(".filter-input").uxtextfield("value", { value: "initial" });
            jQuery(".filter-input").keyup();
            assert.strictEqual(window.location.search, "");
        });
        it("should not replace the URL when the state is the same", () => {
            const jQuery = global.jQuery;
            const search = "?filter_string=paper&filters[]=name:like:a4&sort=name:ascending";
            let count = 0;

            build(jQuery, "https://localhost/products" + search);

            window.history.replaceState = () => count++;
            jQuery(".filter").triggerHandler("update");
            assert.strictEqual(queries.length, 2);
            assert.strictEqual(count, 0);
            assert.strictEqual(window.location.search, search);
        });
        it("should ignore the failures replacing the URL", () => {
            const jQuery = global.jQuery;

            build(jQuery, "https://localhost/products");

            window.history.replaceState = () => {
                throw new Error("The operation is insecure");
            };
            jQuery(".filter-sort-option[data-name='name']").click();
            assert.strictEqual(queries.length, 2);
            assert.deepStrictEqual(queries[1].sort, ["name", "ascending"]);
            assert.strictEqual(window.location.search, "");
        });
        it("should not write the state without the replace state support", () => {
            const jQuery = global.jQuery;

            results["/products.json"] = [[{ object_id: 1 }], false];
            build(jQuery, "https://localhost/products");

            window.history.replaceState = undefined;
            jQuery(".filter-sort-option[data-name='name']").click();
            jQuery(".filter-input-toggle-views").click();
            assert.strictEqual(queries.length, 2);
            assert.strictEqual(jQuery(".filter").hasClass("table-list"), true);
            assert.strictEqual(window.location.search, "");
        });
        it("should read back the state that is written", () => {
            const jQuery = global.jQuery;

            results["/brands.json"] = [[{ object_id: 12, name: "Seiko" }], false];
            results["/products.json"] = [[{ object_id: 1 }], false];
            build(
                jQuery,
                "https://localhost/products?filters[]=brand:equals:12" +
                    "&filters[]=create_date:in_day:1767225600"
            );

            jQuery(".filter-input").uxtextfield("value", { value: "paper & a4" });
            jQuery(".filter-input").keyup();
            jQuery(".filter-sort-option[data-name='create_date']").click();
            jQuery(".filter-input-toggle-views").click();
            jQuery(".filter-advanced-filter > .filter-input-add")
                .last()
                .click();
            jQuery(".filter-advanced-filter > .value-field")
                .last()
                .uxtextfield("value", { value: "50% #1: a=b" });

            const query = queries[queries.length - 1];
            const href = window.location.href;
            assert.strictEqual(
                window.location.search,
                "?filter_string=paper%20%26%20a4&filters[]=brand:equals:12" +
                    "&filters[]=create_date:in_day:1767225600" +
                    "&filters[]=name:like:50%25%20%231:%20a%3Db" +
                    "&sort=create_date:descending&view=table"
            );

            queries = [];
            build(jQuery, href);

            assert.strictEqual(window.location.href, href);
            assert.strictEqual(queries.length, 1);
            assert.deepStrictEqual(queries[0], Object.assign({}, query, { numberRecords: 14 }));
            assert.deepStrictEqual(lines(jQuery), [
                ["brand", "search", "Seiko"],
                ["create_date", "in", "2026/01/01"],
                ["name", "contains", "50% #1: a=b"]
            ]);
        });
    });
});

const build = (jQuery, url, attributes) => {
    global.dom.reconfigure({ url: url });
    jQuery("body").empty();
    jQuery("body").append(
        "<style>.filter-advanced { display: none; }</style>" +
            '<ul class="filter list-list" ' +
            (attributes === undefined ? 'data-advanced="1"' : attributes) +
            ">" +
            '<div class="data-source" data-url="/products.json" data-type="json">' +
            '<ul class="order">' +
            '<li data-name="name" data-order="ascending">name</li>' +
            '<li data-name="create_date">created</li>' +
            "</ul>" +
            '<ul class="filtering">' +
            '<li data-name="name" data-type="string">name</li>' +
            '<li data-name="stock" data-type="number">stock</li>' +
            '<li data-name="weight" data-type="float">weight</li>' +
            '<li data-name="create_date" data-type="date">created</li>' +
            '<li data-name="brand" data-type="reference" data-surl="/brands.json"' +
            ' data-stype="json" data-sdisplay_attribute="name"' +
            ' data-svalue_attribute="object_id">brand</li>' +
            "</ul>" +
            "</div>" +
            '<li class="template">' +
            '<div class="list-view"></div>' +
            '<div class="table-view"></div>' +
            '<div class="gallery-view"></div>' +
            "</li>" +
            '<div class="filter-more">more</div>' +
            "</ul>"
    );
    jQuery(".template").uxattr("class", "data-class");
    jQuery(".filter").uxfilter();
};

const lines = jQuery =>
    jQuery(".filter-advanced-filter")
        .toArray()
        .map(element => {
            const line = jQuery(element);
            const valueField = jQuery("> .value-field", line);
            const isDropField = valueField.hasClass("drop-field");
            return [
                line.data("name"),
                jQuery("> .operation-field", line).uxdropfield("value"),
                isDropField ? jQuery(".text-field", valueField).val() : valueField.val()
            ];
        });
