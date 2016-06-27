/**
 * jQuery overlay panel plugin, this jQuery plugin provides the base
 * infra-structure for the creation of an overlay panel component.
 *
 * @name uxf-overlay-panel.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2016 Hive Solutions Lda.
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
            // retrieves the window
            var _window = jQuery(window);

            // tries to retrieve the global overlay element in case it
            // does not exists creates a new element and then appends it
            // to the current body element (default action)
            var overlay = jQuery(".overlay:first");
            if (overlay.length == 0) {
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

            // iterates over all the elements in the matched object
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
                    var elementVisible = _element.is(":visible");

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

                // registers for the (pre) hide event in the overlay
                // so that the current element is also hidden
                overlay.bind("pre_hide", function() {
                    // checks if the element is visible and in case
                    // the element is not visible returns immediately,
                    // nothing pending to be done
                    var elementVisible = _element.is(":visible");
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
                    var elementVisible = _element.is(":visible");
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
            // verifies if the current object is visible and if
            // that's already the case returns immediately
            var visible = matchedObject.data("visible") || false;
            matchedObject.data("visible", true);
            if (visible) {
                return;
            }

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

            // shows the overlay using a fade in approach so that the
            // effect is as smoth as possible and then applies the same
            // fadding effect to the overlay panel, as both the panel
            // and the overlay are going to be shown at the same time
            overlay.triggerHandler("show", [100]);
            matchedObject.fadeIn(100);

            // focus in the text field as this is the default behaviour
            // to be executed uppon showing the overlay panel, note that
            // if no text field exists nothing happens
            textField.focus();

            // thiggers the shown event indicating that the overlay panel
            // has just finished beeing shown
            matchedObject.triggerHandler("shown");
        };

        var _hide = function(matchedObject, options) {
            // verifies if the current object is not visible and if
            // that's already the case returns immediately
            var visible = matchedObject.data("visible") || false;
            matchedObject.data("visible", false);
            if (!visible) {
                return;
            }

            // retrieves the overlay element
            var overlay = jQuery(".overlay:first");

            // hides both the global overlay and the current overlay panel
            // at the same time and using a smoth based effect
            overlay.triggerHandler("hide", [200]);
            matchedObject.fadeOut(200);

            // triggers the hidden event indicating that the overlay panel
            // has just finished being hidden as expected by the specification
            matchedObject.triggerHandler("hidden");
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
