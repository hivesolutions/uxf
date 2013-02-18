(function(jQuery) {
    jQuery.fn.uxdatapivot = function(query, callback, options) {
        // the value to be used as the maximum (overflow) value
        // for the width of the pivot column.
        var MAXIMUM_WIDTH = 999999;

        // the default values for the data query json
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
            // iterates over all the matched object, to update
            // their respective values
            matchedObject.each(function(index, element) {
                        // retrieves the current element for iteration
                        var _element = jQuery(element);

                        // updates the element's width so that the defined
                        // values overflows the maximum table value, provides
                        // a way of creating a "pivot" column
                        _element.css("width", MAXIMUM_WIDTH + "px");
                        _element.css("max-width", MAXIMUM_WIDTH + "px");
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
