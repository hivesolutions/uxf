(function(jQuery) {
    jQuery.fn.uxdataquery = function(query, callback, options) {
        // the default values for the data query
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
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // iterates over all the object to retrieve the
            // result associated
            matchedObject.each(function(index, element) {
                        // retrieves the element reference
                        var _element = jQuery(element);

                        // retrieves the results for the element and query
                        _getResults(_element, query, callback);
                    });
        };

        var _getResults = function(element, query, callback) {
            // retrieves the element type, to construct
            // the data query method name
            var elementType = element.data("type");
            var dataQueryMethodName = "uxdataquery" + elementType;

            // in case the element type is not valid calls the callback
            // immediately with no results because it was not possible
            // to retrieve any kind of data from an invalid data source
            if (elementType == null || elementType == undefined) {
                callback([], false);
            }

            // runs the data query method for the specific
            // data source type
            element[dataQueryMethodName](query, callback);
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
