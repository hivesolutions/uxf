/**
 * jQuery overlay plugin, this jQuery plugin provides the base infra-structure
 * for the creation of an overlay component.
 *
 * @name jquery-overlay.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2016 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxoverlay = function(options) {
        // the extra value (defined in milliseconds) that is going to be
        // added to the base transition time for the garbage collector
        var EXTRA_GC = 50;

        // the default values for the overlay
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
            // resizes the overlay in the screen, this is the initial
            // operation so that it becomes of the correct size, then
            // adds the resizable class to the current element to identify
            // the element as an element that is meant to be resizes, this
            // is imporant to avoid error in the resize operations
            _resize(matchedObject, options);
            matchedObject.addClass("resizable");

            // iterates over the complete set of overlay elements to be
            // able to resets each of the elements to the original/expected
            // values so that a proper rendering is possible
            matchedObject.each(function(index, element) {
                var _element = jQuery(this);
                setTimeout(function() {
                    _reset(_element, options);
                });
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the window
            var _window = jQuery(window);

            // registers the ready event in the window, avoids
            // possible initial resize problem
            _window.ready(function(event) {
                // resizes the overlay in the screen
                _resize(matchedObject, options);
            });

            // registers the laod event in the window, avoids
            // possible initial resize problem
            _window.load(function(event) {
                // resizes the overlay in the screen
                _resize(matchedObject, options);
            });

            // registers the resize in the window, this is a custom
            // event triggered at the correct timing of the window
            // sizing workflow, this will trigger a delayed based
            // resizing operation on the oeverlay element
            _window.bind("size", function(event) {
                // resizes the overlay in the screen
                _resizeDelay(matchedObject, options);
            });

            // registers for the click event so that
            // no propagation of it is done
            matchedObject.click(function(event) {
                // stops the event propagation, no need to propagate
                // clicks to the upper levels
                event.stopPropagation();
            });

            // registers for the toggle (visibility) event so that the proper
            // hide operation is performed in the associated overlay
            matchedObject.bind("toggle", function(event, timeout) {
                var element = jQuery(this);
                _toggle(element, options, timeout);
            });

            // registers for the show event so that the proper
            // hide operation is performed in the associated overlay
            matchedObject.bind("show", function(event, timeout) {
                var element = jQuery(this);
                _show(element, options, timeout);
            });

            // registers for the hide event so that the proper
            // hide operation is performed in the associated overlay
            matchedObject.bind("hide", function(event, timeout) {
                var element = jQuery(this);
                _hide(element, options, timeout);
            });

            // registers for the resize event on the overlayy
            // so that the overlay may be resized in for such events
            matchedObject.bind("resize", function() {
                // retrieves teh current element and uses it
                // resize the overlay in the screen
                var element = jQuery(this);
                _resize(element, options);
            });

            // registers for the transition end envet so that the
            // visual state of the element is properly updated
            matchedObject.bind("transitionend", function(event) {
                var element = jQuery(this);
                var transition = element.data("transition");
                if (transition != "fadeout") {
                    return;
                }
                element.hide();
                element.removeData("transition");
            });
        };

        var _toggle = function(matchedObject, options, timeout) {
            // in case the matched object is visible hides the
            // overlay otherwise shows it (opposite operation)
            if (matchedObject.is(":visible")) {
                _hide(matchedObject, options, timeout);
            } else {
                _show(matchedObject, options, timeout);
            }
        };

        var _show = function(matchedObject, options, timeout) {
            // shows the matched object and then runs
            // the show operation for the overlay element
            _resize(matchedObject, options);
            __fadeIn(matchedObject, options, timeout || 250);
        };

        var _hide = function(matchedObject, options, timeout) {
            // hides the matched object, using the default
            // strategy for such operation (as expected)
            __fadeOut(matchedObject, options, timeout || 100);
        };

        var _reset = function(matchedObject, options) {
            // verifies if the current element is visible (block),
            // retrieving then the opcity value of it so that's it's
            // considered the original value (to be restored latter)
            // then and in case the element is invisible sets the
            // opacity to the default zero value (for animation)
            var isVisible = matchedObject.css("display") == "block";
            var target = matchedObject.css("opacity") || "1";
            var targetF = parseFloat(target);
            matchedObject.data("original", targetF);
            !isVisible && matchedObject.css("opacity", "0");
        };

        var _resize = function(matchedObject, options) {
            // retrieves the document and the window
            // element references
            var _document = jQuery(document);
            var _window = jQuery(window);

            // resets the dimensions of the overlay
            // to avoid problems in the document size
            matchedObject.width(0);
            matchedObject.height(0);

            // retrieves the document dimensions, in case
            // the current browser is the internet explorer
            // the window width is used (to avoid the well
            // internet explorer's overflow width bug)
            var documentWidth = jQuery.browser.msie ? _window.width() : _document.width();
            var documentHeight = _document.height();

            // sets the "new" matched object dimensions,
            // using the document as reference
            matchedObject.width(documentWidth);
            matchedObject.height(documentHeight);
        };

        var _resizeDelay = function(matchedObject, options) {
            setTimeout(function() {
                _resize(matchedObject, options);
            });
        };

        var __fadeIn = function(matchedObject, options, timeout, useHardware) {
            var _body = jQuery("body");
            useHardware = useHardware || _body.data("transition-f");
            matchedObject.data("transition", "fadein");
            if (useHardware) {
                var original = matchedObject.data("original");
                __transition(matchedObject, options, timeout);
                matchedObject.show();
                setTimeout(function() {
                    matchedObject.css("opacity", String(original));
                });
            } else {
                matchedObject.css("opacity", "");
                __transitionUnset(matchedObject, options);
                matchedObject.fadeIn(timeout, function() {
                    matchedObject.removeData("transition");
                });
            }
        };

        var __fadeOut = function(matchedObject, options, timeout, useHardware) {
            var _body = jQuery("body");
            useHardware = useHardware || _body.data("transition-f");
            matchedObject.data("transition", "fadeout");
            if (useHardware) {
                __transition(matchedObject, options, timeout);
                matchedObject.css("opacity", "0");
            } else {
                matchedObject.css("opacity", "");
                __transitionUnset(matchedObject, options);
                matchedObject.fadeOut(timeout, function() {
                    matchedObject.removeData("transition");
                });
            }

            // creates the timeout for the operation that will run the
            // "garbage collection" for the transition values, this is
            // required to avoid situations where the overlay would stay
            // displayed in the dom as a "invisible" overlay
            setTimeout(function() {
                var transition = matchedObject.data("transition");
                if (transition != "fadeout") {
                    return;
                }
                matchedObject.hide();
                matchedObject.removeData("transition");
            }, timeout + EXTRA_GC)
        };

        var __transition = function(matchedObject, options, timeout) {
            var value = "opacity " + String(timeout) + "ms ease-in-out";
            matchedObject.css("transition", value);
            matchedObject.css("-o-transition", value);
            matchedObject.css("-ms-transition", value);
            matchedObject.css("-moz-transition", value);
            matchedObject.css("-webkit-transition", value);
        };

        var __transitionUnset = function(matchedObject, options) {
            matchedObject.css("transition", "");
            matchedObject.css("-o-transition", "");
            matchedObject.css("-ms-transition", "");
            matchedObject.css("-moz-transition", "");
            matchedObject.css("-webkit-transition", "");
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
