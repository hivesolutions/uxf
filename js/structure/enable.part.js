(function(jQuery) {
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
                // retrieves the element reference and
                // verifies that it is currently disabled
                // if that's not the case returns immediately
                var _element = jQuery(element);
                var isDisabled = _element.hasClass("disabled") || element.attr("disabled");
                if (!isDisabled) {
                    return;
                }

                // removes the disabled class from the element, marking
                // it as currently enabled
                _element.removeClass("disabled");

                // checks if the currently matche object is an input field
                // in case it is removes the disabled attribute
                var isInput = _element.is("input, textarea");
                isInput && _element.removeAttr("disabled");

                // triggers the enabled event on the element
                // to indicate that it has been enabled
                _element.triggerHandler("enabled");
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
