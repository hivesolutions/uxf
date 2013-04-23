(function(jQuery) {
    jQuery.fn.uxcenter = function(topOffset, leftOffset, useMargin, avoidTop, avoidLeft) {
        // sets the jquery matched object
        var matchedObject = this;

        // retrieves the top and left offsets
        var topOffset = topOffset ? topOffset : 0;
        var leftOffset = leftOffset ? leftOffset : 0;

        // retrieves the use margin flag
        var useMargin = useMargin ? useMargin : false;

        // retrieves the avoid top and avoid left
        // flags values
        var avoidTop = avoidTop ? avoidTop : false;
        var avoidLeft = avoidLeft ? avoidLeft : false;

        // retrieves the window
        var _window = jQuery(window);

        // retrieves the window dimensions
        var windowHeight = _window.height();
        var windowWidth = _window.width();

        // retrieves the window scroll values
        var windowSrollTop = _window.scrollTop();
        var windowSrollLeft = _window.scrollLeft();

        // retrieves the matched object dimensions
        var matchedObjectHeight = matchedObject.outerHeight();
        var matchedObjectWidth = matchedObject.outerWidth();

        // calculates the element positions
        var topPosition = ((windowHeight - matchedObjectHeight) / 2);
        var leftPosition = ((windowWidth - matchedObjectWidth) / 2);

        // recalculates the element positions according to the
        // top and left offsets in percentage
        topPosition -= topOffset * topPosition;
        leftPosition -= leftOffset * leftPosition;

        // adds the extra scroll position to the top position of
        // the element so that the element is "scroll centered"
        topPosition += windowSrollTop;
        leftPosition += windowSrollLeft;

        // in case the reference attribute to be used for centering
        // the element is the margin
        if (useMargin) {
            // sets the element (matched object) margins
            !avoidTop && matchedObject.css("margin-top", topPosition + "px");
            !avoidLeft && matchedObject.css("margin-left", leftPosition + "px");
        }
        // otherwise the "normal" centering should be used
        else {
            // sets the element (matched object) position
            !avoidTop && matchedObject.css("top", topPosition + "px");
            !avoidLeft && matchedObject.css("left", leftPosition + "px");
        }

        // returns the object
        return this;
    };
})(jQuery);
