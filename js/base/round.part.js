(function(jQuery) {
    /**
     * The amount of precision (in decimal places) that is going to be used for
     * the round opertion internal usage (delta calculus).
     */
    var FLOAT_PRECISION = 14;

    /**
     * The small delta value that is going to be added to the value in order to
     * avoid round up issues.
     */
    var DELTA = Math.pow(10, FLOAT_PRECISION * -1);

    jQuery.uxdelta = function(value) {
        var integer = Math.abs(parseInt(value / 1));
        var count = integer == 0 ? 1 : parseInt(Math.log10(integer)) + 1;
        var places = FLOAT_PRECISION - count;
        places = places < 1 ? places = 1 : places;
        var delta = 1 / Math.pow(10, places)
        return delta
    };

    jQuery.uxround = function(value, decimalPlaces, noDecimal, nodelta, noSafe) {
        // calculates the proper delta value to be used for the
        // roudning calculus taking into account the safe flag
        var delta = noSafe ? DELTA : jQuery.uxdelta(value);

        // verifies if the no decimal flag has been set and
        // in case it was not set creates a new (precise) decimal
        // value from the provided value so that a better rounding
        // operation is possible (according to proper math)
        value = noDecimal ? value : jQuery.uxdecimal(value);

        // verifies if the extra delta value should be added, in
        // order to avoid any problems with round up, and if that's
        // the case adds the "small" delta value to the value
        value = nodelta ? value : value + delta;

        // rounds the specified value to the
        // specified number of decimal places
        var rounder = Math.pow(10, decimalPlaces);
        return Math.round(value * rounder) / rounder;
    };
})(jQuery);
