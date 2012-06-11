(function($) {
    jQuery.fn.uxform = function(options) {
        // the default values for the form
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
            // to add the submit input button to it
            matchedObject.each(function(index, element) {
                // retrieves the element reference
                var _element = jQuery(element);

                // adds the submit button to the matched
                // object (form), only in case the no keyboard
                // flag is not set
                var noKeyboard = _element.hasClass("no-keyboard");
                !noKeyboard
                        && _element.append("<input type=\"submit\" class=\"submit-button\" />");
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // registers for the submit event so that
            // duplicate submits may be avoided
            matchedObject.submit(function(event) {
                        // retrieves the current element
                        var element = jQuery(this);

                        // retrieves the state of the submited flag
                        // and then updates it to the valid value
                        var submited = element.data("submited");
                        element.data("submited", true);

                        // in case the form was not yet submited no
                        // need to prevent the event
                        if (!submited) {
                            // returns immediately no need to
                            // prevent the event propagation
                            return;
                        }

                        // stops the event propagation and
                        // prevents the default behavior (avoids
                        // duplicate submits)
                        event.stopPropagation();
                        event.preventDefault();
                    });
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
