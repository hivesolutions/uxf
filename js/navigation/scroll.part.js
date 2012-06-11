(function($) {
    jQuery.fn.uxscroll = function(options) {
        // the default values for the scrill
        var defaults = {
            offset : 0,
            padding : 0
        };

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
            // in case the matched object is not defined
            // or in case it's an empty list
            if (!matchedObject || matchedObject.length == 0) {
                // returns immediately
                return;
            }

            // retrieves the offset and padding from the options
            var offset = options["offset"];
            var padding = options["padding"];

            // retrieves the matched object height and
            // offset to top (from offset)
            var height = matchedObject.outerHeight();
            var _offset = matchedObject.offset();
            var offsetTop = _offset.top;

            // retrieves the top elements and then uses them
            // to retrieve the current offset to top in the viewport
            var topElements = jQuery("html, body");
            var htmlElement = jQuery("html");
            var _body = jQuery("body");
            var htmlScrollTop = htmlElement.scrollTop();
            var bodyTop = _body.scrollTop();
            var scrollTop = htmlScrollTop > bodyTop ? htmlScrollTop : bodyTop;

            // retrieves the window to retrieve its size
            var _window = jQuery(window);
            var windowHeight = _window.height();

            // calculates the bottom position for the matched object
            // and uses the value to determine if the element is position
            // below of above the position of the scroll viewport
            var bottomPosition = offsetTop + matchedObject.outerHeight();
            var isBelow = scrollTop + windowHeight < bottomPosition;

            // calculates the appropriate (new) scroll top value taking
            // into account if the element is below the viewport or
            // abover, this calculus also takes into account the offset
            // and padding values
            var scrollTop = isBelow ? offsetTop - windowHeight + height
                    + padding : offsetTop - offset - padding;

            // changes the scroll top value in the top elements
            topElements.scrollTop(scrollTop);
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
