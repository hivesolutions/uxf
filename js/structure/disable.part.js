(function(jQuery) {
    jQuery.fn.uxdisable = function(readonly) {
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
            // calculates the proper name for the disable attrbute
            // taking into account the provided argument value for
            // the current disable extension
            var name = readonly ? "readonly" : "disabled";

            // iterates over all the matched objects
            matchedObject.each(function(index, element) {
                        // retrieves the element reference and
                        // adds the disabled class from to it
                        var _element = jQuery(element);
                        _element.addClass("disabled");

                        // checks if the currently element is an input field
                        // in case it is sets the disabled attribute
                        var isInput = _element.is("input, textarea");
                        isInput && _element.attr(name, "1");

                        // triggers the disabled event on the element
                        // to indicate that it has been disabled
                        _element.triggerHandler("disabled");
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
