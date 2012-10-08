(function($) {
    jQuery.fn.uxdisable = function(options) {
        // the default values for the disable
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

                        // adds the disabled class from the element
                        _element.addClass("disabled");

                        // checks if the currently element is an input field
                        // in case it is sets the disabled attribute
                        var isInput = _element.is("input");
                        isInput && _element.attr("disabled", "1");

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
