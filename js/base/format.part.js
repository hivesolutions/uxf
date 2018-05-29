(function(jQuery) {
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

    // the lists for the month string values both in full
    // name mode and in abreviated mode
    var FULL_MONTHS = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    var ABBREVIATED_MONTHS = ["JanS", "FebS", "MarS", "AprS", "MayS", "JunS",
        "JulS", "AugS", "SepS", "OctS", "NovS", "DecS"
    ];

    jQuery.uxformat = function(date, format, utc) {
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

        // verifies if the provided object is of type date in case
        // it's not must create a date object that represent it
        var isDate = date.getDate !== undefined;
        if (!isDate) {
            var year = date["year"];
            var month = date["month"] || 1;
            var day = date["day"] || 1;
            var hours = date["hours"] || 0;
            var minutes = date["minutes"] || 0;
            var seconds = date["seconds"] || 0;
            date = new Date(year, month - 1, day, hours, minutes, seconds);
        }

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
            format = format.replace(MONTH_CHARACTER, _getStringValue(month, 2));
            format = format.replace(DAY_CHARACTER, _getStringValue(day, 2));
            format = format.replace(HOUR_CHARACTER, _getStringValue(hours, 2));
            format = format.replace(MINUTE_CHARACTER, _getStringValue(minutes,
                2));
            format = format.replace(SECOND_CHARACTER, _getStringValue(seconds,
                2));
            format = format.replace(FULL_MONTH_CHARACTER, fullMonth);
            format = format.replace(ABBREVIATED_MONTH_CHARACTER,
                abbreviatedMonth);

            // sets the date string as the final format
            var dateString = format;
        }
        // otherwise the default date format is to be used, this is defined
        // in accordance with the iso standards
        else {
            // creates the date string with the default
            // (complete) format in accordance with standard
            var dateString = year + "-" + _getStringValue(month, 2) + "-" + _getStringValue(day, 2) + " " +
                _getStringValue(hours, 2) + ":" + _getStringValue(minutes, 2) + ":" + _getStringValue(seconds,
                    2)
        }

        // returns the processed date string to the caller method
        // so that it may be used for external operations
        return dateString;
    };
})(jQuery);
