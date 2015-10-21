(function(jQuery) {
    jQuery.uxround = function(value, decimalPlaces, noDecimal) {
        // verifies if the no decimal flag has been set and
        // in case it was not set creates a new (precise) decimal
        // value from the provided value so that a better rounding
        // operation is possible (according to proper math)
        value = noDecimal ? value : jQuery.uxdecimal(value);

        // rounds the specified value to the
        // specified number of decimal places
        var rounder = Math.pow(10, decimalPlaces);
        return Math.round(value * rounder) / rounder;
    };
})(jQuery);
