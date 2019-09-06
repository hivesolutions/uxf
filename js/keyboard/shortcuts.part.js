if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

(function(jQuery) {
    jQuery.fn.uxshortcuts = function(element, options) {
        // the default values for the shortcuts
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
            // retrieves all the elements to apply key and applies
            // the key plugin to each of them
            var key = jQuery(".key", matchedObject).not(".template .key");
            key.uxkey();
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the global option
            var global = options["global"] ? options["global"] : true;

            // iterates over all the matched objects
            matchedObject.each(function(index, element) {
                // retrieves the element reference
                var _element = jQuery(element);

                // retrieves the target object base on the global option
                var targetObject = global ? jQuery(document) : _element;

                // tries to retrieve a possible previous handler already
                // registered for the current element in case it exists
                // unbinds it from the key up event in order to avoid any
                // duplicated behaviour
                var previousHandler = targetObject.data("shortcuts_handler");
                if (previousHandler) {
                    targetObject.unbind("keyup", previousHandler);
                }

                // creates the handler function with a clojure in the current
                // enviroment that will increment and decrement the current page
                var handler = function(event) {
                    // retrieves the key value
                    var keyValue = event.keyCode
                        ? event.keyCode
                        : event.charCode
                        ? event.charCode
                        : event.which;

                    // switches over the key value
                    switch (keyValue) {
                        // in case it's a j key
                        case 74:
                            // sends the current element to the
                            // next "element"
                            matchedObject.uxnext();

                            // breaks the switch
                            break;

                        // in case it's a k key
                        case 75:
                            // sends the current element to the
                            // previous "element"
                            matchedObject.uxprevious();

                            // breaks the switch
                            break;

                        // in case it's default
                        default:
                            // breaks the switch
                            break;
                    }
                };

                // registers for the key up in the target
                // object element and then sets the element
                // to unregister the handler once the element
                // is removed from the structures, avoiding extra
                // handling of events
                targetObject.keyup(handler);
                targetObject.data("shortcuts_handler", handler);
                _element.bind("destroyed", function() {
                    targetObject.unbind("keyup", handler);
                });
            });
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
