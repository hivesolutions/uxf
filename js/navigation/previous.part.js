(function(jQuery) {
    jQuery.fn.uxprevious = function(options) {
        // the default values for the previous
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
            // retrieves the previous url element from the
            // matched object and then retrieves the (textual) value
            var previousUrl = jQuery(".previous-url", matchedObject);
            var previousUrlValue = previousUrl.text();

            // trims the previous url value
            previousUrlValue = previousUrlValue.trim();

            // in case the previous url value is not valid
            if (!previousUrlValue) {
                // returns immediately
                // (no url change)
                return;
            }

            // sets the new location in the document (redirect)
            document.location = previousUrlValue;
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
