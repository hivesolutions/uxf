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
            // localizes the cancel value that is going to be used
            // as the label of the cancel link of the overlay search
            var cancel = jQuery.uxlocale("Cancel");

            // iterates over all the elements in the matched object
            matchedObject.each(function(index, element) {
                // retrieves the element reference
                var _element = jQuery(element);

                // tries to retrieve the cancel link of the overlay search
                // and in case it does not exists creates a new one, used
                // to hide the overlay search in devices that have no escape
                // key (eg: phones), shown only for them by the style
                var cancelLink = jQuery(".overlay-search-cancel", _element);
                if (cancelLink.length === 0) {
                    cancelLink = jQuery(
                        '<a class="link link-blue overlay-search-cancel">' + cancel + "</a>"
                    );
                    _element.append(cancelLink);
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

            // retrieves the cancel link for the matched object
            var cancelLink = jQuery(".overlay-search-cancel", matchedObject);

            // registers for the click event in the cancel link
            // to hide the overlay search, as the escape key does
            cancelLink.click(function() {
                // retrieves the element
                var element = jQuery(this);

                // retrieves the parent overlay search
                var overlaySearch = element.parents(".overlay-search");

                // hides the overlay search
                _hide(overlaySearch, options);
            });
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
