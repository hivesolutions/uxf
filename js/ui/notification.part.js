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
            timeout : 7500,
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

            // retrieves the optional link element that
            // defines the target for a click in the notification
            var link = options["link"];

            // creates the message element from the html code
            // that is going to be used as the base for display
            var messageElement = jQuery("<div class=\"notification\">"
                    + "<p class=\"notification-title\">" + title + "</p>"
                    + "<p class=\"notification-text\">" + message + "</p>"
                    + "</div>");

            // adds message element to the matched object making
            // it ready in ters of visual display (ui display)
            matchedObject.append(messageElement);

            // starts the notification element as button so
            // that any link in it is defined as target
            link && messageElement.addClass("button");
            link && messageElement.attr("data-link", link);
            link && messageElement.uxbutton();

            // sets the timeout for hiding the notification, once
            // the final timeout of the message has been reached
            setTimeout(function() {
                        messageElement.fadeOut(fadeTimeout, function() {
                                    messageElement.remove();
                                });
                    }, timeout);

            // registers for the click event on the created
            // message element so that it fades out when a
            // click occurs in it (as expected)
            link && messageElement.click(function() {
                        var element = jQuery(this);
                        element.fadeOut(fadeTimeout, function() {
                                    element.remove();
                                });
                    });
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
