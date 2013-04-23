(function(jQuery) {
    jQuery.fn.uxfloat = function() {
        // sets the jquery matched object
        var matchedObject = this;

        // retrieves the string representation value
        // from the matched object as uses it to convert
        // it into a float value and verifies the conversion,
        // in case it failed default to a zero value
        var value = matchedObject.uxvalue();
        var valueF = parseFloat(value);
        valueF = isNaN(valueF) ? 0.0 : valueF;

        // returns the value that was retrieved and converted
        // into a float value
        return valueF;
    };
})(jQuery);
