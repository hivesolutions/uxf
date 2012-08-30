(function($) {
    jQuery.fn.uxscroll = function(options) {
        // the default values for the scrill
        var defaults = {
            offset : 0,
            padding : 0,
            parent : window
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
            var parent = options["parent"];

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

            // retrieves the parent element reference to
            // be used for attribute calculation
            var _parent = jQuery(parent);

            // updates the scroll top value taking into account if the
            // current parent elemeent is the window
            scrollTop = _parent[0] == window ? scrollTop : _parent.scrollTop();

            // retrieves the height of the parent element
            var parentHeight = _parent[0] == window
                    ? _parent.height()
                    : _parent.outerHeight();

            // calculates the top offset value for the parent element
            // to be used for some calculus (in no window mode)
            var parentOffset = _parent.offset();
            var parentOffsetTop = parentOffset
                    ? parentOffset.top - scrollTop
                    : 0;

            // calculates the bottom position for the matched object
            // and uses the value to determine if the element is position
            // below of above the position of the scroll viewport
            var bottomPosition = offsetTop - parentOffsetTop
                    + matchedObject.outerHeight();
            var isBelow = scrollTop + parentHeight < bottomPosition;

            // calculates the appropriate (new) scroll top value taking
            // into account if the element is below the viewport or
            // abover, this calculus also takes into account the offset
            // and padding values
            var scrollTop = isBelow ? offsetTop - parentOffsetTop
                    - parentHeight + height + padding : offsetTop
                    - parentOffsetTop - offset - padding;

            // changes the scroll top value in the parent element,
            // this should make visible the matched object
            _parent.scrollTop(scrollTop);
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
