(function(jQuery) {
    jQuery.fn.uxdatasourceisocountries = function(options) {
        // the default values for the data source local
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

                        // creates the list that is going to be used as the basis
                        // for the storage of the complete set of countries, this
                        // is going to be populated with maps of name and value
                        var items = [];

                        // retrieves the iso standard version of the countries
                        // that is going to be used as the logical version
                        var COUNTRIES = jQuery.uxlocale("COUNTRIES", "en-us");
                        COUNTRIES = COUNTRIES.slice();
                        COUNTRIES.sort();

                        // retrieves the list of countries to be used according
                        // to the currently defined locale, this localized version
                        // is going to be used for display
                        var COUNTRIES_L = jQuery.uxlocale("COUNTRIES");
                        COUNTRIES_L = COUNTRIES_L.slice();
                        COUNTRIES_L.sort();

                        // iterates over the range of the countries list to create
                        // the various items that are part of the data source
                        for (var index = 0; index < COUNTRIES.length; index++) {
                            var item = {
                                name : COUNTRIES_L[index],
                                value : COUNTRIES[index]
                            }
                            items.push(item);
                        }

                        // updates the items data in the current element
                        // ands runs the initializer of the items data
                        // source extension
                        _element.data("items", items);
                        _element.uxdatasourceitems();
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
