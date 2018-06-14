if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

(function(jQuery) {
    jQuery.fn.uxcenter = function(
        topOffset,
        leftOffset,
        useMargin,
        avoidTop,
        avoidLeft,
        keep,
        reference,
        position
    ) {
        // sets the jquery matched object that is going to be centered
        // on the currently defined viewport window
        var matchedObject = this;

        // triggers the centering event meaning that the object that has
        // been selected is going to start the centering process
        matchedObject.triggerHandler("centering");

        // retrieves the top and left offsets
        topOffset = topOffset || 0;
        leftOffset = leftOffset || 0;

        // retrieves the use margin flag
        useMargin = useMargin || false;

        // retrieves the avoid top and avoid left
        // flags values, going to be used in decisions
        avoidTop = avoidTop || false;
        avoidLeft = avoidLeft || false;

        // if the centering operation should be performed
        // as a persistent operation (global resizing trigger
        // a new center operation)
        keep = keep || false;

        // retrieves the window, taking into account if other
        // reference exists, if that's the case the reference
        // element is used instead of the base (global window)
        var _window = jQuery(window);
        reference = reference || _window;

        // retrieves the proper reference position to be used in
        // the centering of the element, not that in case no
        // options is provided the default center value is used
        position = position || "center";

        // retrieves the kind of positioning strategy that is
        // currently being used for the position of the object
        // and then verifies if the strategy is a fixed one
        var positioning = matchedObject.css("position");
        var isFixed = positioning === "fixed";

        // re-sets the initial position of the matched object to
        // the upper left corner of screen so that no measures are
        // affected by the current position of the element, this
        // would/may cause problems with scroll bars height/width
        matchedObject.css("top", "0px");
        matchedObject.css("left", "0px");

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

        // starts some of the variables that are going to be populated
        // under the next conditional statement
        var topPosition = null;
        var leftPosition = null;

        // calculates the element positions, taking into account the proper
        // target position to be used for the positioning, note that it's
        // not possible to control the horizontal position
        switch (position) {
            case "center":
                topPosition = (referenceHeight - matchedObjectHeight) / 2;
                leftPosition = (referenceWidth - matchedObjectWidth) / 2;
                break;

            case "top":
                topPosition = 0;
                leftPosition = (referenceWidth - matchedObjectWidth) / 2;
                break;

            case "bottom":
                topPosition = referenceHeight - matchedObjectHeight;
                leftPosition = (referenceWidth - matchedObjectWidth) / 2;
                break;
        }

        // recalculates the element positions according to the
        // top and left offsets in percentage
        topPosition -= topOffset * topPosition;
        leftPosition -= leftOffset * leftPosition;

        // adds the extra scroll position to the top position of
        // the element so that the element is "scroll centered"
        // this is only required in case the element positioning
        // is not fixed based
        topPosition += isFixed ? 0 : referenceSrollTop;
        leftPosition += isFixed ? 0 : referenceSrollLeft;

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
                    _element.uxcenter(
                        topOffset,
                        leftOffset,
                        useMargin,
                        avoidTop,
                        avoidLeft,
                        false,
                        reference,
                        position
                    );
                });

                // registers the scroll in the window
                // should keep the window centered
                _window.scroll(function() {
                    _element.uxcenter(
                        topOffset,
                        leftOffset,
                        useMargin,
                        avoidTop,
                        avoidLeft,
                        false,
                        reference,
                        position
                    );
                });

                // registers the changing of contents in
                // the itnernal structure of the window
                _element.bind("layout", function() {
                    _element.uxcenter(
                        topOffset,
                        leftOffset,
                        useMargin,
                        avoidTop,
                        avoidLeft,
                        false,
                        reference,
                        position
                    );
                });
            });
        }

        // triggers the centered event meaning that the window has just
        // finished the centering operation and the layout has been updated
        matchedObject.triggerHandler("centered");

        // returns the object
        return this;
    };
})(jQuery);
