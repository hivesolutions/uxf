(function(jQuery) {
    jQuery.fn.uxcenter = function(topOffset, leftOffset, useMargin, avoidTop, avoidLeft, keep) {
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

        // if the centering operation should be performed
        // as a persistent operation (global resizing trigger
        // a new center operation)
        var keep = keep ? keep : false;

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

        // in case the keep flag is set the element must be registered
        // for the various event that require a new "centering"
        if (keep) {
            // iterates over all the elements in the matched object
            // to register them for the events that require centering
            matchedObject.each(function(index, element) {
                        // retrieves the element reference
                        var _element = jQuery(element);

                        // registers the resize in the window
                        // should keep the window centered
                        _window.resize(function(event) {
                                    _element.uxcenter(topOffset, leftOffset,
                                            useMargin, avoidTop, avoidLeft,
                                            false);
                                });

                        // registers the scroll in the window
                        // should keep the window centered
                        _window.scroll(function() {
                                    _element.uxcenter(topOffset, leftOffset,
                                            useMargin, avoidTop, avoidLeft,
                                            false);
                                });

                        // registers the changing of contents in
                        // the itnernal structure of the window
                        _element.bind("layout", function() {
                                    _element.uxcenter(topOffset, leftOffset,
                                            useMargin, avoidTop, avoidLeft,
                                            false);
                                });
                    });
        }

        // returns the object
        return this;
    };
})(jQuery);
