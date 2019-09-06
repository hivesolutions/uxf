if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

(function(jQuery) {
    jQuery.fn.uxdatasource = function(options) {
        // the default values for the data source
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
            // iterates over all the elements in the matched object
            matchedObject.each(function(index, element) {
                // retrieves the element reference
                var _element = jQuery(element);

                // updates the query element
                _updateQueryElement(_element, options);

                // triggers the ready event on the data source
                // this should be able to notifiy possible listeners
                // that the data is ready to be managed and "explored"
                _element.trigger("data_ready");
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {};

        var _updateQueryElement = function(element) {
            // retrieves the element type, to construct
            // the data source method name
            var type = element.attr("data-type");
            var dataSourceMethodName = "uxdatasource" + type;

            // updates the query element for the specific
            // data source type
            element[dataSourceMethodName]();

            // retrieves the query attribute for the element
            var queryAttribute = element.attr("data-query_attribute");

            // updates the element data
            element.data("query_attribute", queryAttribute);
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
