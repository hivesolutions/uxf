/**
 * jQuery overlay panel plugin, this jQuery plugin provides the base
 * infra-structure for the creation of an overlay panel component.
 *
 * @name jquery-overlay-panel.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @date March 10, 2010
 * @category jQuery plugin
 * @copyright Copyright (c) 2010 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function($) {
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
                        matchedObject.uxcenter(offsetFloat);
                    });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the window
            var _window = jQuery(window);

            // retrieves the current "global" overlay
            var overlay = jQuery(".overlay");

            // registers for the click event on the element
            // to aovid propagation
            matchedObject.click(function(event) {
                        // stops the event propagation, no need
                        // to propagate clicks to the upper levels
                        event.stopPropagation();
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

                                    // in case the element is visible
                                    if (elementVisible) {
                                        // hides the current element
                                        _hide(_element, options);
                                    }
                                    // otherwise the element must be invisible
                                    else {
                                        // shows the current element
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

                        // registers for the click in the overlay
                        overlay.click(function() {
                                    // checks if the element is visible
                                    var elementVisible = _element.is(":visible");

                                    // in case the element is not visible
                                    if (!elementVisible) {
                                        // returns immediately
                                        return;
                                    }

                                    // hides the element
                                    _hide(_element, options);
                                });
                    });
        };

        var _show = function(matchedObject, options) {
            // retrieve eventual items of the
            // overlay panel
            var textField = jQuery(".text-field", matchedObject);

            // retrieves the overlay element and forces a resize
            // on it to ensure dimensions (ensures proper size)
            var overlay = jQuery(".overlay");
            overlay.trigger("resize");

            // shows the overlay
            overlay.fadeIn(100);

            // shows the matched object
            matchedObject.fadeIn(100);

            // focus in the text field
            textField.focus();
        };

        var _hide = function(matchedObject, options) {
            // retrieves the overlay element
            var overlay = jQuery(".overlay");

            // shows the overlay
            overlay.fadeOut(200);

            // hidrs the matched object
            matchedObject.fadeOut(200);
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
