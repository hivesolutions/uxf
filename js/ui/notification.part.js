/**
 * jQuery notification plugin, this jQuery plugin provides the base
 * infra-structure for the creation of a notification component.
 *
 * @name jquery-notification.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @date March 10, 2010
 * @category jQuery plugin
 * @copyright Copyright (c) 2010-2012 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxnotification = function(options) {
        // the default values for the notification
        var defaults = {
            title : "Title",
            message : "Message",
            timeout : 5000,
            fadeTimeout : 500
        };

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
            // retrieves the title and the message
            // from the options
            var title = options["title"];
            var message = options["message"];

            // retrieves the timeout to be used in the notification
            // from the options
            var timeout = options["timeout"];
            var fadeTimeout = options["fadeTimeout"];

            // creates the message element from the html code
            var messageElement = jQuery("<div class=\"notification\">"
                    + "<p class=\"notification-title\">" + title + "</p>"
                    + "<p class=\"notification-text\">" + message + "</p>"
                    + "</div>");

            // adds message element to the matched object
            matchedObject.append(messageElement);

            // sets the timeout for hiding the notification
            setTimeout(function() {
                        // hides the message element
                        messageElement.fadeOut(fadeTimeout);
                    }, timeout);
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
