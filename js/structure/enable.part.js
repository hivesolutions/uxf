(function(jQuery) {
    jQuery.fn.uxenable = function(readonly) {
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
            // calculates the proper name for the enable attribute
            // taking into account the provided argument value for
            // the current disable extension
            var name = readonly ? "readonly" : "disabled";

            // iterates over all the matched objects
            matchedObject.each(function(index, element) {
                // retrieves the element reference and
                // verifies that it is currently disabled
                // if that's not the case returns immediately
                var _element = jQuery(element);
                var isDisabled = _element.hasClass("disabled") || _element.attr(name);
                if (!isDisabled) {
                    return;
                }

                // removes the disabled class from the element, marking
                // it as currently enabled
                _element.removeClass("disabled");

                // checks if the currently matche object is an input field
                // in case it is removes the disabled or readonly attributes
                var isInput = _element.is("input, textarea");
                isInput && _element.removeAttr(name);

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
