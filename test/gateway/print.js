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
        it("should keep the default printer of the node of the local storage", () => {
            const jQuery = global.jQuery;

            configure(jQuery, { node: "local-node" }, BODY_SETTINGS);
            const requests = print(jQuery);

            assert.deepStrictEqual(requests, [
                BINIE_REQUEST,
                {
                    type: "post",
                    url: "https://body.example.com/nodes/local-node/print",
                    data: { printer: "", data_b64: DATA_B64, skey: "body-key" },
                    headers: { "X-Secret-Key": "body-key" }
                }
            ]);
        });
        it("should use the printer of the local storage with the node of the body", () => {
            const jQuery = global.jQuery;

            configure(jQuery, { printer: "local-printer" }, BODY_SETTINGS);
            const requests = print(jQuery);

            assert.deepStrictEqual(requests, [
                BINIE_REQUEST,
                {
                    type: "post",
                    url: "https://body.example.com/nodes/body-node/printers/print",
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
        it("should print the labels with the label settings of the local storage", () => {
            const jQuery = global.jQuery;

            configure(jQuery, LOCAL_LABEL_SETTINGS, BODY_LABEL_SETTINGS);
            const requests = print(jQuery, LABEL);

            assert.deepStrictEqual(requests, [
                BINIE_REQUEST,
                {
                    type: "post",
                    url: "https://local.example.com/nodes/local-label-node/printers/print",
                    data: { printer: "local-label-printer", data_b64: DATA_B64, skey: "local-key" },
                    headers: { "X-Secret-Key": "local-key" }
                }
            ]);
        });
        it("should print the labels with the label settings of the body", () => {
            const jQuery = global.jQuery;

            configure(jQuery, {}, BODY_LABEL_SETTINGS);
            const requests = print(jQuery, LABEL);

            assert.deepStrictEqual(requests, [
                BINIE_REQUEST,
                {
                    type: "post",
                    url: "https://body.example.com/nodes/body-label-node/printers/print",
                    data: { printer: "body-label-printer", data_b64: DATA_B64, skey: "body-key" },
                    headers: { "X-Secret-Key": "body-key" }
                }
            ]);
        });
        it("should prefer the label settings of the body over the local storage ones", () => {
            const jQuery = global.jQuery;

            configure(jQuery, LOCAL_SETTINGS, BODY_LABEL_SETTINGS);
            const requests = print(jQuery, LABEL);

            assert.deepStrictEqual(requests, [
                BINIE_REQUEST,
                {
                    type: "post",
                    url: "https://local.example.com/nodes/body-label-node/printers/print",
                    data: { printer: "body-label-printer", data_b64: DATA_B64, skey: "local-key" },
                    headers: { "X-Secret-Key": "local-key" }
                }
            ]);
        });
        it("should use the label printer of the local storage with the node of it", () => {
            const jQuery = global.jQuery;

            configure(
                jQuery,
                {
                    node: "local-node",
                    printer: "local-printer",
                    labelPrinter: "local-label-printer"
                },
                BODY_SETTINGS
            );
            const requests = print(jQuery, LABEL);

            assert.deepStrictEqual(requests, [
                BINIE_REQUEST,
                {
                    type: "post",
                    url: "https://body.example.com/nodes/local-node/printers/print",
                    data: { printer: "local-label-printer", data_b64: DATA_B64, skey: "body-key" },
                    headers: { "X-Secret-Key": "body-key" }
                }
            ]);
        });
        it("should use the label printer of the body with the node of the body", () => {
            const jQuery = global.jQuery;

            configure(
                jQuery,
                {},
                {
                    url: "https://body.example.com/",
                    key: "body-key",
                    node: "body-node",
                    printer: "body-printer",
                    labelPrinter: "body-label-printer"
                }
            );
            const requests = print(jQuery, LABEL);

            assert.deepStrictEqual(requests, [
                BINIE_REQUEST,
                {
                    type: "post",
                    url: "https://body.example.com/nodes/body-node/printers/print",
                    data: { printer: "body-label-printer", data_b64: DATA_B64, skey: "body-key" },
                    headers: { "X-Secret-Key": "body-key" }
                }
            ]);
        });
        it("should not use the label printer of the body with the node of the local storage", () => {
            const jQuery = global.jQuery;

            configure(
                jQuery,
                { node: "local-node", printer: "local-printer" },
                {
                    url: "https://body.example.com/",
                    key: "body-key",
                    node: "body-node",
                    printer: "body-printer",
                    labelPrinter: "body-label-printer"
                }
            );
            const requests = print(jQuery, LABEL);

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
        it("should keep the default printer of the label node of the local storage", () => {
            const jQuery = global.jQuery;

            configure(
                jQuery,
                { printer: "local-printer", labelNode: "local-label-node" },
                BODY_LABEL_SETTINGS
            );
            const requests = print(jQuery, LABEL);

            assert.deepStrictEqual(requests, [
                BINIE_REQUEST,
                {
                    type: "post",
                    url: "https://body.example.com/nodes/local-label-node/print",
                    data: { printer: "", data_b64: DATA_B64, skey: "body-key" },
                    headers: { "X-Secret-Key": "body-key" }
                }
            ]);
        });
        it("should keep the default printer of the label node of the body", () => {
            const jQuery = global.jQuery;

            configure(
                jQuery,
                { printer: "local-printer" },
                {
                    url: "https://body.example.com/",
                    key: "body-key",
                    node: "body-node",
                    printer: "body-printer",
                    labelNode: "body-label-node"
                }
            );
            const requests = print(jQuery, LABEL);

            assert.deepStrictEqual(requests, [
                BINIE_REQUEST,
                {
                    type: "post",
                    url: "https://body.example.com/nodes/body-label-node/print",
                    data: { printer: "", data_b64: DATA_B64, skey: "body-key" },
                    headers: { "X-Secret-Key": "body-key" }
                }
            ]);
        });
        it("should not use the label settings for the other prints", () => {
            const jQuery = global.jQuery;

            configure(jQuery, LOCAL_LABEL_SETTINGS, BODY_LABEL_SETTINGS);
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
        it("should print the labels of the options with the label settings", () => {
            const jQuery = global.jQuery;

            configure(jQuery, {}, BODY_LABEL_SETTINGS);
            const requests = print(jQuery, "", { label: true });

            assert.deepStrictEqual(requests, [
                BINIE_REQUEST,
                {
                    type: "post",
                    url: "https://body.example.com/nodes/body-label-node/printers/print",
                    data: { printer: "body-label-printer", data_b64: DATA_B64, skey: "body-key" },
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
    printer: "uxf:gateway:printer:id",
    labelNode: "uxf:gateway:label:node:id",
    labelPrinter: "uxf:gateway:label:printer:id"
};

const BODY_KEYS = {
    url: "colony_print_url",
    key: "colony_print_key",
    node: "colony_print_node",
    printer: "colony_print_printer",
    labelNode: "colony_print_label_node",
    labelPrinter: "colony_print_label_printer"
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

const LOCAL_LABEL_SETTINGS = {
    url: "https://local.example.com/",
    key: "local-key",
    node: "local-node",
    printer: "local-printer",
    labelNode: "local-label-node",
    labelPrinter: "local-label-printer"
};

const BODY_LABEL_SETTINGS = {
    url: "https://body.example.com/",
    key: "body-key",
    node: "body-node",
    printer: "body-printer",
    labelNode: "body-label-node",
    labelPrinter: "body-label-printer"
};

const LABEL = ' data-label="1"';

const configure = (jQuery, local, body) => {
    localStorage.clear();
    for (const name in local) localStorage.setItem(LOCAL_KEYS[name], local[name]);
    for (const name in BODY_KEYS) {
        if (body) jQuery("body").data(BODY_KEYS[name], body[name] || "");
        else jQuery("body").removeData(BODY_KEYS[name]);
    }
};

const print = (jQuery, attributes, options) => {
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
        jQuery("body").append(
            '<a class="print" data-binie="/label.binie"' + (attributes || "") + "></a>"
        );
        jQuery(".print").uxgprint("default", options);
        jQuery(".print").click();
    } finally {
        jQuery.ajax = ajax;
    }
    return requests;
};
