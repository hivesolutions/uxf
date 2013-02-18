(function(jQuery) {
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
            // in case the matched object is not defined
            // or in case it's an empty list must return
            // immediatly initialization is not meant to
            // be run (corruption may occur)
            if (!matchedObject || matchedObject.length == 0) {
                return;
            }

            // retrieves the complete set of currently focused
            // elements and blurs them so that none remain
            // focused, this operation is required otherwise any
            // blur operation in the element would be ignored
            var focused = jQuery(":focus");
            focused.blur();

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
                        var dataValueLength = dataValue ? dataValue.length : 0;
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
