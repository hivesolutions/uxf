/**
 * jQuery overlay panel plugin, this jQuery plugin provides the base
 * infra-structure for the creation of an overlay panel component.
 *
 * @name uxf-overlay-panel.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2018 Hive Solutions Lda.
 * @license Apache License, Version 2.0 - http://www.apache.org/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxoverlaypanel = function(options) {
        // the default values for the plugin
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
            // iterates over all the elements in the matched object
            matchedObject.each(function(index, element) {
                // retrieves the element reference
                var _element = jQuery(element);

                // retrieves the vertical offset and
                // parses it as a float
                var offset = _element.attr("data-offset");
                var offsetFloat = parseFloat(offset);

                // centers the matched object with the
                // current vertical offset in percentage
                _element.uxcenter(offsetFloat);
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the reference to both the window
            // and the body global elements
            var _window = jQuery(window);
            var _body = jQuery("body");

            // tries to retrieve the global overlay element in case it
            // does not exists creates a new element and then appends it
            // to the current body element (default action)
            var overlay = jQuery(".overlay:first");
            if (overlay.length === 0) {
                var _body = jQuery("body");
                overlay = jQuery("<div id=\"overlay\" class=\"overlay\"></div>");
                overlay.uxoverlay();
                _body.prepend(overlay);
            }

            // registers for the click event on the element
            // to aovid propagation
            matchedObject.click(function(event) {
                // stops the event propagation, no need
                // to propagate clicks to the upper levels
                event.stopPropagation();
            });

            // registers for the show event and if it's
            // triggered the show function is called for the
            // associated element (indirect show)
            matchedObject.bind("show", function() {
                // retrieves the current elemenet and runs the hide
                // operation in it (to hide it)
                var element = jQuery(this);
                _show(element, options);
            });

            // registers for the hide event and if it's
            // triggered the hide function is called for the
            // associated element (indirect hide)
            matchedObject.bind("hide", function() {
                // retrieves the current elemenet and runs the hide
                // operation in it (to hide it)
                var element = jQuery(this);
                _hide(element, options);
            });

            // registers for the collect event and if it's
            // triggered the collect operation should run
            matchedObject.bind("collect", function() {
                // retrieves the current element for the event
                // and runs the appropriate collect operation
                var element = jQuery(this);
                _collect(element, options);
            });

            // registers for the animation end event so that if
            // the curernt object is in a invible mode it is gc
            matchedObject.bind("animationend", function() {
                // retrieves the current element for the event
                // and runs the appropriate collect operation
                var element = jQuery(this);
                _collect(element, options);
            });

            // iterates over all the elements in the matched object
            // so that one on one events may be registered
            matchedObject.each(function(index, element) {
                // retrieves the element reference
                var _element = jQuery(element);

                // retrieves the vertical offset and
                // parses it as a float
                var offset = _element.attr("data-offset");
                var offsetFloat = parseFloat(offset);

                // retrieves the (ctrl) key and
                // parses it as an integer
                var key = _element.attr("data-key");
                var keyInteger = parseInt(key);
                var keyIsNaN = isNaN(keyInteger);

                // registers for the click event in the element
                _element.click(function(event) {
                    // stops the event propagation
                    // (avoids the faulty closing of the window)
                    event.stopPropagation();
                });

                // registers for the control key combination
                // in the global scope
                !keyIsNaN && jQuery.uxctrl(keyInteger, function() {
                    // checks if the element is visible
                    var elementVisible = _element.hasClass("visible");

                    // in case the element is visible, must hide hide
                    // in order to toggel visibility
                    if (elementVisible) {
                        _hide(_element, options);
                    }
                    // otherwise the element must be invisible and then
                    // it must be shown in the screen
                    else {
                        _show(_element, options);
                    }
                });

                // registers the resize in the window
                _window.resize(function(event) {
                    // centers the current element with the
                    // current vertical offset in percentage
                    _element.uxcenter(offsetFloat);
                });

                // registers the scroll in the window
                _window.scroll(function() {
                    // centers the current element with the
                    // current vertical offset in percentage
                    _element.uxcenter(offsetFloat);
                });

                // registers for the global hide modal event
                // so that the overlay panel is properly hidden
                _body.bind("hide_modal", function() {
                    // runs the hide operation for the current
                    // overlay panel under a clojure
                    _hide(_element, options);
                });

                // registers for the (pre) hide event in the overlay
                // so that the current element is also hidden
                overlay.bind("pre_hide", function() {
                    // checks if the element is visible and in case
                    // the element is not visible returns immediately,
                    // nothing pending to be done
                    var elementVisible = _element.hasClass("visible");
                    if (!elementVisible) {
                        return;
                    }

                    // hides the element, using the proper strategy
                    // to perform such operation
                    _hide(_element, options);
                });

                // registers for the click event on the overlay panel
                // to hide the current overlay panel
                overlay.click(function() {
                    // checks if the element is visible and in case
                    // the element is not visible returns immediately,
                    // nothing pending to be done
                    var elementVisible = _element.hasClass("visible");
                    if (!elementVisible) {
                        return;
                    }

                    // hides the element, using the proper strategy
                    // to perform such operation
                    _hide(_element, options);
                });
            });
        };

        var _show = function(matchedObject, options) {
            // retrieves the reference to the top level body element
            // that is going to be used for global operations
            var _body = jQuery("body");

            // verifies if the current window is already visible and
            // if that's the case returns immediately, as there's nothing
            // pending to be performed (as expected)
            var isVisible = matchedObject.hasClass("visible");
            if (isVisible) {
                return;
            }

            // triggers the hide modal event that is going to ensure
            // that no modal windows are present in the screen
            _body.triggerHandler("hide_modal");

            // retrieves the vertical offset and parses it
            // as a float to be used in the center operation
            var offset = matchedObject.attr("data-offset");
            var offsetFloat = parseFloat(offset);

            // retrieves eventual items of the overlay panel,
            // including a text field value
            var textField = jQuery(".text-field", matchedObject);

            // retrieves the overlay element and forces a resize
            // on it to ensure dimensions (ensures proper size)
            var overlay = jQuery(".overlay:first");
            overlay.trigger("resize");

            // centers the object in the screen, this is required
            // in order to avoid init glitches that would be created
            // for situations where theres an offscreen resize
            matchedObject.uxcenter(offsetFloat);

            // runs the collect operation on the current element to
            // restore it to a base state (so that it can be used)
            _collect(matchedObject, options);

            // toggles the multiple classes of the object so that
            // it may become visible (as expected)
            matchedObject.addClass("visible");

            // tries to retrieve the total duration of the animation
            // for the matched overlay (may be zero), and uses the value
            // in the hide operation of the overlay
            var duration = __duration(matchedObject);
            var timing = __timing(matchedObject);
            overlay.triggerHandler("show", [duration / 1.25, null, null, timing]);

            // focus in the text field as this is the default behaviour
            // to be executed uppon showing the overlay panel, note that
            // if no text field exists nothing happens
            textField.focus();

            // thiggers the shown event indicating that the overlay panel
            // has just finished beeing shown
            matchedObject.triggerHandler("shown");
        };

        var _hide = function(matchedObject, options) {
            // verifies if the current window is already invisible and
            // if that's the case returns immediately, as there's nothing
            // pending to be performed (as expected)
            var isVisible = matchedObject.hasClass("visible");
            if (!isVisible) {
                return;
            }

            // retrieves the overlay element
            var overlay = jQuery(".overlay:first");

            // toggles the multiple classes of the object so that
            // it may become invisible (as expected)
            matchedObject.removeClass("visible");
            matchedObject.addClass("invisible");
            matchedObject.addClass("gc");

            // tries to retrieve the total duration of the animation
            // for the matched window (may be zero), and uses the value
            // in the hide operation of the overlay
            var duration = __duration(matchedObject);
            var timing = __timing(matchedObject);
            overlay.triggerHandler("hide", [duration / 0.75, timing]);

            // in case no animation exists (no duration) then runs the
            // (garbage) collect operation immediately
            if (!duration) {
                _collect(matchedObject, options);
            }

            // triggers the hidden event indicating that the overlay panel
            // has just finished being hidden as expected by the specification
            matchedObject.triggerHandler("hidden");
        };

        var _collect = function(matchedObject, options) {
            // verifies that the current object is meant to be collected
            // and if that's not the case returns immediately
            if (!matchedObject.hasClass("gc")) {
                return;
            }

            // removes the complete set of classes from the current
            // element so that it's restored to the original state
            matchedObject.removeClass("visible");
            matchedObject.removeClass("invisible");
            matchedObject.removeClass("gc");
        };

        var __duration = function(element) {
            // computes the duration in milliseconds extracting it
            // from the associated css property
            var duration = element.css("animation-duration");
            duration = duration ? parseFloat(duration) : 0;
            duration = duration * 1000;
            return duration;
        };

        var __timing = function(element) {
            // computes the timing function for  animation extracting it
            // from the associated css property
            var timing = element.css("animation-timing-function");
            return timing;
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
