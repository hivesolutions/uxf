(function(jQuery) {
    jQuery.fn.uxresponsive = function() {
        // retrieves the references to the current matched object
        // and the window object, to be used in the resize event
        var matchedObject = this;
        var _window = jQuery(window);

        // verifies if there's at leat one valid object matched and
        // if that's not the case returns the current context immediately
        if (!matchedObject || matchedObject.length == 0) {
            return this;
        }

        var watch = function() {
            // retrieves the current values for both the width and
            // the height of the current window, these values are
            // going to be used to classify the current object display
            var windowWidth = _window.width();
            var windowHeight = _window.height();

            // removes the complete set of class associated with both
            // width and height values so that the new classes may be
            // added according to the newly "generated" size
            matchedObject.removeClass("mobile-s");
            matchedObject.removeClass("tablet-s");
            matchedObject.removeClass("desktop-s");
            matchedObject.removeClass("fat-s");
            matchedObject.removeClass("tall-s");

            // verifies the current window width value and according to
            // that selects the proper class to be applied to the object
            if (windowWidth > 768) {
                matchedObject.addClass("desktop-s");
            } else if (windowWidth > 420) {
                matchedObject.addClass("tablet-s");
            } else {
                matchedObject.addClass("mobile-s");
            }

            // verifies the current window width value and according to
            // that selects the proper class to be applied to the object
            if (windowWidth > 960) {
                matchedObject.addClass("fat-s");
            }

            // verifies the current window height value and according to
            // that selects the proper class to be applied to the object
            if (windowHeight > 800) {
                matchedObject.addClass("tall-s");
            }
        };

        // registers for the resize event on the current window so
        // thtat the proper watch (tick) operation is performed
        _window.resize(function(event) {
                    watch();
                });

        // starts the watching process for the currently matched
        // object so that the proper (initial) classes are set
        watch();

        // returns the reference to the current context to
        // the caller object so that it may be "re-used"
        return this;
    };
})(jQuery);
