(function(jQuery) {
    jQuery.fn.uxlightbox = function(path, callback, options) {
        // the default values for the alert
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
            // retrieves the top level body element that may be used to
            // add the lightbox window to it
            var _body = jQuery("body");

            // tries retrieves the window (lightbox window) elements
            // in case the elements do not exists creates a new element
            var window = jQuery(".window.window-lightbox", matchedObject);
            if (window.length == 0) {
                window = jQuery("<div class=\"window window-lightbox\">"
                        + "<div class=\"button-confirm\"></div>"
                        + "<img alt=\"\" />" + "</div>");
                _body.append(window);
                window.uxwindow();
            }

            // retrieves the reference to the image element associated with
            // the window element to be used for the image change
            var windowImage = jQuery("img", window);

            // retrieves the current path from the window image and
            // then checks of it has changed
            var currentPath = windowImage.attr("src");
            var hasChanged = path != currentPath;

            // hides the current window image and sets the image
            // path in the window image (changes the current image
            // in the window)
            hasChanged && windowImage.hide();
            hasChanged && window.addClass("loading");
            windowImage.attr("src", path);
            hasChanged && windowImage.hide();

            // shows the window (should not show the image immediately,
            // but must trigger the loading of it)
            window.uxwindow("show");

            // registers for the end of the image loading, because
            // after that the window must be repositioned in the center
            windowImage.load(function() {
                        // removes the loading class from the window
                        window.removeClass("loading");

                        // shows the window image (back to original state)
                        windowImage.show();

                        // repositions the window in the center of the screen
                        // (the width and height may have changed)
                        window.uxcenter();
                    });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the window (alert window) elements
            var window = jQuery(".window.window-lightbox", matchedObject);
            var windowButtonConfirm = jQuery(".button-confirm", window);

            // registers for the click event on the window
            window.click(function() {
                        // retrieves the element
                        var element = jQuery(this);

                        // retrieves the associated window
                        var window = element;

                        // hides the window and calls the
                        // callback if defined
                        window.uxwindow("hide");
                        callback && callback(true);
                    });

            // registers for the click event on the button confirm
            windowButtonConfirm.click(function() {
                        // retrieves the element
                        var element = jQuery(this);

                        // retrieves the associated window
                        var window = element.parents(".window");

                        // hides the window and calls the
                        // callback if defined
                        window.uxwindow("hide");
                        callback && callback(true);
                    });
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
