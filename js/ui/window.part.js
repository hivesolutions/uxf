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
(function(jQuery) {
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

            // retrieves the references to both the close and
            // the accept buttons
            var closeButton = jQuery(".close-button", matchedObject);
            var acceptButton = jQuery(".accept-button", matchedObject);

            // registers for the click in the close button
            closeButton.click(function(event) {
                        // retrieves the element and uses it
                        // to retrieve the parent window
                        var element = jQuery(this);
                        var window = element.parents(".window");

                        // hides the window with the success flag
                        // set to invalid
                        _hide(window, options, false);
                    });

            // registers for the click in the accept button
            acceptButton.click(function(event) {
                        // retrieves the element and uses it
                        // to retrieve the parent window
                        var element = jQuery(this);
                        var window = element.parents(".window");

                        // hides the window with the success flag
                        // set to valid
                        _hide(window, options, true);
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
            // retrieves the overlay element and in case it's not present
            // creates a default element adding it to the start of the
            // top level body element (default behaviour)
            var overlay = jQuery(".overlay");
            if (overlay.length == 0) {
                var _body = jQuery("body");
                overlay = jQuery("<div id=\"overlay\" class=\"overlay\"></div>");
                _body.prepend(overlay);
            }

            // triggers the resize event on the overlay in order
            // to force a resize on it to ensure dimensions
            // (ensures proper "final" size)
            overlay.trigger("resize");

            // makes sure that the current object is the only visible
            // window on the screen (ensures modal visibility)
            var pending = __ensureModal(matchedObject, options);
            if (pending) {
                return;
            }

            // shows the overlay and shows at the same time the
            // current object (window)
            overlay.fadeIn(250);
            matchedObject.fadeIn(250);

            // registers for the click event on the global overlay
            // so that the window hides in such case
            __registerClick(matchedObject, options);

            // registers for the key event for the dismissal
            // of the window on the key press
            __registerKey(matchedObject, options);

            // positions the window in the screen
            _positionWindow(matchedObject, options);

            // starts the various forms components contained
            // in the window should reset the form to its
            // original values and layout
            _startForm(matchedObject, options);

            // triggers the show handler so that any handler
            // may be notified about the visibility change
            matchedObject.triggerHandler("show");
        };

        var _hide = function(matchedObject, options, success) {
            // retrieves the overlay element
            var overlay = jQuery(".overlay");

            // unregisters from the click event on the global overlay
            // so that the windows stop respoding from the event
            __unregisterClick(matchedObject, options);

            // unregisters from the key event for the dismissal
            // of the window on the key press
            __unregisterKey(matchedObject, options);

            // hides the overlay and hides at the same time the
            // current object (window)
            overlay.fadeOut(250);
            matchedObject.fadeOut(250);

            // retrieves the appropriate name for the event to be
            // triggered indiccating the state the window has closed
            var name = success ? "success" : "cancel";

            // triggers the hide handler so that any handler
            // may be notified about the visibility change
            matchedObject.triggerHandler("hide");
            matchedObject.triggerHandler(name);
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

        var _startForm = function(matchedObject, options) {
            // retrieves the complete set of fields (form fields)
            // for the current window and then retrieves the first
            // of these elements (to be focused)
            var fields = matchedObject.uxfields()
            var first = jQuery(fields[0]);

            // resets the complete set of form fields and then
            // focus the control on the first field of the window
            // form, providing a rapid interaction scheme for
            // the end user (form reset operation)
            fields.uxreset();
            first.uxfocus();
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

        var __registerClick = function(matchedObject, options) {
            // retrieves the overlay element and registers for
            // the click event on it in order to hide the current
            // window then stores it in the data element
            var overlay = jQuery(".overlay");
            var handler = function() {
                var isHiddable = matchedObject.hasClass("window-hide");
                if (!isHiddable) {
                    return;
                }
                matchedObject.uxwindow("hide");
            };
            overlay.click(handler);
            matchedObject.data("click_handler", handler);
        };

        var __unregisterClick = function(matchedObject, options) {
            // retrieves the global overlay and the handle to the
            // callback function then unbinds it from the click
            // even on the overlay
            var overlay = jQuery(".overlay");
            var handle = matchedObject.data("click_handler");
            overlay.unbind("click", handle);
        };

        var __registerKey = function(matchedObject, options) {
            // retrieves the reference to the document element
            // and registers for the key press event on it and
            // sets the key handler in handler key for the
            // current matched object
            var _document = jQuery(document);
            var handler = _document.keydown(function(event) {
                        // retrieves the key value
                        var keyValue = event.keyCode
                                ? event.keyCode
                                : event.charCode ? event.charCode : event.which;

                        // switches over the key value
                        switch (keyValue) {
                            case 27 :
                                _hide(matchedObject, options);
                                break;
                        }
                    });
            matchedObject.data("key_handler", handler);
        };

        var __unregisterKey = function(matchedObject, options) {
            // retrieves the reference to the global document
            // element and then unregisters the key down event
            // handler from it (avoid duplicated events)
            var _document = jQuery(document);
            var handle = matchedObject.data("key_handler");
            _document.unbind("keydown", handle);
        };

        var __ensureModal = function(matchedObject, options) {
            // retrieves the current visible set of windows (only
            // one should be visible at a certain time)
            var visibleWindow = jQuery(".window:visible");
            if (visibleWindow.length == 0) {
                return false;
            }

            // hdies the current set of windows that are visible and
            // at the end of the hide operation shows the window
            visibleWindow.fadeOut(150, function() {
                        matchedObject.uxwindow("show");
                    });
            return true;
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
