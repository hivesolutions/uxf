(function($) {
    jQuery.fn.uxfocus = function(options) {
        // the default values for the next
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
            // iterates over each of the matched
            // objects to focus on them
            matchedObject.each(function(index, element) {
                        // retrieves the element reference
                        var _element = jQuery(element);

                        // focus on the element
                        _element.focus();

                        // retrieves the (data) value from the element (from
                        // data value) and then retrieves the length from it
                        // and then uses it to set the cursor position
                        // on the element (moves the cursor)
                        var dataValue = _element.attr("data-value");
                        var dataValueLength = dataValue.length;
                        _element.uxcursor(dataValueLength);
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
