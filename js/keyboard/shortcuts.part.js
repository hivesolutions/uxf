(function(jQuery) {
    jQuery.fn.uxshortcuts = function(element, options) {
        // the default values for the shortcuts
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
            // retrieves all the elements to apply key
            var key = jQuery(".key", matchedObject).not(".template .key");

            // applies the key
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

                        // registers for the key up in the target
                        // object element
                        targetObject.keyup(function(event) {
                                    // retrieves the key value
                                    var keyValue = event.keyCode
                                            ? event.keyCode
                                            : event.charCode
                                                    ? event.charCode
                                                    : event.which;

                                    // switches over the key value
                                    switch (keyValue) {
                                        // in case it's a j key
                                        case 74 :
                                            // sends the current element to the
                                            // next "element"
                                            matchedObject.uxnext();

                                            // breaks the switch
                                            break;

                                        // in case it's a k key
                                        case 75 :
                                            // sends the current element to the
                                            // previous "element"
                                            matchedObject.uxprevious();

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
