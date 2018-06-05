if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

(function(jQuery) {
    /**
     * The amount of precision (in decimal places) that is going to be used for
     * the decimal internal usage.
     */
    var FLOAT_PRECISION = 14;

    jQuery.uxdecimal = function(value) {
        var integer = Math.abs(parseInt(value));
        var count = integer === 0 ? 1 : parseInt(Math.log10(integer)) + 1;
        var places = FLOAT_PRECISION - count;
        var multiplier = Math.pow(10, places);
        value = Math.round(value * multiplier) / multiplier;
        return value;
    };
})(jQuery);
