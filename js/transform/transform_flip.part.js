(function(jQuery) {
    jQuery.fn.uxtransformflip = function(element, options) {
        // the default values for the transform flip
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
            // checks if the matched object has the no click class
            var noClick = matchedObject.hasClass("no-click");

            // registers for the click event
            !noClick && matchedObject.click(function() {
                        // retrieves the element
                        var element = jQuery(this);

                        // checks if the element contains
                        // the flip class for removal
                        if (element.hasClass("flip")) {
                            // removes the flip class
                            element.removeClass("flip");
                        }
                        // otherwise it should be added
                        else {
                            // add the flip class
                            element.addClass("flip");
                        }
                    });
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
