const assert = require("assert");
require("../../js");

global.document = global.document || global.dom.window.document;
global.window = global.window || global.dom.window;

global.dom.reconfigure({ url: "https://localhost/" });
global.localStorage = global.localStorage || global.window.localStorage;

describe("UxLogger", function() {
    describe("#basic", function() {
        it("should be defined", () => {
            const jQuery = global.jQuery;
            assert.notStrictEqual(jQuery.uxlogger, undefined);
        });
        it("should name the logger after the plugin", () => {
            const jQuery = global.jQuery;

            const logger = jQuery.uxlogger("uxtest");

            assert.strictEqual(logger.loggerName, "uxtest");
            assert.strictEqual(jQuery.uxlogger("uxtest"), logger);
        });
    });

    describe("#level", function() {
        afterEach(() => {
            const jQuery = global.jQuery;
            configure(jQuery, null, null);
        });

        it("should use the level of the local storage", () => {
            const jQuery = global.jQuery;
            const Logging = global.Logging;

            configure(jQuery, "INFO", "error");
            const logger = jQuery.uxlogger("uxtest");

            assert.strictEqual(logger.getEffectiveLevel(), Logging.constants.INFO);
        });
        it("should ignore the local storage when it is not accessible", () => {
            const jQuery = global.jQuery;
            const Logging = global.Logging;
            const window = global.window;

            configure(jQuery, "info", "error");
            global.window = {
                get localStorage() {
                    throw new Error("The operation is insecure");
                }
            };
            let logger = null;
            try {
                logger = jQuery.uxlogger("uxtest");
            } finally {
                global.window = window;
            }

            assert.strictEqual(logger.getEffectiveLevel(), Logging.constants.ERROR);
        });
        it("should use the level of the body", () => {
            const jQuery = global.jQuery;
            const Logging = global.Logging;

            configure(jQuery, null, null);
            jQuery("body").attr("data-log_level", "debug");
            let logger = null;
            try {
                logger = jQuery.uxlogger("uxtest");
            } finally {
                jQuery("body").removeAttr("data-log_level").removeData("log_level");
            }

            assert.strictEqual(logger.getEffectiveLevel(), Logging.constants.DEBUG);
        });
        it("should default to the warning level", () => {
            const jQuery = global.jQuery;
            const Logging = global.Logging;

            configure(jQuery, null, null);
            const logger = jQuery.uxlogger("uxtest");

            assert.strictEqual(logger.getEffectiveLevel(), Logging.constants.WARNING);
            assert.strictEqual(logger.isEnabledFor(Logging.constants.INFO), false);
        });
        it("should use the warning level for the invalid levels", () => {
            const jQuery = global.jQuery;
            const Logging = global.Logging;

            for (const level of ["verbose", "10", "level"]) {
                configure(jQuery, level, "debug");
                const logger = jQuery.uxlogger("uxtest");
                assert.strictEqual(logger.getEffectiveLevel(), Logging.constants.WARNING);
            }
        });
        it("should accept the not set level", () => {
            const jQuery = global.jQuery;
            const Logging = global.Logging;

            configure(jQuery, null, "notset");
            const logger = jQuery.uxlogger("uxtest");

            assert.strictEqual(logger.getEffectiveLevel(), Logging.constants.NOTSET);
        });
        it("should update the level of an existing logger", () => {
            const jQuery = global.jQuery;
            const Logging = global.Logging;

            configure(jQuery, null, "debug");
            const logger = jQuery.uxlogger("uxtest");
            assert.strictEqual(logger.getEffectiveLevel(), Logging.constants.DEBUG);

            configure(jQuery, null, "error");
            assert.strictEqual(jQuery.uxlogger("uxtest"), logger);
            assert.strictEqual(logger.getEffectiveLevel(), Logging.constants.ERROR);
        });
    });

    describe("#format", function() {
        it("should format the records with the name of the plugin", () => {
            const jQuery = global.jQuery;
            const Logging = global.Logging;

            const message = fresh(() => {
                jQuery.uxlogger("uxtest");
                const handlers = Logging.getLogger().handlers;
                assert.strictEqual(handlers.length, 1);
                assert.strictEqual(handlers[0] instanceof Logging.StreamHandler, true);
                const record = new Logging.Record("Message", Logging.constants.WARNING, "uxtest");
                return handlers[0].format(record);
            });

            const pattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d{3} \[WARNING\] \[uxtest\] Message$/;
            assert.strictEqual(pattern.test(message), true);
        });
        it("should keep the format of an existing default logger", () => {
            const jQuery = global.jQuery;
            const Logging = global.Logging;

            fresh(() => {
                const handler = Logging.getLogger().handlers[0];
                const formatter = handler.formatter;
                jQuery.uxlogger("uxtest");
                assert.strictEqual(handler.formatter, formatter);
                assert.strictEqual(formatter.formatString, "{asctime} [{level}] {message}");
            });
        });
    });

    describe("#propagation", function() {
        it("should propagate the records to the default logger", () => {
            const jQuery = global.jQuery;

            configure(jQuery, null, null);
            const logger = jQuery.uxlogger("uxtest");
            const records = capture(() => {
                logger.info("Hidden message");
                logger.warn("Message:", "value", { key: "value" });
                logger.error("Error message");
            });

            assert.deepStrictEqual(records, [
                ["WARNING", "uxtest", "Message:", ["value", { key: "value" }]],
                ["ERROR", "uxtest", "Error message", []]
            ]);
        });
        it("should only handle the records in the default logger", () => {
            const jQuery = global.jQuery;

            const logger = jQuery.uxlogger("uxtest");

            assert.deepStrictEqual(logger.handlers, []);
            assert.strictEqual(logger.propagate, true);
        });
    });
});

const configure = (jQuery, local, body) => {
    localStorage.removeItem("uxf:log:level");
    if (local) localStorage.setItem("uxf:log:level", local);
    if (body) jQuery("body").data("log_level", body);
    else jQuery("body").removeData("log_level");
};

const fresh = callable => {
    const Logging = global.Logging;
    const name = Logging.constants.DEFAULT_LOGGER_NAME;
    const root = Logging.loggers[name];
    delete Logging.loggers[name];
    try {
        return callable();
    } finally {
        if (root) Logging.loggers[name] = root;
        else delete Logging.loggers[name];
    }
};

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
