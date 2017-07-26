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
        var _appendHtml = function() {};

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // registers for the click event in
            // the matched object
            matchedObject.click(function(event) {
                // retrieves the element
                var element = jQuery(this);

                // calls the confirm part that will initialize
                // the process of message based verification
                _call(element, options);

                // prevents the default behaviour of the element
                // (link) so that no document redirection occurs
                event.preventDefault();
            });
        };

        var _call = function(matchedObject, options) {
            // retrieves the body element for the current
            // structure model
            var _body = jQuery("body");

            // retrieves the message and the (target) window from
            // the matched object to be used in the loading
            var message = matchedObject.attr("data-message");
            var window = matchedObject.attr("data-window") || null;

            // calls the confirm window in the document, note that
            // in case the window value is set the proper window is
            // going to be used for the confirmation display
            _body.uxconfirm(message, function(result) {
                // in case the result is cancel avoids the current
                // execution and returns immediately
                if (result === false) {
                    return;
                }

                // retrieves the matched object location and
                // sets it in the document effectively changing
                // the location of the current document
                var location = matchedObject.attr("href");
                jQuery.uxlocation(location);
            }, {
                window: window
            });
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
