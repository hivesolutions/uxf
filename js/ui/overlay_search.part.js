if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

/**
 * jQuery overlay search plugin, this jQuery plugin provides the base
 * infra-structure for the creation of an overlay search component.
 *
 * @name uxf-overlay-search.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2024 Hive Solutions Lda.
 * @license Apache License, Version 2.0 - http://www.apache.org/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxoverlaysearch = function(options) {
        // the default values for the plugin
        var defaults = {};

        // sets the default options value
        options = options || {};

        // constructs the options
        options = jQuery.extend(defaults, options);

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
         * Creates the necessary HTML for the component.
         */
        var _appendHtml = function() {
            // iterates over all the elements in the matched object
            matchedObject.each(function(index, element) {
                // retrieves the element reference
                var _element = jQuery(element);

                // tries to retrieve the clear button of the overlay search
                // and in case it does not exists creates a new one, used
                // to clear the text field of the overlay search in devices
                // where it fills the width of the screen (eg: phones), as
                // shown only for them by the style
                var clearButton = jQuery(".overlay-search-clear", _element);
                if (clearButton.length === 0) {
                    clearButton = jQuery('<div class="overlay-search-clear"></div>');
                    _element.append(clearButton);
                }
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the text field for the matched object
            var textField = jQuery(".text-field", matchedObject);

            // registers for the key down event in the overlay
            // search text field
            textField.keydown(function(event) {
                // retrieves the element
                var element = jQuery(this);

                // retrieves the parent overlay search
                var overlaySearch = element.parents(".overlay-search");

                // retrieves the key value
                var keyValue = event.keyCode
                    ? event.keyCode
                    : event.charCode
                    ? event.charCode
                    : event.which;

                // in case the escape key is pressed
                // need to hide the overlay search
                if (keyValue === 27) {
                    // hides the overlay search
                    _hide(overlaySearch, options);
                }
            });

            // retrieves the clear button for the matched object
            var clearButton = jQuery(".overlay-search-clear", matchedObject);

            // registers for the mouse down event in the clear button
            clearButton.mousedown(function(event) {
                // avoids event propagation this way the focus
                // is not lost when clicking on the clear button
                // (this is the desired behavior)
                event.stopPropagation();
                event.preventDefault();
            });

            // registers for the click event in the clear button to
            // clear the overlay search, that remains shown so that
            // a new search may be started right away
            clearButton.click(function() {
                // retrieves the element
                var element = jQuery(this);

                // retrieves the parent overlay search
                var overlaySearch = element.parents(".overlay-search");

                // clears the overlay search
                _clear(overlaySearch, options);
            });
        };

        var _clear = function(matchedObject, options) {
            // retrieves the drop field (if any) and the text
            // field of the overlay search to be cleared
            var dropField = jQuery(".drop-field", matchedObject);
            var textField = jQuery(".text-field", matchedObject);

            // resets the drop field and the text field to their empty
            // state (no value nor results), hiding the (empty) list of
            // the drop field, and then focuses the text field so that
            // a new value may be typed right away
            dropField.uxreset();
            textField.uxreset();
            dropField.triggerHandler("hide_drop");
            textField.focus();
        };

        var _hide = function(matchedObject, options) {
            // retrieves the overlay element, notice that
            // only the first (and major one is selected)
            var overlay = jQuery(".overlay:first");

            // checks if the current component is also an overlay
            // panel, this is going to change the way the hide
            // is going to be performed
            var isOverlayPanel = matchedObject.hasClass("overlay-panel");

            // hides both the overlay and the current
            // object (as expected by the search overlay)
            overlay.triggerHandler("hide", [200]);
            !isOverlayPanel && matchedObject.fadeOut(200);
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
