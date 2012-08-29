(function($) {
    jQuery.fn.uxdatasourceitems = function(options) {
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

                        // retrieves the currently loaded items in the element
                        // to update it in the element
                        var items = _element.data("items");

                        // updates the data tyle of the data source to local
                        // and adds the item elements into it, then runs the
                        // initializer of the local data source extension
                        _element.attr("data-type", "local");
                        for (var index = 0; index < items.length; index++) {
                            var item = items[index];
                            _element.append("<li>" + item + "</li>");
                        }
                        _element.uxdatasourcelocal();
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
