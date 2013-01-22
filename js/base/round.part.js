(function($) {
    jQuery.uxround = function(value, decimalPlaces) {
        // rounds the specified value to the
        // specified number of decimal places
        var rounder = Math.pow(10, decimalPlaces);
        return Math.round(value * rounder) / rounder;
    };
})(jQuery);
