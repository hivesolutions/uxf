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

                        // updates the data style of the data source to local
                        // and adds the item elements into it, then runs the
                        // initializer of the local data source extension
                        _element.attr("data-type", "local");
                        for (var index = 0; index < items.length; index++) {
                            // retrieves the current item in iteration and checks
                            // if the type of it is a string, conditional action
                            var item = items[index];
                            var isString = typeof item == "string";

                            // in case the current item is a string it must be
                            // added directly
                            if (isString) {
                                _element.append("<li>" + item + "</li>");
                            } else {
                                // starts the string value with the initial
                                // list item
                                var _string = "<li>";

                                // iterates over all the keys in the item to
                                // create the various span elements representing
                                // the various attributes
                                for (key in item) {
                                    // retrieves the value associated the current key
                                    // and appends the span associated with the key
                                    var value = item[key];
                                    _string += "<span name=\"" + key + "\">"
                                            + value + "</span>";
                                }

                                // adds the final list reference to the string and then
                                // adds the list item to the string and the complete string
                                // value list item to the element
                                _string += "</li>";
                                _element.append(_string);
                            }
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
