if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
    var Logging = require("hive-js-util").Logging;
}

(function(jQuery) {
    /**
     * The format of the messages logged by the plugins, with the time,
     * the level and the name of the plugin that logged them.
     */
    var FORMAT = "{asctime} [{level}] [{name}] {message}";

    /**
     * Retrieves the logger of the plugin with the given name, with the
     * level defined for the current browser (local storage) or for the
     * application (body), defaulting to the warning level.
     *
     * @param {String}
     *            name The name of the plugin to retrieve the logger for.
     * @return {Logger} The logger of the plugin, that propagates its
     *         records to the default logger (that prints them).
     */
    jQuery.uxlogger = function(name) {
        var _body = jQuery("body");

        // tries to retrieve the level defined in the local storage, that
        // takes precedence over the one of the body (eg: debug of a single
        // client), ignoring the local storage in case it's not accessible
        var level = null;
        try {
            level = window.localStorage && window.localStorage.getItem("uxf:log:level");
        } catch (exception) {
            level = null;
        }

        // falls back to the level defined in the body (by the application)
        // and then to the warning one, converting the name of the level into
        // its value, using the warning level in case the name is not valid
        level = level || _body.data("log_level") || "warning";
        level = Logging.LevelsMap[String(level).toUpperCase()];
        level = typeof level === "number" ? level : Logging.constants.WARNING;

        // retrieves the default logger, that prints the records of the
        // loggers of the plugins, and in case it's created by this call
        // sets the format of the plugins (with their names) in it
        var exists = Boolean(Logging.loggers[Logging.constants.DEFAULT_LOGGER_NAME]);
        var root = Logging.getLogger();
        !exists && root.setFormatter(new Logging.SimpleFormatter(FORMAT));

        // retrieves the logger of the plugin, with no handlers as its
        // records are propagated to the default logger, updates its
        // level and returns it to the caller
        var logger = Logging.getLogger(name, {
            propagate: true
        });
        logger.setLevel(level);
        return logger;
    };
})(jQuery);
