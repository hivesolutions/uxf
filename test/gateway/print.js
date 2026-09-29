const assert = require("assert");
require("../../js");

global.document = global.document || global.dom.window.document;
global.window = global.window || global.dom.window;

global.dom.reconfigure({ url: "https://localhost/" });
global.localStorage = global.localStorage || global.window.localStorage;

describe("UxGPrint", function() {
    describe("#basic", function() {
        it("should be defined", () => {
            const jQuery = global.jQuery;
            assert.notStrictEqual(jQuery.fn.uxgprint, undefined);
        });
        it("should print with the settings of the local storage", () => {
            const jQuery = global.jQuery;

            configure(jQuery, LOCAL_SETTINGS, BODY_SETTINGS);
            const requests = print(jQuery);

            assert.deepStrictEqual(requests, [
                BINIE_REQUEST,
                {
                    type: "post",
                    url: "https://local.example.com/nodes/local-node/printers/print",
                    data: { printer: "local-printer", data_b64: DATA_B64, skey: "local-key" },
                    headers: { "X-Secret-Key": "local-key" }
                }
            ]);
        });
        it("should print with the settings of the body", () => {
            const jQuery = global.jQuery;

            configure(jQuery, {}, BODY_SETTINGS);
            const requests = print(jQuery);

            assert.deepStrictEqual(requests, [
                BINIE_REQUEST,
                {
                    type: "post",
                    url: "https://body.example.com/nodes/body-node/printers/print",
                    data: { printer: "body-printer", data_b64: DATA_B64, skey: "body-key" },
                    headers: { "X-Secret-Key": "body-key" }
                }
            ]);
        });
        it("should prefer each setting of the local storage over the body one", () => {
            const jQuery = global.jQuery;

            configure(
                jQuery,
                { url: "", key: "", node: "local-node", printer: "local-printer" },
                BODY_SETTINGS
            );
            const requests = print(jQuery);

            assert.deepStrictEqual(requests, [
                BINIE_REQUEST,
                {
                    type: "post",
                    url: "https://body.example.com/nodes/local-node/printers/print",
                    data: { printer: "local-printer", data_b64: DATA_B64, skey: "body-key" },
                    headers: { "X-Secret-Key": "body-key" }
                }
            ]);
        });
        it("should print with the default printer of the node", () => {
            const jQuery = global.jQuery;

            configure(
                jQuery,
                {},
                { url: "https://body.example.com/", key: "body-key", node: "body-node" }
            );
            const requests = print(jQuery);

            assert.deepStrictEqual(requests, [
                BINIE_REQUEST,
                {
                    type: "post",
                    url: "https://body.example.com/nodes/body-node/print",
                    data: { printer: "", data_b64: DATA_B64, skey: "body-key" },
                    headers: { "X-Secret-Key": "body-key" }
                }
            ]);
        });
        it("should not print without the complete settings", () => {
            const jQuery = global.jQuery;

            configure(jQuery, { url: "https://local.example.com/", key: "local-key" }, {});
            const requests = print(jQuery);

            assert.deepStrictEqual(requests, []);
        });
        it("should not print without any settings", () => {
            const jQuery = global.jQuery;

            configure(jQuery, {}, null);
            const requests = print(jQuery);

            assert.deepStrictEqual(requests, []);
        });
    });
});

const DATA_B64 = "SGVsbG8gV29ybGQ=";

const BINIE_REQUEST = {
    type: "get",
    url: "/label.binie",
    data: { base_64: 1, format: "binie" },
    headers: {}
};

const LOCAL_KEYS = {
    url: "uxf:gateway:base_url",
    key: "uxf:gateway:key",
    node: "uxf:gateway:node:id",
    printer: "uxf:gateway:printer:id"
};

const BODY_KEYS = {
    url: "colony_print_url",
    key: "colony_print_key",
    node: "colony_print_node",
    printer: "colony_print_printer"
};

const LOCAL_SETTINGS = {
    url: "https://local.example.com/",
    key: "local-key",
    node: "local-node",
    printer: "local-printer"
};

const BODY_SETTINGS = {
    url: "https://body.example.com/",
    key: "body-key",
    node: "body-node",
    printer: "body-printer"
};

const configure = (jQuery, local, body) => {
    localStorage.clear();
    for (const name in local) localStorage.setItem(LOCAL_KEYS[name], local[name]);
    for (const name in BODY_KEYS) {
        if (body) jQuery("body").data(BODY_KEYS[name], body[name] || "");
        else jQuery("body").removeData(BODY_KEYS[name]);
    }
};

const print = jQuery => {
    const requests = [];
    const ajax = jQuery.ajax;
    jQuery.ajax = options => {
        const headers = {};
        const xhr = { setRequestHeader: (name, value) => (headers[name] = value) };
        if (options.beforeSend) options.beforeSend(xhr);
        requests.push({
            type: options.type || "get",
            url: options.url,
            data: options.data,
            headers: headers
        });
        if (options.success) options.success(DATA_B64);
        if (options.complete) options.complete();
    };
    try {
        jQuery("body").empty();
        jQuery("body").append('<a class="print" data-binie="/label.binie"></a>');
        jQuery(".print").uxgprint();
        jQuery(".print").click();
    } finally {
        jQuery.ajax = ajax;
    }
    return requests;
};
