if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

(function(jQuery) {
    jQuery.fn.uxprevious = function(options) {
        // the default values for the previous
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
         * Creates the necessary HTML for the component.
         */
        var _appendHtml = function() {
            // retrieves the previous URL element from the
            // matched object and then retrieves the (textual) value
            var previousUrl = jQuery(".previous-url", matchedObject);
            var previousUrlValue = previousUrl.text();

            // trims the previous URL value
            previousUrlValue = previousUrlValue.trim();

            // in case the previous URL value is not valid
            if (!previousUrlValue) {
                // returns immediately
                // (no URL change)
                return;
            }

            // sets the new location in the document (redirect)
            jQuery.uxlocation(previousUrlValue);
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
