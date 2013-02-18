(function(jQuery) {
    jQuery.fn.uxkey = function(element, options) {
        // the default values for the key
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
            // retrieves the global option
            var global = options["global"] ? options["global"] : true;

            // iterates over all the matched objects
            matchedObject.each(function(index, element) {
                        // retrieves the element reference
                        var _element = jQuery(element);

                        // retrieves the data attributes
                        var key = _element.attr("data-key");
                        var url = _element.attr("data-url");

                        // converts the key to integer
                        var keyInteger = parseInt(key);

                        // in case the key does not represent an integer
                        if (isNaN(keyInteger)) {
                            // returns immediately
                            return;
                        }

                        // retrieves the target object base on the global option
                        var targetObject = global ? jQuery(document) : _element;

                        // registers for the key up in the target
                        // object element
                        targetObject.keyup(function(event) {
                                    // retrieves the key value
                                    var keyValue = event.keyCode
                                            ? event.keyCode
                                            : event.charCode
                                                    ? event.charCode
                                                    : event.which;

                                    // in case the ctrl or the alt keys
                                    // are pressed no need to handle the event
                                    // (default behavior is not desired)
                                    if (event.ctrlKey || event.altKey) {
                                        // returns immediately
                                        return;
                                    }

                                    // switches over the key value
                                    switch (keyValue) {
                                        // in case it's the target key
                                        case keyInteger :
                                            // sets the "new" document location
                                            document.location = url;

                                            // breaks the switch
                                            break;

                                        // in case it's default
                                        default :
                                            // breaks the switch
                                            break;
                                    }
                                });
                    });
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
