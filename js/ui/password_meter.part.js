(function($) {
    jQuery.fn.uxpasswordmeter = function(options) {
        // the various regex values for password
        // strength validation
        var NUMBER_REGEX = new RegExp("\\d+");
        var LETTER_LOWER_REGEX = new RegExp("[a-z]");
        var LETTER_UPPER_REGEX = new RegExp("[A-Z]");
        var SPECIAL_CHARACTER_REGEX = new RegExp("[.[!,@,#,$,%,^,&,*,?,_,~,-,£,(,)]");

        // the default values for the name change
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
            // iterates over all the elements in the matched object
            matchedObject.each(function(index, element) {
                // retrieves the element reference
                var _element = jQuery(element);

                // adds some html to the password meter
                _element.append("<div class=\"password-meter-contents level-0\"></div>")

                // sets the initial data in the element
                _element.data("level", 0);
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // iterates over all the elements in the matched object
            matchedObject.each(function(index, element) {
                // retrieves the element reference
                var _element = jQuery(element);

                // retrieves the password meter contents
                var passwordMeterContents = jQuery(".password-meter-contents",
                        _element);

                // retrieves the target reference and then
                // retrieves the target element
                var target = _element.attr("data-target");
                var targetElement = jQuery(target);

                // binds the target element reference to the value change
                // event (to be notified about text changes)
                targetElement.bind("value_change", function() {
                    // retrieves the current target element value
                    var targetElementValue = targetElement.attr("data-value");

                    // retrieves the current level
                    var level = _element.data("level");

                    // calculates the password strength for the current
                    // target element value
                    var passwordStrength = _passwordStrength(targetElementValue);

                    // changes the current level class
                    passwordMeterContents.removeClass("level-" + String(level));
                    passwordMeterContents.addClass("level-"
                            + String(passwordStrength));

                    // updates the level value with the password
                    // strength value
                    _element.data("level", passwordStrength);
                });

            });
        };

        /**
         * Calculates the "theoretical" password strength from the given
         * password. The returned value is an integer ranging from the lowest
         * zero value (unsafest) to a limit value (safest).
         *
         * @param {String}
         *            password The password to be measured for strength.
         * @return {Integer} An integer describing the strength level of the
         *         given password.
         */
        var _passwordStrength = function(password) {
            // starts the strength value
            // counter to the minimum value (zero)
            var strengthValue = 0;

            // retrieves the length of the password
            var passwordLength = password.length;

            // in case the password is not set
            // (empty password)
            if (passwordLength < 1) {
                // returns the strength value
                // immediately
                return strengthValue;
            }

            // increments the strength value
            strengthValue++;

            // in case the password length is less
            // than a minimum of four
            if (passwordLength < 4) {
                // returns the strength value
                // immediately
                return strengthValue;
            }

            // in case the password length is more
            // or equal to eight
            if (passwordLength >= 8) {
                // increments the strength value
                strengthValue++
            }

            // in case the password length is more
            // or equal to eleven
            if (passwordLength >= 11) {
                // increments the strength value
                strengthValue++;
            }

            // in case the password contains at least
            // a number in it
            if (NUMBER_REGEX.test(password)) {
                // increments the strength value
                strengthValue++;
            }

            // in case the password contains both lower case and
            // upper case letters
            if (LETTER_LOWER_REGEX.test(password)
                    && LETTER_UPPER_REGEX.test(password)) {
                // increments the strength value
                strengthValue++;
            }

            // in case the password contains special characters
            // in it (extra security)
            if (SPECIAL_CHARACTER_REGEX.test(password)) {
                // increments the strength value
                strengthValue++;
            }

            // returns the strength value
            return strengthValue;
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
