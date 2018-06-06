if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

/**
 * jQuery header notification plugin, this jQuery plugin provides the base
 * infra-structure for the creation of an header notification component.
 *
 * @name uxf-header-notification.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2018 Hive Solutions Lda.
 * @license Apache License, Version 2.0 - http://www.apache.org/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxheadernotification = function(options) {
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
            // retrieves the close links for the notification and the
            // set of header notitications that are meant to be closable
            var linkClose = jQuery("> .link-close", matchedObject);
            var closables = matchedObject.filter(".link-close");

            // register for the click event on the link close
            linkClose.click(function() {
                // retrieves the element
                var element = jQuery(this);

                // retrieves the (parent) header notification and then
                // hides it according to the defined specification
                var headerNotification = element.parent(".header-notification");
                headerNotification.hide();
            });

            // registers for the click event on the set of closable
            // notifications (registers for such)
            closables.click(function() {
                // retrieves the element and then hides it in accordance
                // with the current specification
                var element = jQuery(this);
                element.hide();
            });
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
