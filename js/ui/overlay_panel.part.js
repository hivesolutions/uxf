/**
 * jQuery overlay panel plugin, this jQuery plugin provides the base
 * infra-structure for the creation of an overlay panel component.
 *
 * @name jquery-overlay-panel.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @date March 10, 2010
 * @category jQuery plugin
 * @copyright Copyright (c) 2010-2012 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
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
            var overlay = jQuery(".overlay");
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
            // retrieves the vertical offset and parses it
            // as a float to be used in the center operation
            var offset = matchedObject.attr("data-offset");
            var offsetFloat = parseFloat(offset);

            // retrieves eventual items of the overlay panel,
            // including a text field value
            var textField = jQuery(".text-field", matchedObject);

            // retrieves the overlay element and forces a resize
            // on it to ensure dimensions (ensures proper size)
            var overlay = jQuery(".overlay");
            overlay.trigger("resize");

            // centers the object in the screen, this is required
            // in order to avoid init glitches that would be created
            // for situations where theres an offscreen resize
            matchedObject.uxcenter(offsetFloat);

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
