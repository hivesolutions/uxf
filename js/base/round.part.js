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

    jQuery.uxround = function(value, decimalPlaces, noDecimal, nodelta) {
        // verifies if the no decimal flag has been set and
        // in case it was not set creates a new (precise) decimal
        // value from the provided value so that a better rounding
        // operation is possible (according to proper math)
        value = noDecimal ? value : jQuery.uxdecimal(value);

        // verifies if the extra delta value should be added, in
        // order to avoid any problems with round up, and if that's
        // the case adds the "small" delta value to the value
        value = nodelta ? value : value + DELTA;

        // rounds the specified value to the
        // specified number of decimal places
        var rounder = Math.pow(10, decimalPlaces);
        return Math.round(value * rounder) / rounder;
    };
})(jQuery);
