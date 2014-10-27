(function(jQuery) {
    jQuery.fn.uxcenter = function(topOffset, leftOffset, useMargin, avoidTop, avoidLeft, keep, reference, position) {
        // sets the jquery matched object that is going to be centered
        // on the currently defined viewport window
        var matchedObject = this;

        // triggers the centering event meaning that the object that has
        // been selected is going to start the centering process
        matchedObject.triggerHandler("centering")

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

        // retrieves the window, taking into account if other
        // reference exists, if that's the case the reference
        // element is used instead of the base (global window)
        var _window = jQuery(window);
        var reference = reference ? reference : _window;

        var position = position ? position : "center";

        // retrieves the reference element dimensions, that are
        // going to be used in the re-position of the element
        var referenceHeight = reference.height();
        var referenceWidth = reference.width();

        // retrieves the window scroll values to be used also as
        // references for the top and left positions
        var referenceSrollTop = reference.scrollTop();
        var referenceSrollLeft = reference.scrollLeft();

        // retrieves the matched object dimensions
        var matchedObjectHeight = matchedObject.outerHeight(true);
        var matchedObjectWidth = matchedObject.outerWidth(true);

        // calculates the element positions, taking into account the proper
        // target position to be used for the positioning, note that it's
        // not possible to control the horizontal position
        switch (position) {
            case "center" :
                var topPosition = ((referenceHeight - matchedObjectHeight) / 2);
                var leftPosition = ((referenceWidth - matchedObjectWidth) / 2);
                break;

            case "top" :
                var topPosition = 0;
                var leftPosition = ((referenceWidth - matchedObjectWidth) / 2);
                break;

            case "bottom" :
                var topPosition = referenceHeight - matchedObjectHeight;
                var leftPosition = ((referenceWidth - matchedObjectWidth) / 2);
                break;
        }

        // recalculates the element positions according to the
        // top and left offsets in percentage
        topPosition -= topOffset * topPosition;
        leftPosition -= leftOffset * leftPosition;

        // adds the extra scroll position to the top position of
        // the element so that the element is "scroll centered"
        topPosition += referenceSrollTop;
        leftPosition += referenceSrollLeft;

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
                                            false, reference, position);
                                });

                        // registers the scroll in the window
                        // should keep the window centered
                        _window.scroll(function() {
                                    _element.uxcenter(topOffset, leftOffset,
                                            useMargin, avoidTop, avoidLeft,
                                            false, reference, position);
                                });

                        // registers the changing of contents in
                        // the itnernal structure of the window
                        _element.bind("layout", function() {
                                    _element.uxcenter(topOffset, leftOffset,
                                            useMargin, avoidTop, avoidLeft,
                                            false, reference, position);
                                });
                    });
        }

        // triggers the centered event meaning that the window has just
        // finished the centering operation and the layout has been updated
        matchedObject.triggerHandler("centered")

        // returns the object
        return this;
    };
})(jQuery);
