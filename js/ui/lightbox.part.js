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
            // tries retrieves the window (lightbox window) elements
            // in case the elements do not exists creates a new element
            var window = jQuery(".window.window-lightbox", matchedObject);
            if (window.length == 0) {
                window = jQuery("<div class=\"window window-lightbox\">"
                        + "<div class=\"button-confirm\"></div>"
                        + "<img alt=\"\" />" + "</div>");
                window.uxwindow();
                matchedObject.append(window);
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
            hasChanged && windowImage.attr("src", path);
            hasChanged && windowImage.hide();

            // shows the window (should not show the image immediately,
            // but must trigger the loading of it)
            window.uxwindow("show");

            // registers for the end of the image loading, because
            // after that the window must be repositioned in the center
            windowImage.load(function() {
                        // retrieves the current element it should reflect the
                        // selcted image (the one that has finished the loading)
                        var element = jQuery(this);

                        // removes the loading class from the window, the
                        // windows is no longer considered to be loading
                        window.removeClass("loading");

                        // shows the window image (back to original state)
                        // and then repositions the window in the center
                        // of the screen (the width and height may have changed)
                        windowImage.show();
                        window.uxcenter();
                    });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the window (alert window) elements
            var lightbox = jQuery(".window.window-lightbox", matchedObject);
            var buttonConfirm = jQuery(".button-confirm", lightbox);

            // registers for the click event on the (lightbox) window
            // so that the window is properly hidden from the current view
            lightbox.click(function() {
                        // retrieves the element and sets it as the
                        // current window to be changed
                        var element = jQuery(this);
                        var window = element;

                        // hides the window and calls the
                        // callback if defined
                        window.uxwindow("hide");
                        callback && callback(true);
                    });

            // registers for the centered event so that after the centering
            // process ends the maximum dimensions of the image are going to
            // be updated (if required) and correct centering measures are used
            lightbox.bind("centered", function() {
                        // retrieves the reference to the window element that is
                        // going to be centered in the viewport
                        var element = jQuery(this);

                        // retrieves the global window element refernece and
                        // the image associated with the lightbox window
                        var _window = jQuery(window);
                        var windowImage = jQuery("img", element);

                        // retrieves the global window sizes and re-calculcates
                        // the maximum size for the image using these values as
                        // reference, note that a margin is given to avoid overlap
                        var height = _window.height();
                        var width = _window.width();
                        var maxHeight = height - 32;
                        var maxWidth = width - 32;

                        // retrieves the currently defined maximum dimenstion for the
                        // image and parses these values as integers, these values are
                        // going to be used to decide if the image maximum dimenstions
                        // have changed or not (for recentering position)
                        var _maxHeight = windowImage.css("max-height");
                        var _maxWidth = windowImage.css("max-width");
                        _maxHeight = parseInt(_maxHeight);
                        _maxWidth = parseInt(_maxWidth);

                        // verifies if the maximum dimensions for the image have changed
                        // and if that's not the case returns immediately, this return
                        // avoids a loop in the centering process (required)
                        var hasChanged = maxHeight != _maxHeight
                                || maxWidth != _maxWidth;
                        if (!hasChanged) {
                            return;
                        }

                        // updates the maximum dimenstions for the image of the
                        // lightbox so that no overlap exists in the window viewport
                        windowImage.css("max-height", maxHeight + "px");
                        windowImage.css("max-width", maxWidth + "px");

                        // re-centers the lightbox window as it's dimension should have
                        // changed and the center must be re-computed
                        element.uxcenter();
                    });

            // registers for the click event on the button confirm
            buttonConfirm.click(function() {
                        // retrieves the element and retrieves the
                        // parent window element from it (to be hidden)
                        var element = jQuery(this);
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
