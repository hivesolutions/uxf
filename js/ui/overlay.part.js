/**
 * jQuery overlay plugin, this jQuery plugin provides the base infra-structure
 * for the creation of an overlay component.
 *
 * @name jquery-overlay.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @date March 10, 2010
 * @category jQuery plugin
 * @copyright Copyright (c) 2010-2012 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxoverlay = function(options) {
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
            // resizes the overlay in the screen
            _resizeOverlay(matchedObject, options);
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
                        _resizeOverlay(matchedObject, options);
                    });

            // registers the laod event in the window, avoids
            // possible initial resize problem
            _window.load(function(event) {
                        // resizes the overlay in the screen
                        _resizeOverlay(matchedObject, options);
                    });

            // registers the resize in the window
            _window.resize(function(event) {
                        // resizes the overlay in the screen
                        _resizeOverlay(matchedObject, options);
                    });

            // registers for the click event so that
            // no propagation of it is done
            matchedObject.click(function(event) {
                        // stops the event propagation, no need to propagate
                        // clicks to the upper levels
                        event.stopPropagation();
                    });

            // registers for the resize event on the overlayy
            // so that the overlay may be resized in for such events
            matchedObject.bind("resize", function() {
                        // retrieves teh current element
                        var element = jQuery(this);

                        // resizes the overlay in the screen
                        _resizeOverlay(element, options);
                    });
        };

        var _resizeOverlay = function(matchedObject, options) {
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
            var documentWidth = jQuery.browser.msie
                    ? _window.width()
                    : _document.width();
            var documentHeight = _document.height();

            // sets the "new" matched object dimensions,
            // using the document as reference
            matchedObject.width(documentWidth);
            matchedObject.height(documentHeight);
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
