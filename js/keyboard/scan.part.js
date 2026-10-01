if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

(function(jQuery) {
    jQuery.fn.uxscan = function(element, options) {
        // the amount of time to considered between letter sending any letter
        // sending in between this value is discarded, This value should be
        // small enough do discard the keyboard presses
        var LETTER_INTERVAL = 80;

        // the ratio value to be used to calculate the complete interval for
        // the word based on the length of it (in letters), this value is going
        // to be multiplied by the letter interval
        var WORD_RATIO = 0.8;

        // the amount of time to considered between scannings any scanning in
        // between this value is discarded
        var SCAN_INTERVAL = 400;

        // the minimum length of the sequence to be considered a valid scan
        // value
        var MINIMUM_LENGTH = 6;

        // the maximum amount of time between the press and the release of
        // a key for it to be considered typed by a scanner, as a person takes
        // longer to release a key (the scanners release it right away)
        var PRESS_INTERVAL = 20;

        // the map that associates the physical keys (codes) with the characters
        // they type, without and with shift, in the US keyboard layout (the
        // default layout of the scanners), the letter keys are not included
        // as their characters are the letters of their codes (eg: KeyA)
        var US_LAYOUT = {
            Backquote: ["`", "~"],
            Digit1: ["1", "!"],
            Digit2: ["2", "@"],
            Digit3: ["3", "#"],
            Digit4: ["4", "$"],
            Digit5: ["5", "%"],
            Digit6: ["6", "^"],
            Digit7: ["7", "&"],
            Digit8: ["8", "*"],
            Digit9: ["9", "("],
            Digit0: ["0", ")"],
            Minus: ["-", "_"],
            Equal: ["=", "+"],
            BracketLeft: ["[", "{"],
            BracketRight: ["]", "}"],
            Backslash: ["\\", "|"],
            Semicolon: [";", ":"],
            Quote: ["'", '"'],
            Comma: [",", "<"],
            Period: [".", ">"],
            Slash: ["/", "?"],
            Space: [" ", " "]
        };

        // the default values for the key
        var defaults = {};

        // sets the default options value
        options = options || {};

        // constructs the options
        options = jQuery.extend(defaults, options);

        // sets the jquery matched object
        var matchedObject = this;

        // retrieves the logger of the plugin, to be used
        // to log the detection of the scans (and errors)
        var logger = jQuery.uxlogger("uxscan");

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
            var global = options.global ? options.global : true;

            // iterates over all the matched objects
            matchedObject.each(function(index, element) {
                // retrieves the element reference
                var _element = jQuery(element);

                // retrieves the target object base on the global option
                var targetObject = global ? jQuery(document) : _element;

                targetObject.keydown(function(event) {
                    // verifies if the event must be propagated or not
                    _verifyPropagation(targetObject, event);

                    // retrieves the characters of the pressed key and in case
                    // they exist stores them for its physical key, to be used
                    // once the key is released, as by then the shift state may
                    // have already changed (eg: the scanners press the shift
                    // key of the next character before releasing the key)
                    var characters = _characters(event);
                    if (characters) {
                        var pressed = targetObject.data("pressed") || {};
                        pressed[(event.originalEvent || event).code] = characters;
                        targetObject.data("pressed", pressed);
                    }

                    // retrieves the key value for the current event
                    var keyValue = event.keyCode
                        ? event.keyCode
                        : event.charCode
                        ? event.charCode
                        : event.which;

                    // stores the time of the press of the key and its value, so
                    // that its release may verify how long the key was pressed,
                    // ignoring the repeated presses of a key held down (as its
                    // release must be compared with its first press)
                    var repeat = (event.originalEvent || event).repeat;
                    if (!repeat) {
                        targetObject.data("press_time", new Date().getTime());
                        targetObject.data("press_value", keyValue);
                    }
                });

                targetObject.keypress(function(event) {
                    // verifies if the event must be propagated or not
                    _verifyPropagation(targetObject, event);
                });

                // registers for the key down press in the target
                // object reference
                targetObject.keyup(function(event) {
                    // verifies if the event must be propagated or not
                    _verifyPropagation(targetObject, event);

                    // retrieves the current data and then uses it
                    // to retrieve the current timestamp
                    var currentDate = new Date();
                    var currentTime = currentDate.getTime();

                    // retrieves the various data attribute from the target
                    // object for the scanning
                    var sequence = targetObject.data("sequence") || "";
                    var typedSequence = targetObject.data("typed_sequence") || "";
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

                    // retrieves the key typed for the current event, this value
                    // already takes into account the keyboard layout and the
                    // shift state (eg: a colon instead of the semicolon key)
                    var key = (event.originalEvent || event).key;

                    // in case the key could not be identified or is the legacy
                    // value of the space key (eg: internet explorer) it's unset
                    // so that the key value is used for it instead, as when the
                    // key is not available
                    if (key === "Unidentified" || key === "Spacebar") {
                        key = null;
                    }

                    // retrieves the characters of the key from the time it was
                    // pressed, using the one of the US keyboard layout as the key
                    // so that the scan depends neither on the keyboard layout of
                    // the system nor on the shift state of the key release, and
                    // the typed one (in the keyboard layout of the system) as the
                    // alternative for the scanners with that layout (any layout)
                    var code = (event.originalEvent || event).code;
                    var pressed = targetObject.data("pressed") || {};
                    var characters = code ? pressed[code] : null;
                    characters && delete pressed[code];
                    var typed = characters ? characters[1] : key;
                    key = characters ? characters[0] : key;

                    // in case the key is not a character one (eg: the shift key
                    // pressed by the scanner for the shifted characters) there's
                    // nothing to be done as it does not represent any character
                    // of the sequence, using the key value of the shift key in
                    // case the key is not available (the enter key is kept)
                    if ((key && key.length > 1 && keyValue !== 13) || keyValue === 16) {
                        return;
                    }

                    // in case the ignoring mode is set need
                    // to check if we can get out of it
                    if (ignoring) {
                        // in case the delta time is less than the
                        // time between scan (not getting out of ignore mode)
                        if (delta < SCAN_INTERVAL) {
                            // in case the current key is an enter
                            // (time to send the scan error)
                            if (keyValue === 13) {
                                // logs the scan error with only the length of the
                                // sequence, as it may contain keys typed by the user,
                                // and triggers the scan error event
                                logger.debug("Scan error with length:", sequence.length);
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
                                // logs the scan error with only the length of the
                                // sequence, as it may contain keys typed by the user,
                                // and triggers the scan error event
                                logger.debug("Scan error with length:", sequence.length);
                                targetObject.trigger("scan_error", [sequence]);
                            }

                            // updates the target object data to reflect
                            // the ignore mode entrance and returns the control
                            targetObject.data("sequence", null);
                            targetObject.data("typed_sequence", null);
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
                            typedSequence = "";
                            initialTime = currentTime;
                        }
                    }

                    // in case the current key is an enter, must check if
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

                        // in case the typed sequence is made only of digits and the
                        // sequence is not (eg: a scanner with a keyboard layout where
                        // the digits are shifted, as the French one) the typed sequence
                        // is the scanned value and the sequence its alternative
                        var digits = /^\d+$/.test(typedSequence) && !/^\d+$/.test(sequence);
                        var value = digits ? typedSequence : sequence;
                        var alternative = digits ? sequence : typedSequence;

                        // in case the sequence is considered to be valid the scan is
                        // logged and its event triggered with the value and alternative
                        isValid && logger.debug("Scan detected:", value, alternative);
                        isValid && targetObject.trigger("scan", [value, alternative]);

                        // resets the various data values in the
                        // the target object to reflect the default values
                        targetObject.data("sequence", null);
                        targetObject.data("typed_sequence", null);
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
                        // updates the sequence with the character of the key
                        // defaulting to the character representation of the current
                        // key value in case the key is not available (appends it)
                        // and the typed sequence with the typed character, defaulting
                        // to the character of the sequence
                        var character =
                            key && key.length === 1 ? key : String.fromCharCode(keyValue);
                        sequence += character;
                        typedSequence += typed && typed.length === 1 ? typed : character;

                        // updates the various target object data values to reflect
                        // the current scan state
                        targetObject.data("sequence", sequence);
                        targetObject.data("typed_sequence", typedSequence);
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

            // retrieves the time of the release of the previous key and, for
            // the release of the last pressed key, the time of its press
            var previousTime = targetObject.data("previous_time");
            var pressTime =
                event.type === "keyup" && targetObject.data("press_value") === keyValue
                    ? targetObject.data("press_time")
                    : null;

            // verifies if the key is typed into a field (eg: a barcode scanned
            // into an input), in which case the typing is intended and so the
            // propagation and default behaviour of the event are kept
            var target = event.target;
            var isField =
                target.isContentEditable || /^(input|textarea|select)$/i.test(target.nodeName);

            // in case the key is part of a scan, pressed right after the release
            // of the previous key or released right after its press (as only the
            // scanners do), and not typed into a field, the event must neither be
            // propagated nor have its default behaviour, as it could trigger other
            // handlers of the page (eg: shortcuts), even for a scan not valid
            var isScan =
                (previousTime && currentTime - previousTime < LETTER_INTERVAL) ||
                (pressTime && currentTime - pressTime < PRESS_INTERVAL);
            if (isScan && !isField) {
                // retrieves the currently focused element (eg: a link clicked
                // before the scan) and blurs it, as the browser shows it as
                // focused by the keyboard once any key is pressed, even when
                // the key is neither propagated nor has its default behaviour
                var focused = jQuery(":focus");
                focused.blur();

                event.stopPropagation();
                event.stopImmediatePropagation();
                event.preventDefault();
                return;
            }

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

        /**
         * Retrieves the characters typed by the (physical) key of the provided
         * key down event, the one of the US keyboard layout (the default layout
         * of the scanners) for the shift state of the event and the one typed
         * in the keyboard layout of the system (the key of the event).
         *
         * @param {Event}
         *            event The key down event to retrieve the characters from.
         * @return {Array} The character of the US keyboard layout and the typed
         *         one, or an invalid value in case the key does not type a
         *         character in the US keyboard layout (eg: the shift key).
         */
        var _characters = function(event) {
            // retrieves the original event and uses it to retrieve
            // the (physical) key code and the shift state
            var original = event.originalEvent || event;
            var code = original.code;
            var shift = original.shiftKey;

            // retrieves the characters of the key in the US keyboard layout,
            // the ones of the letter keys are the letters of their codes
            var characters = /^Key[A-Z]$/.test(code)
                ? [code.charAt(3).toLowerCase(), code.charAt(3)]
                : US_LAYOUT[code];

            // in case the key does not type a character in the layout
            // there are no characters to be returned
            if (!characters) {
                return null;
            }

            // returns the character of the layout for the shift state
            // and the character typed in the layout of the system
            return [characters[shift ? 1 : 0], original.key];
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
