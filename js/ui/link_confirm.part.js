(function(jQuery) {
    jQuery.fn.uxlinkconfirm = function(message, options) {
        // the default values for the link confirm
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
            // registers for the click event in
            // the matched object
            matchedObject.click(function(event) {
                        // retrieves the element
                        var element = jQuery(this);

                        // calls the confirm part
                        _call(element, options);

                        // stops the propagation of the event both
                        // ot the next handlers and to the immediate
                        //one and then prevent the default behaviour
                        event.stopPropagation();
                        event.stopImmediatePropagation();
                        event.preventDefault();
                    });
        };

        var _call = function(matchedObject, options) {
            // retrieves the body element for the current
            // structure model
            var _body = jQuery("body");

            // retrieves the message from the matched object
            var message = matchedObject.attr("data-message");

            // calls the confirm window in the document
            _body.uxconfirm(message, function(result) {
                        // in case the result is cancel avoids the current
                        // execution and returns immediately
                        if (result == false) {
                            return;
                        }

                        // retrieves the matched object location and
                        // sets it in the document
                        var location = matchedObject.attr("href");
                        jQuery.uxlocation(location);
                    });
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
