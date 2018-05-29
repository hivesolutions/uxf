(function(jQuery) {
    jQuery.fn.uxdatawidth = function(query, callback, options) {
        // the default values for the data query json
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
            // iterates over all the matched object, to update
            // their respective values
            matchedObject.each(function(index, element) {
                // retrieves the current element for iteration
                var _element = jQuery(element);

                // retrieves the value from the width element
                // and then updates the css attributes of it accordingly
                var width = _element.attr("data-width");
                _element.css("min-width", width + "px");
                _element.css("width", width + "px");
                _element.css("max-width", width + "px");
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
