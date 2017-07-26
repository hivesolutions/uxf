(function(jQuery) {
    jQuery.fn.uxprint = function(method, options) {
        // the default values for the enable
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
            // in case the matched object is empty, returns immediately
            // as there's nothing pending to be done
            if (!matchedObject || matchedObject.length === 0) {
                return;
            }

            // tries to retrieve the amount of delay to be applied
            // before running the print operation, this allows for
            // waiting for the rendering of the data, the provided
            // value should be defined in milliseconds
            var delay = matchedObject.attr("data-delay") || 0;
            delay = parseInt(delay);

            // prints the current document to the printer, this
            // should be a blocking operation and may block the
            // current browser interaction
            setTimeout(function() {
                window.print();
            }, delay);
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
