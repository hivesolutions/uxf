if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

(function(jQuery) {
    jQuery.fn.uxscan = function(element, options) {
        // the ammount of time to considered between letter sending any letter
        // sending in bettwen this value is discarded, This value should be
        // small enought do discard the keyboard presses
        var LETTER_INTERVAL = 80;

        // the ration value to be used to calculate the complete interval for
        // the word based on the length of it (in letters), this value is going
        // to be multiplied by the letter interval
        var WORD_RATIO = 0.8;

        // the ammount of time to considered between scannings any scanning in
        // bettwen this value is discarded
        var SCAN_INTERVAL = 400;

        // the minimum length of the sequence to be consdiered a valid scan
        // value
        var MINIMUM_LENGTH = 6;

        // the default values for the key
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
        var _appendHtml = function() {};

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the global option
            var global = options["global"] ? options["global"] : true;

            // iterates over all the matched objects
            matchedObject.each(function(index, element) {
                // retrieves the element reference
                var _element = jQuery(element);

                // retrieves the target object base on the global option
                var targetObject = global ? jQuery(document) : _element;

                targetObject.keydown(function(event) {
                    // verifies if the event must be propagated or not
                    _verifyPropagation(targetObject, event);
                });

                targetObject.keypress(function(event) {
                    // verifies if the event must be propagated or not
                    _verifyPropagation(targetObject, event);
                });

                // registers for the key down press in the target
                // object reference
                targetObject.keyup(function(event) {
                    // retrieves the current data and then uses it
                    // to retrieve the current timestamp
                    var currentDate = new Date();
                    var currentTime = currentDate.getTime();

                    // retrieves the various data attribute from the target
                    // object for the scanning
                    var sequence = targetObject.data("sequence") || "";
                    var previousTime = targetObject.data("previous_time") || currentTime;
                    var initialTime = targetObject.data("initial_time") || currentTime;
                    var ignoring = targetObject.data("ignoring") || false;

                    // calculates the delta (difference) value between the
                    // current time and the previous time
                    var delta = currentTime - previousTime;

                    // retrieves the key value for the current event
                    var keyValue = event.keyCode
                        ? event.keyCode
                        : event.charCode
                        ? event.charCode
                        : event.which;

                    // in case the ignoring mode is set need
                    // to check if we can get out of it
                    if (ignoring) {
                        // in case the delta time is less than the
                        // time between scan (not getting out of ignore mode)
                        if (delta < SCAN_INTERVAL) {
                            // in case the current key is an enter
                            // (time to send the scan error)
                            if (keyValue === 13) {
                                // triggers the scan error event
                                targetObject.trigger("scan_error", [sequence]);
                            }

                            // updates the previous time data in the target
                            // object and returns the control
                            targetObject.data("previous_time", currentTime);
                            return;
                        }
                        // otherwise the scan interval time has passed and
                        // we're out of the ignore mode
                        else {
                            // updates the ignoring flag in the target object
                            targetObject.data("ignoring", false);
                        }
                    }

                    // in case the current delta is more that the interval
                    // allowed between letters (probably keyboard or first
                    // letter of the scanning)
                    if (delta > LETTER_INTERVAL) {
                        // in case the delta is less than the scan interval
                        // (this is not the first letter) must enter in the
                        // ignore mode
                        if (delta < SCAN_INTERVAL) {
                            // in case the current key is an enter
                            // (time to send the scan error)
                            if (keyValue === 13) {
                                // triggers the scan error event
                                targetObject.trigger("scan_error", [sequence]);
                            }

                            // updates the target object data to reflect
                            // the ignore mode entrance and returns the control
                            targetObject.data("sequence", null);
                            targetObject.data("previous_time", currentTime);
                            targetObject.data("initial_time", null);
                            targetObject.data("ignoring", true);
                            return;
                        }
                        // otherwise this is considered to be the first letter
                        // of the sequence and so the values must be reset
                        else {
                            // resets the sequence to an empty string and
                            // sets the initial time (of the sequence) to the
                            // the current timestamp
                            sequence = "";
                            initialTime = currentTime;
                        }
                    }

                    // in case the current key is an enters, must check if
                    // the sequence can be finished
                    if (keyValue === 13) {
                        // retrieves the length of the current sequence, defaulting
                        // to zero in case no sequence is present
                        var sequenceLength = sequence ? sequence.length : 0;

                        // calculates the delta value to the total time and them
                        // verifies if it is valid
                        var deltaTotal = currentTime - initialTime;
                        var deltaValid = deltaTotal < sequenceLength * WORD_RATIO * LETTER_INTERVAL;

                        // checks if the current sequence is valid, it is
                        // considered to be valid in case it's not empty
                        // the length respect the minimum size and the delta
                        // time for the word is valid
                        var isValid = sequence && sequence.length >= MINIMUM_LENGTH && deltaValid;

                        // in case the sequence is considered to be valid
                        // the scan event is triggered
                        isValid && targetObject.trigger("scan", [sequence]);

                        // resets the various data values in the
                        // the target object to reflect the default values
                        targetObject.data("sequence", null);
                        targetObject.data("previous_time", null);
                        targetObject.data("initial_time", null);

                        // in case the sequence is not valid no need
                        // to stop the event propagation
                        if (!isValid) {
                            // returns immediately (avoids event propagation)
                            return;
                        }

                        // the sequence is considered valid and so the event must
                        // be avoided by any other handler (avoid possible problems)
                        event.stopPropagation();
                        event.stopImmediatePropagation();
                        event.preventDefault();
                    } else {
                        // updates the sequence with the character representation
                        // of the current key value (appends it to the sequence)
                        sequence += String.fromCharCode(keyValue);

                        // updates the various target object data values to reflect
                        // the current scan state
                        targetObject.data("sequence", sequence);
                        targetObject.data("previous_time", currentTime);
                        targetObject.data("initial_time", initialTime);
                    }
                });
            });
        };

        /**
         * Verifies if the current (key) event should be propagated in the
         * current context (crucial for correct working).
         *
         * @param {Element}
         *            targetObject The target object for the verification.
         * @param {Event}
         *            event The event to be used in the verification.
         */
        var _verifyPropagation = function(targetObject, event) {
            // retrieves the current data and then uses it
            // to retrieve the current timestamp
            var currentDate = new Date();
            var currentTime = currentDate.getTime();

            // retrieves the various data attribute from the target
            // object for the scanning
            var sequence = targetObject.data("sequence") || "";
            var initialTime = targetObject.data("initial_time") || currentTime;

            // retrieves the key value for the current event
            var keyValue = event.keyCode
                ? event.keyCode
                : event.charCode
                ? event.charCode
                : event.which;

            // in case the key is not an enter no need to do any
            // extra verification
            if (keyValue !== 13) {
                // returns immediately (no extra verification required)
                return;
            }

            // retrieves the length of the current sequence, defaulting
            // to zero in case no sequence is present
            var sequenceLength = sequence ? sequence.length : 0;

            // calculates the delta value to the total time and them
            // verifies if it is valid
            var deltaTotal = currentTime - initialTime;
            var deltaValid = deltaTotal < sequenceLength * WORD_RATIO * LETTER_INTERVAL;

            // checks if the current sequence is valid, it is
            // considered to be valid in case it's not empty
            // the length respect the minimum size and the delta
            // time for the word is valid
            var isValid = sequence && sequence.length >= MINIMUM_LENGTH && deltaValid;

            // in case the sequence is not valid no need
            // to stop the event propagation
            if (!isValid) {
                // returns immediately (avoids event propagation)
                return;
            }

            // the sequence is considered valid and so the event must
            // be avoided by any other handler (avoid possible problems)
            event.stopPropagation();
            event.stopImmediatePropagation();
            event.preventDefault();
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
