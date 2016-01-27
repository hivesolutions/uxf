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

        // tries to retrieve the complete set of pixel based values for
        // border width and height values, these values are going to be
        // used by the watch function to determine the correct classes
        var slimWidth = matchedObject.attr("data-slim") || "960";
        var tabletWidth = matchedObject.attr("data-tablet") || "768";
        var mobileWidth = matchedObject.attr("data-mobile") || "420";
        var averageHeight = matchedObject.attr("data-average") || "800";
        var shortHeight = matchedObject.attr("data-short") || "500";
        var smallHeight = matchedObject.attr("data-small") || "320";
        var minimalHeight = matchedObject.attr("data-minimal") || "200";
        slimWidth = parseInt(slimWidth);
        tabletWidth = parseInt(tabletWidth);
        mobileWidth = parseInt(mobileWidth);
        shortHeight = parseInt(shortHeight);
        smallHeight = parseInt(smallHeight);
        minimalHeight = parseInt(minimalHeight);

        var measure = function() {
            // tries to retrive the pixel ratio of the current device
            // so that it may be used to populate global class values
            var ratio = window.devicePixelRatio;
            if (!ratio) {
                return;
            }

            // verifies if the ratio is greater that one and if that's
            // the case adds the retina class indicating that a greater
            // than normal ratio is present for the device
            if (ratio > 1) {
                matchedObject.addClass("retina-s");
            }

            // constructs the pixel class string value and adds the class
            // to the currently matched object (as expected)
            var pixelClass = "pixel-" + String(ratio) + "s";
            matchedObject.addClass(pixelClass);
        };

        var watch = function() {
            // retrieves the current values for both the width and
            // the height of the current window, these values are
            // going to be used to classify the current object display
            var windowWidth = _window.width();
            var windowHeight = _window.height();

            // determines the current device selected by the matched
            // object in case a change exists an event is raised
            var device = matchedObject.attr("data-device");
            var nextDevice = device;

            // removes the complete set of class associated with both
            // width and height values so that the new classes may be
            // added according to the newly "generated" size
            matchedObject.removeClass("mobile-s");
            matchedObject.removeClass("tablet-s");
            matchedObject.removeClass("desktop-s");
            matchedObject.removeClass("fat-s");
            matchedObject.removeClass("tall-s");
            matchedObject.removeClass("average-s");
            matchedObject.removeClass("short-s");
            matchedObject.removeClass("small-s");
            matchedObject.removeClass("minimal-s");
            matchedObject.removeClass("portrait-s");
            matchedObject.removeClass("landscape-s");

            // verifies the current window width value and according to
            // that selects the proper class to be applied to the object
            if (windowWidth > tabletWidth) {
                nextDevice = "desktop";
                matchedObject.addClass("desktop-s");
            } else if (windowWidth > mobileWidth) {
                nextDevice = "tablet";
                matchedObject.addClass("tablet-s");
            } else {
                nextDevice = "mobile";
                matchedObject.addClass("mobile-s");
            }

            // verifies the current window width value and according to
            // that selects the proper class to be applied to the object
            if (windowWidth > slimWidth) {
                matchedObject.addClass("fat-s");
            }

            // verifies the current window height value and according to
            // that selects the proper class to be applied to the object
            if (windowHeight > averageHeight) {
                matchedObject.addClass("tall-s");
            } else if (windowHeight > shortHeight) {
                matchedObject.addClass("average-s");
            } else if (windowHeight > smallHeight) {
                matchedObject.addClass("short-s");
            } else if (windowHeight > minimalHeight) {
                matchedObject.addClass("small-s");
            } else {
                matchedObject.addClass("minimal-s");
            }

            // verifies if the current viewport is portairt of landscape
            // based and then adds the proper class to the base element
            var isPortrait = windowHeight > windowWidth;
            if (isPortrait) {
                matchedObject.addClass("portrait-s");
            } else {
                matchedObject.addClass("landscape-s");
            }

            // determines if the device has changed from the previous step
            // if that's the case a new event should be raised
            var deviceChanged = device != nextDevice;

            // updates both the width, height and device values of the matched
            // object so that easy reference is possible from scripts
            matchedObject.attr("data-width", String(windowWidth));
            matchedObject.attr("data-height", String(windowHeight));
            matchedObject.attr("data-device", nextDevice);

            // in case the device has changed a device change event is raised
            // so thtat any listner is notified about such changed
            deviceChanged
                && matchedObject.triggerHandler("device_change", [nextDevice]);
        };

        var watchDelayed = function() {
            // sets a timeout callback to be called after the current tick
            // operation in order to run the watch operation (as expected)
            setTimeout(function() {
                watch();
            });
        };

        // registers for the resize event on the current window so
        // thtat the proper watch (tick) operation is performed
        _window.resize(function(event) {
            watch();
        });

        // measures the current pixel properties of the screen
        // and populates the proper structures
        measure();

        // starts the watching process for the currently matched
        // object so that the proper (initial) classes are set
        watch();
        watchDelayed();

        // returns the reference to the current context to
        // the caller object so that it may be "re-used"
        return this;
    };
})(jQuery);
