if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

/**
 * jQuery notification plugin, this jQuery plugin provides the base
 * infra-structure for the creation of a notification component.
 *
 * @name uxf-notification.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2024 Hive Solutions Lda.
 * @license Apache License, Version 2.0 - http://www.apache.org/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxnotification = function(options) {
        // the default values for the notification
        var defaults = {
            title: "Title",
            message: "Message",
            type: null,
            small: false,
            position: "bottom-left",
            timeout: 7500,
            fadeTimeout: 500
        };

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
            // retrieves the title and the message
            // from the options
            var title = options.title;
            var message = options.message;

            // retrieves the (optional) type of the notification, that
            // defines its style (eg: error, warning or success)
            var type = options.type;

            // retrieves the flag that controls if the notification is the
            // small (compact) one and the position of the window where it's
            // shown (eg: bottom-left or top-center)
            var small = options.small;
            var position = options.position;

            // retrieves the timeout to be used in the notification
            // from the options
            var timeout = options.timeout;
            var fadeTimeout = options.fadeTimeout;

            // retrieves the optional link element that
            // defines the target for a click in the notification
            var link = options.link;

            // tries to retrieve the stack of the notifications of the position,
            // that holds them, in case it does not exists creates a new one
            // and appends it to the matched object (default action)
            var stack = jQuery("> .notifications-stack." + position, matchedObject);
            if (stack.length === 0) {
                stack = jQuery('<div class="notifications-stack"></div>');
                stack.addClass(position);
                matchedObject.append(stack);
            }

            // creates the message element from the HTML code
            // that is going to be used as the base for display
            var messageElement = jQuery(
                '<div class="notification">' +
                    '<p class="notification-title">' +
                    title +
                    "</p>" +
                    '<p class="notification-text">' +
                    message +
                    "</p>" +
                    "</div>"
            );

            // adds the type and the small flag of the notification as classes
            // of the message element, so that it's styled accordingly
            type && messageElement.addClass(type);
            small && messageElement.addClass("small");

            // adds message element to the stack of the notifications
            // making it ready in ters of visual display (ui display)
            stack.append(messageElement);

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
            messageElement.click(function() {
                var element = jQuery(this);
                element.fadeOut(fadeTimeout, function() {
                    element.remove();
                });
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {};

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
