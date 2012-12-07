/**
 * jQuery window plugin, this jQuery plugin provides the base infra-structure
 * for the creation of a window component.
 *
 * @name jquery-window.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @date March 10, 2010
 * @category jQuery plugin
 * @copyright Copyright (c) 2010-2012 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function($) {
    jQuery.fn.uxwindow = function(method, options) {
        // the default values for the window
        var defaults = {};

        // sets the default method value
        var method = method ? method : "default";

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
            // tries to find the window mask
            var windowMask = jQuery(".window-mask", matchedObject);
            var windowMaskExists = windowMask.length > 0;

            // adds the window mask to the window in case it does not exist
            !windowMaskExists
                    && matchedObject.append("<div class=\"window-mask\">"
                            + "<div class=\"window-mask-contents\">Loading "
                            + "<span class=\"window-mask-dots\"></span>"
                            + "</div>" + "</div>");

            // positions the window
            _positionWindow(matchedObject, options);
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the window
            var _window = jQuery(window);

            // retrieves the close button
            var closeButton = jQuery(".close-button", matchedObject);

            // registers for the click in the close button
            closeButton.click(function(event) {
                        // retrieves the element
                        var element = jQuery(this);

                        // retrieves the window
                        var window = element.parents(".window");

                        // hides the window
                        _hide(window, options);
                    });

            // registers for the click event in the matched
            // object, to avoid event propagation
            matchedObject.click(function(event) {
                        // stops the event propagation, no need
                        // to propagate the click to the upper levels
                        event.stopPropagation();
                    });

            // iterates over all the elements in the matched object
            matchedObject.each(function(index, element) {
                        // retrieves the element reference
                        var _element = jQuery(element);

                        // registers the resize in the window
                        // should keep the window centered
                        _window.resize(function(event) {
                                    // positions the window in the screen
                                    _positionWindow(_element, options);
                                });

                        // registers the scroll in the window
                        // should keep the window centered
                        _window.scroll(function() {
                                    // positions the window in the screen
                                    _positionWindow(_element, options);
                                });

                        // registers the changing of contents in
                        // the itnernal structure of the window
                        _element.bind("layout", function() {
                                    // positions the window in the screen
                                    _positionWindow(_element, options);
                                });
                    });
        };

        var _show = function(matchedObject, options) {
            // retrieves the overlay element and forces a resize
            // on it to ensure dimensions (ensures proper size)
            var overlay = jQuery(".overlay");
            overlay.trigger("resize");

            // shows the overlay
            overlay.fadeIn(250);

            // shows the window
            matchedObject.fadeIn(250);

            // positions the window in the screen
            _positionWindow(matchedObject, options);
        };

        var _hide = function(matchedObject, options) {
            // retrieves the overlay element
            var overlay = jQuery(".overlay");

            // hides the overlay
            overlay.fadeOut(250);

            // hides the window
            matchedObject.fadeOut(250);
        };

        var _showMask = function(matchedObject, options) {
            // retrieves the window mask
            var mask = jQuery(".window-mask", matchedObject);

            // resizes the mask
            _resizeMask(matchedObject, options);

            // sets the interval for dot update
            var intervalHandler = setInterval(function() {
                        __updateDots(matchedObject, options);
                    }, 500);

            // shows the window mask
            mask.fadeIn(250);

            // sets the interval handler in the mask
            mask.data("interval_handler", intervalHandler)
        };

        var _hideMask = function(matchedObject, options) {
            // retrieves the window mask
            var mask = jQuery(".window-mask", matchedObject);

            // retrieves the interval handler
            var intervalHandler = mask.data("interval_handler");
            window.clearInterval(intervalHandler);

            // hides the window mask
            mask.fadeOut(250);
        };

        var _positionWindow = function(matchedObject, options) {
            // centers the matched object (window)
            matchedObject.uxcenter();
        };

        var _resizeMask = function(matchedObject, options) {
            // retrieves the window mask
            var mask = jQuery(".window-mask", matchedObject);

            // retrieves the matched object dimensions
            var matchedObjectWidth = matchedObject.width();
            var matchedObjectHeight = matchedObject.height();

            // sets the mask dimensions
            mask.width(matchedObjectWidth);
            mask.height(matchedObjectHeight);
        };

        var __updateDots = function(matchedObject, options) {
            // retrieves the window mask dots
            var windowMaskDots = jQuery(".window-mask-dots", matchedObject);

            // retrieves the window mask dots contents and length
            var windowMaskDotsContents = windowMaskDots.html();
            windowMaskDotsContentsLength = windowMaskDotsContents.length;

            // in case the dots contents length overflows
            if (windowMaskDotsContentsLength == 3) {
                // resets the dots contents length
                windowMaskDotsContentsLength = 0;
            }
            // otherwise it's a normal increments of dots
            else {
                // increments the dots contents length
                windowMaskDotsContentsLength++;
            }

            // starts the "new" window mask dots contentes
            var windowMaskDotsContents = "";

            // iterates over the dots contents range
            for (index = 0; index < windowMaskDotsContentsLength; index++) {
                // adds a new dot to the contents
                windowMaskDotsContents += "."
            }

            // updates the window mask dots contents
            windowMaskDots.html(windowMaskDotsContents)
        };

        // switches over the method
        switch (method) {
            case "show" :
                // shows the matched object
                _show(matchedObject, options);

                // breaks the switch
                break;

            case "hide" :
                // hides the matched object
                _hide(matchedObject, options);

                // breaks the switch
                break;

            case "show_mask" :
                // shows the mask in the matched object
                _showMask(matchedObject, options);

                // breaks the switch
                break;

            case "hide_mask" :
                // hide the mask in the matched object
                _hideMask(matchedObject, options);

                // breaks the switch
                break;

            case "default" :
                // initializes the plugin
                initialize();

                // breaks the switch
                break;
        }

        // returns the object
        return this;
    };
})(jQuery);
