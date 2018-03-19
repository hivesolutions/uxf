(function(jQuery) {
    jQuery.fn.uxnext = function(options) {
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
            // retrieves the next URL element from the
            // matched object and then retrieves the (textual) value
            var nextUrl = jQuery(".next-url", matchedObject);
            var nextUrlValue = nextUrl.text();

            // trims the next URL value
            nextUrlValue = nextUrlValue.trim();

            // in case the next URL value is not valid
            if (!nextUrlValue) {
                // returns immediately
                // (no URL change)
                return;
            }

            // sets the new location in the document (redirect)
            jQuery.uxlocation(nextUrlValue);
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
