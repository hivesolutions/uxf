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
            timeout: 7500
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
            // shown (eg: bottom-left or top-center), defaulting to the bottom
            // left corner of the window
            var small = options.small;
            var position = options.position || "bottom-left";

            // retrieves the flag that controls if the notification is silent
            // (no sound) and the sounds of the notifications by their type,
            // from the matched object, that may contain them (none by default)
            var silent = options.silent;
            var sounds = matchedObject.data("notification_sounds") || {};

            // retrieves the timeout to be used in the notification
            // from the options
            var timeout = options.timeout;

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

            // marks the notification as shown once it has entered, so that
            // showing the page again doesn't run its entering once more
            _show(messageElement);

            // plays the sound of the type of the notification (the one of the
            // information when it has no type), unless the notification is
            // silent or there's no sound for its type
            var sound = sounds[type || "information"];
            !silent && sound && _playSound(sound);

            // starts the notification element as button so
            // that any link in it is defined as target
            link && messageElement.addClass("button");
            link && messageElement.attr("data-link", link);
            link && messageElement.uxbutton();

            // sets the timeout for hiding the notification, once
            // the final timeout of the message has been reached
            setTimeout(function() {
                _hide(messageElement);
            }, timeout);

            // registers for the click event on the created
            // message element so that it's hidden when a
            // click occurs in it (as expected)
            messageElement.click(function() {
                var element = jQuery(this);
                _hide(element);
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {};

        /**
         * Marks the provided notification element as shown once its animations
         * of entering have ended, so that it's no longer animated, as the
         * animations of the elements of a page run once more when the page is
         * shown again (eg: once hidden while its contents are replaced).
         *
         * @param {Element}
         *            element The notification element to be marked as shown.
         */
        var _show = function(element) {
            // in case the notification has no animation of entering (eg: with
            // the animations disabled) there's nothing to be run again, so it's
            // left as it is
            if (!__duration(element, "animation-duration")) {
                return;
            }

            // counts the ends of the animations of entering (one per animation,
            // eg: the slide and the fade), marking the notification as shown once
            // all of them have ended, unless it's leaving (its animations of
            // entering replaced by the ones of leaving)
            var pending = element.css("animation-name").split(",").length;
            element.bind("animationend", function() {
                if (element.hasClass("invisible")) {
                    return;
                }
                pending--;
                pending === 0 && element.addClass("shown");
            });
        };

        /**
         * Hides the provided notification element, running its animation of
         * leaving (if any) and then closing the room it leaves in its stack,
         * so that the other notifications glide into it, removing it once
         * the room is closed (at once in case there's no animation).
         *
         * @param {Element}
         *            element The notification element to be hidden.
         */
        var _hide = function(element) {
            // verifies if the notification is already being hidden and if
            // that's the case returns immediately, as its hiding is pending
            if (element.hasClass("invisible")) {
                return;
            }

            // marks the notification as invisible, so that its animation of
            // leaving runs, and in case it has no animation (eg: with the
            // animations disabled) removes it immediately
            element.addClass("invisible");
            if (!__duration(element, "animation-duration")) {
                element.remove();
                return;
            }

            // sets the current height of the notification as its height, so
            // that the closing of its room (once it has left) transitions from
            // it, as an automatic height doesn't transition
            element.css("height", element.height() + "px");

            // counts the ends of the animations of leaving (one per animation,
            // eg: the slide and the fade), closing the room of the notification
            // once all of them have ended
            var names = element.css("animation-name").split(/,\s*/);
            var pending = names.length;
            element.bind("animationend", function() {
                pending--;
                pending === 0 && _collapse(element);
            });

            // removes the notification at once in case its leaving is cancelled
            // (eg: the page hidden while its contents are replaced), as it would
            // run once more when the page is shown again, the cancel of its
            // entering (replaced by its leaving) being ignored
            element.bind("animationcancel", function(event) {
                var name = event.originalEvent ? event.originalEvent.animationName : null;
                names.indexOf(name) !== -1 && element.remove();
            });
        };

        /**
         * Closes the room of the provided (invisible) notification element in
         * its stack, from its current height to none, removing it once the
         * room is closed (at once in case there's no transition).
         *
         * @param {Element}
         *            element The notification element to be collapsed.
         */
        var _collapse = function(element) {
            // marks the notification as collapsed, so that its room closes
            // from the height set when it started leaving to none, the height
            // being set as well, as the one set (in the element) takes the
            // precedence over the one of the style
            element.addClass("collapsed");
            element.css("height", "0px");

            // removes the notification once its room is closed, once its closing
            // is cancelled or once its leaving runs again (both by the page
            // hidden and shown again, as some browsers run the finished
            // animations once more instead), or at once in case there's no
            // transition of its room
            if (!__duration(element, "transition-duration")) {
                element.remove();
                return;
            }
            element.one("transitionend transitioncancel animationstart", function() {
                element.remove();
            });
        };

        /**
         * Plays the sound in the provided URL on a new audio element, so that
         * the sounds of consecutive notifications don't cut each other.
         *
         * @param {String}
         *            sound The URL of the sound to be played.
         */
        var _playSound = function(sound) {
            // creates the audio element of the sound and plays it, ignoring a
            // refused play (eg: the browser refuses to play a sound before any
            // interaction with the page), as the sound only complements the
            // notification
            var audio = jQuery("<audio></audio>");
            audio.attr("src", sound);
            var promise = audio[0].play();
            promise && promise.catch(function() {});
        };

        /**
         * Retrieves the duration (in milliseconds) of the provided property
         * of the element (eg: its animation or transition duration), the
         * longest one in case the property has several durations.
         *
         * @param {Element}
         *            element The element whose duration is retrieved.
         * @param {String}
         *            name The name of the property of the duration.
         * @return {Number} The duration in milliseconds, zero in case the
         *         element has none.
         */
        var __duration = function(element, name) {
            var durations = (element.css(name) || "").split(",");
            var duration = 0;
            for (var index = 0; index < durations.length; index++) {
                duration = Math.max(duration, parseFloat(durations[index]) || 0);
            }
            return duration * 1000;
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
