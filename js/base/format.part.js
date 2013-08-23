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
            "July", "August", "September", "October", "November", "December"];
    var ABBREVIATED_MONTHS = ["JanS", "FebS", "MarS", "AprS", "MayS", "JunS",
            "JulS", "AugS", "SepS", "OctS", "NovS", "DecS"];

    jQuery.uxformat = function(date, format, utc) {
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
            var dateString = year + "-" + _getStringValue(month, 2) + "-"
                    + _getStringValue(day, 2) + " " + _getStringValue(hours, 2)
                    + ":" + _getStringValue(minutes, 2) + ":"
                    + _getStringValue(seconds, 2)
        }

        // returns the processed date string to the caller method
        // so that it may be used for external operations
        return dateString;
    };
})(jQuery);
