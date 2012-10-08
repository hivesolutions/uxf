(function($) {
    jQuery.fn.uxenable = function(method, options) {
        // the default values for the enable
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
            // iterates over all the matched objects
            matchedObject.each(function(index, element) {
                        // retrieves the element reference
                        var _element = jQuery(element);

                        // removes the disabled class from the element
                        matchedObject.removeClass("disabled");

                        // checks if the currently matche object is an input field
                        // in case it is removes the disabled attribute
                        var isInput = matchedObject.is("input");
                        isInput && matchedObject.removeAttr("disabled");

                        // triggers the enabled event on the element
                        // to indicate that it has been enabled
                        matchedObject.triggerHandler("enabled");
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
