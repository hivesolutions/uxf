if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

(function(jQuery) {
    jQuery.fn.uxdatasourcecountries = function(options) {
        // the default values for the data source local
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
            // iterates over all the elements in the matched object
            matchedObject.each(function(index, element) {
                // retrieves the element reference
                var _element = jQuery(element);

                // retrieves the list of countries to be used according
                // to the currently defined locale
                var COUNTRIES = jQuery.uxlocale("COUNTRIES");
                COUNTRIES = COUNTRIES.slice();
                COUNTRIES.sort();

                // updates the items data in the current element
                // ands runs the initializer of the items data
                // source extension
                _element.data("items", COUNTRIES);
                _element.uxdatasourceitems();
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
