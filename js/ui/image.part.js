/**
 * jQuery image plugin, this jQuery plugin provides the base infra-structure for
 * the creation of a image component.
 *
 * @name jquery-image.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2015 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function(jQuery) {
    jQuery.fn.uximage = function(method, options) {
        // the default values for the image
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
        var _appendHtml = function() {};

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the reference to the top level body element
            // to be used in the enabling of the lightbox
            var _body = jQuery("body");

            // registers for the click event on the image to try to show
            // the associated lightbox
            matchedObject.click(function() {
                // retrieves the element and then uses it to retrieve
                // the associated lightbox path
                var element = jQuery(this);
                var lightboxPath = element.attr("data-lightbox_path");
                var lightboxLargePath = element.attr("data-lightbox_large_path");
                var animated = element.hasClass("lightbox-animated");

                // in case the lightbox path is not defined
                // no need to show the lightbox
                if (!lightboxPath) {
                    // returns immediately
                    return;
                }

                // shows the lightbox on the body element using the
                // lightbox path retrieved from the image, note that
                // the animation flag is controlled by class presence
                _body.uxlightbox(lightboxPath, null, lightboxLargePath, {
                    animated: animated
                });
            });
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
