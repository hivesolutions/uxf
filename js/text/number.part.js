(function(jQuery) {
    jQuery.fn.uxnumber = function(options) {
        // the default values for the name change
        var defaults = {};

        // sets the default options value
        var options = options ? options : {};

        // constructs the options
        var options = jQuery.extend(defaults, options);

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
            // iterates over all the matched objects
            matchedObject.each(function(index, element) {
                // retrieves the element reference
                var _element = jQuery(element);

                // retrieves the various attributes of
                // the element
                var places = _element.attr("data-places");
                var separator = _element.attr("data-separator");
                var magnitudeSeparator = _element.attr("data-magnitude_separator");

                // retrieves the (element) value
                var value = _element.text();

                // "calculates" the number of (decimal) places
                // in case none is provided zero decimal places
                // are used
                var placesInteger = parseInt(places);
                placesInteger = isNaN(placesInteger) ? 0 : placesInteger;

                // parses the value as a float value, and then
                // converts it back to float string using the
                // defined number of decimal places
                var valueFloat = parseFloat(value);
                var valueString = valueFloat.toFixed(placesInteger);

                // in case the "parsed" float value is not valid must
                // set the element as processed to display it and return
                // immediately (avoids dead lock in visual value)
                var invalid = isNaN(valueFloat);
                if (invalid) {
                    _element.addClass("processed");
                    return;
                }

                // retrieves the value string replacing the decimal
                // separator in case one was defined
                valueString = separator
                        ? valueString.replace(".", separator)
                        : valueString;

                // in case the magnitude separator is defined
                // there's a necessecity to process it by spliting
                // the value string into integer and decimal part
                if (magnitudeSeparator) {
                    // retrieves the value for the separator
                    separator = separator ? separator : ".";

                    // splits the value string and then retrives
                    // the integer part of the value
                    var valueStringSplit = valueString.split(separator);
                    var integerPart = valueStringSplit[0];

                    // in case the value string split contains
                    // at least two elements (decimal part exists)
                    if (valueStringSplit.length > 1) {
                        // retrieves the decimal part from the
                        // value string split
                        var decimalPart = valueStringSplit[1];
                    }
                    // otherwise no decimal part exists
                    else {
                        // unsets the decimal part
                        var decimalPart = null;
                    }

                    // retrieves the initial index value, using
                    // the modulus of the inter part length
                    // or three the division jump
                    var initialIndex = integerPart.length % 3
                            ? integerPart.length % 3
                            : 3;

                    // retrieves the initial integer part for
                    // magnitute
                    var _integerPart = integerPart.slice(0, initialIndex);

                    // iterates over the rest of the integer part to separate
                    // it using the magnitude separator
                    for (var index = initialIndex; index < integerPart.length; index += 3) {
                        // adds the magnitude separator and current slice of the integer part
                        // to the current re-calculated integer part
                        _integerPart += magnitudeSeparator
                                + integerPart.slice(index, index + 3);
                    }

                    // sets the integer part as the recently calculated
                    // integer part
                    integerPart = _integerPart;

                    // re-calculates the value string takning into account if
                    // there is a decimal part to the number in case it exists
                    // it concatenates the integer and the decimal part using the separator
                    // otherwise only the integer part is used in the value string
                    valueString = decimalPart ? integerPart + separator
                            + decimalPart : integerPart;
                }

                // sets the new value string in the element and
                // adds the processed class to it, note that only
                // the text part of the element is changed
                _element.uxcontent(valueString);
                _element.addClass("processed");
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
