if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

(function(jQuery) {
    jQuery.fn.uxenumeration = function(options) {
        // the regex for string character regex,
        // for string replacement
        var STRING_CHARACTER_REGEX = new RegExp("'", "g");

        // the default values for the name change
        var defaults = {};

        // sets the default options value
        options = options || {};

        // constructs the options
        options = jQuery.extend(defaults, options);

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

                // retrieves the enum attribute, for latter
                // JSON parsing
                var _enum = _element.attr("data-enum");

                // replaces the string character in the error
                // message list and then parses it as JSON
                _enum = _enum.replace(STRING_CHARACTER_REGEX, '"');
                var enumList = jQuery.parseJSON(_enum);

                // retrieves the (element) value
                var value = _element.text();

                // "calculates" the number of (decimal) places
                // in case none is provided zero decimal places
                // are used
                var valueInteger = parseInt(value);
                valueInteger = isNaN(valueInteger) ? 1 : valueInteger;

                // retrieves the enum value from the enum
                // and then converts it into a string
                var enumValue = enumList[valueInteger - 1];
                var enumValueString = String(enumValue);

                // sets the enum value string in the element and
                // adds the processed class to it
                _element.html(enumValueString);
                _element.addClass("processed");
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {};

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
