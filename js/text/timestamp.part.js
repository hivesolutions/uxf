if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

(function(jQuery) {
    jQuery.fn.uxtimestamp = function(method, options) {
        // the various regex values for the time
        // date format part replacement
        var YEAR_CHARACTER = new RegExp("%Y", "g");
        var MONTH_CHARACTER = new RegExp("%m", "g");
        var DAY_CHARACTER = new RegExp("%d", "g");
        var HOUR_CHARACTER = new RegExp("%H", "g");
        var MINUTE_CHARACTER = new RegExp("%M", "g");
        var SECOND_CHARACTER = new RegExp("%S", "g");
        var FULL_MONTH_CHARACTER = new RegExp("%B", "g");
        var ABBREVIATED_MONTH_CHARACTER = new RegExp("%b", "g");

        // the lists for the month string values
        var FULL_MONTHS = ["January", "February", "March", "April", "May",
            "June", "July", "August", "September", "October", "November",
            "December"
        ];
        var ABBREVIATED_MONTHS = ["JanS", "FebS", "MarS", "AprS", "MayS",
            "JunS", "JulS", "AugS", "SepS", "OctS", "NovS", "DecS"
        ];

        // the default values for the timestamp
        var defaults = {};

        // sets the default method value
        method = method || "default";

        // sets the default options value
        options = options || {};

        // constructs the options
        options = jQuery.extend(defaults, options);

        // sets the jquery matched object
        var matchedObject = this;

        /**
         * Initializer of the plugin, runs the necessary functions to initialize
         * the structures.
         */
        var initialize = function() {
            _appendHtml();
            _registerHandlers();
        };

        /**
         * Creates the necessary html for the component.
         */
        var _appendHtml = function() {
            // iterates over all the matched object
            // elements to update the timestamp value
            matchedObject.each(function(index, element) {
                // retrieves the element reference and verifies
                // if it has already been processed if that's the case
                // returns immediately as there's nothing to be done
                // but only in case the force flag is not set in options
                var _element = jQuery(element);
                var isProcessed = _element.hasClass("processed");
                if (isProcessed && !options.force) {
                    return;
                }

                // retrieves the current timestamp string
                // value from the element and converts
                // it into an integer
                var timestampString = _element.text();
                var timestamp = parseInt(timestampString);

                // in case the timestamp could not be parsed
                // (the timestamp is not a number)
                if (isNaN(timestamp)) {
                    // adds the processed class to show the value
                    // even for the default value (fallback) and
                    // returns the control flow to the caller function
                    _element.addClass("processed");
                    return;
                }

                // retrieves the format from the element and if the
                // the provided timestamp value is defined in utc
                var format = _element.attr("data-format");
                var utc = _element.attr("data-utc");

                // converts the timestamp into a date object
                var date = new Date(timestamp * 1000);

                // processes the provided date string according
                // to the given format string as requested by user
                var dateString = _processDate(date, format, utc);

                // sets the "new" formated date value in the element and
                // adds the processed class to it
                _element.html(dateString);
                _element.addClass("processed");
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {};

        var _processDate = function(date, format, utc) {
            // starts the date string value to be populated by the condition
            // in the current function
            var dateString = null;

            // retrieves the various components of the date
            var year = utc ? date.getUTCFullYear() : date.getFullYear();
            var month = utc ? date.getUTCMonth() + 1 : date.getMonth() + 1;
            var day = utc ? date.getUTCDate() : date.getDate();
            var hours = utc ? date.getUTCHours() : date.getHours();
            var minutes = utc ? date.getUTCMinutes() : date.getMinutes();
            var seconds = utc ? date.getUTCSeconds() : date.getSeconds();

            // retrieves the full and abbreviated month values and then
            // localizes them into the proper locale representation
            var fullMonth = FULL_MONTHS[month - 1];
            var abbreviatedMonth = ABBREVIATED_MONTHS[month - 1];
            fullMonth = jQuery.uxlocale(fullMonth);
            abbreviatedMonth = jQuery.uxlocale(abbreviatedMonth);

            // in case the format is defined, the date is
            // meant to be formatted
            if (format) {
                // replaces all the format values wit the proper
                // date values in the format string
                format = format.replace(YEAR_CHARACTER, year);
                format = format.replace(MONTH_CHARACTER, _getStringValue(month,
                    2));
                format = format.replace(DAY_CHARACTER, _getStringValue(day, 2));
                format = format.replace(HOUR_CHARACTER, _getStringValue(hours,
                    2));
                format = format.replace(MINUTE_CHARACTER, _getStringValue(
                    minutes, 2));
                format = format.replace(SECOND_CHARACTER, _getStringValue(
                    seconds, 2));
                format = format.replace(FULL_MONTH_CHARACTER, fullMonth);
                format = format.replace(ABBREVIATED_MONTH_CHARACTER,
                    abbreviatedMonth);

                // sets the date string as the final format
                dateString = format;
            }
            // otherwise the default date format is to be used
            else {
                // creates the date string with the default
                // (complete) format
                dateString = year;
                dateString += "-" + _getStringValue(month, 2);
                dateString += "-" + _getStringValue(day, 2);
                dateString += " " + _getStringValue(hours, 2);
                dateString += ":" + _getStringValue(minutes, 2);
                dateString += ":" + _getStringValue(seconds, 2);
            }

            // returns the processed date string
            return dateString;
        };

        /**
         * Converts the given value to a string and appends the padding
         * character for the length remaining according to the "target" value
         * length.
         *
         * @param {String}
         *            value The value to be converted to string and appended
         *            with the padding characters.
         * @param {Integer}
         *            valueLength The "target" value length to be set in the
         *            retrieved string.
         * @param {String}
         *            padding The padding character to be used when setting the
         *            target size in the string.
         * @return {String} The string resulting from the conversion of the
         *         given value.
         */
        var _getStringValue = function(value, valueLength, padding) {
            // retrieves the padding value
            padding = padding || "0";

            // converts the value to a string and retrives
            // the length of it
            var stringValue = String(value);
            var stringValueLength = stringValue.length;

            // iterates over the range of the remaining string value
            for (var index = stringValueLength; index < valueLength; index++) {
                // adds the padding (character) to the string value
                stringValue = padding + stringValue;
            }

            // returns the string value
            return stringValue;
        };

        // switches over the method
        switch (method) {
            case "format":
                // retrieve both the date, the format and the utc from the map
                // of provided options, to be sent to the process date
                // function for processing
                var date = options["date"];
                var format = options["format"];
                var utc = options["utc"];

                // processes (formats the date) and returns it
                return _processDate(date, format, utc);

            case "default":
                // initializes the plugin
                initialize();

                // breaks the switch
                break;
        }

        // returns the object
        return this;
    };
})(jQuery);
