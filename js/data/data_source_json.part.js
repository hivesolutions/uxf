(function($) {
    jQuery.fn.uxdatasourcejson = function(options) {
        // the default values for the data source json
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
            // iterates over all the elements in the matched object
            matchedObject.each(function(index, element) {
                        // retrieves the element reference
                        var _element = jQuery(element);

                        // updates the query element
                        _updateQueryElement(_element, options);
                    });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
        };

        var _updateQueryElement = function(element, options) {
            // retrieves the url for the element
            var url = element.attr("data-url")

            // updates the element data
            element.data("type", "json");
            element.data("url", url);
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
