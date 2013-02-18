/**
 * jQuery header notification plugin, this jQuery plugin provides the base
 * infra-structure for the creation of an header notification component.
 *
 * @name jquery-header-notification.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @date March 10, 2010
 * @category jQuery plugin
 * @copyright Copyright (c) 2010-2012 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxheadernotification = function(options) {
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
            // iterates over all the header notification
            // to check if they are empty (should be hidden)
            matchedObject.each(function(index, element) {
                        // retrieves the element reference
                        var _element = jQuery(element);

                        // retrieves the contents from the element
                        // to check them for text
                        var contents = _element.html();

                        // in case no contents are available
                        // hides the element
                        !contents && _element.hide();
                    });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the window
            var _window = jQuery(window);

            // retrieves the close links for the notification
            var linkClose = jQuery("> .link-close", matchedObject);

            // register for the click event on the link close
            linkClose.click(function() {
                // retrieves the element
                var element = jQuery(this);

                // retrieves the (parent) header notification
                var headerNotification = element.parent(".header-notification");

                // hides the header notification
                headerNotification.hide();
            });
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
