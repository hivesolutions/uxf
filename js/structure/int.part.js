(function($) {
    jQuery.fn.uxfint = function() {
        // sets the jquery matched object
        var matchedObject = this;

        // retrieves the string representation value
        // from the matched object as uses it to convert
        // it into a integer value and verifies the conversion,
        // in case it failed default to a zero value
        var value = matchedObject.uxvalue();
        var valueI = parseInt(value);
        valueI = isNaN(valueI) ? 0 : valueF;

        // returns the value that was retrieved and converted
        // into a integer value
        return valueI;
    }
})(jQuery);
