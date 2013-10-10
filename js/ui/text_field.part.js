/**
 * jQuery text field plugin, this jQuery plugin provides the base
 * infra-structure for the creation of a text field component.
 *
 * @name jquery-text-field.js
 * @author João Magalhães <joamag@hive.pt> & Luís Martinho <lmartinho@hive.pt>
 * @version 1.0
 * @date March 10, 2010
 * @category jQuery plugin
 * @copyright Copyright (c) 2010-2012 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxtextfield = function(method, options) {
        // the default values for the text field
        var defaults = {};

        // sets the default method value
        var method = method ? method : "default";

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
            // sets the ux global object representation as text
            // field, this value may be used latter for fast ux
            // object type access (hash based conditions)
            matchedObject.uxobject("textfield");

            // iterates over all the items in the matched object
            matchedObject.each(function(index, element) {
                        // retrieves the element reference
                        var elementReference = jQuery(element);

                        // retrieves the (data) type of the element reference
                        // and adds it as class to the element reference
                        var type = elementReference.attr("data-type");
                        elementReference.addClass(type);

                        // starts the type specific structures
                        var startMethodName = "__start" + type;
                        type
                                && __callMethod(startMethodName,
                                        elementReference, options);

                        // starts the element
                        __start(elementReference, options);

                        // resets the element
                        __reset(elementReference, options);
                    });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // registers for focus event
            matchedObject.focus(function() {
                        // retrieves the element and runs the focus
                        // mrthod on top of it (focus the text field)
                        var element = jQuery(this);
                        _focus(element, options);
                    });

            // registers for blur event
            matchedObject.blur(function(event) {
                        // retrieves the element and runs the blur
                        // mrthod on top of it (blurs the text field)
                        var element = jQuery(this);
                        _blur(element, options);
                    });

            // registers for the keypress event
            matchedObject.keypress(function(event) {
                        // retrieves the element
                        var element = jQuery(this);

                        // retrieves the attributes
                        var value = element.attr("value");
                        var type = element.attr("data-type");
                        var regexString = element.attr("data-regex");
                        var maximumLength = element.attr("data-maximum_length");
                        var decimalPlaces = element.attr("data-decimal_places");

                        // retrieves the start index of the selection as the
                        // caret position this may be used for validation
                        var caret = this.selectionStart;

                        // retrieves the key value, the key code and
                        // the which value
                        var keyValue = event.keyCode
                                ? event.keyCode
                                : event.charCode ? event.charCode : event.which;
                        var keyCode = event.keyCode;
                        var which = event.which;

                        // in case the pressed key is a backspace,
                        // cursor, enter or any other movement key
                        // the default behavior must be prevented
                        if (keyCode == 8 || keyCode == 13 || keyCode > 8
                                && keyCode <= 46 && which == 0) {
                            // returns since the key press is valid
                            return true;
                        }

                        // checks if the current length of the value is valid and
                        // in case it's not returns in error (avoids writing)
                        var lengthValid = __testlength(value, maximumLength);
                        if (!lengthValid) {
                            // returns in error (avoids writing)
                            return false;
                        }

                        // converts the key value to a string
                        var keyValueString = String.fromCharCode(keyValue);

                        // initializes the valid input flag
                        var validInput = true;

                        // switches over each of the (data) types
                        switch (type) {
                            // in case the type is natural
                            case "natural" :
                                // tests the input against the regular expression
                                validInput = /^\d$/.test(keyValueString);

                                // breaks the switch
                                break;

                            // in case the type is integer
                            case "integer" :
                                // tests the input against the regular expression
                                validInput = /^-|\d$/.test(keyValueString);

                                // breaks the switch
                                break;

                            // in case the type is float
                            case "float" :
                                // tests the input against the regular expression
                                // and then in case the input is still valid runs the test
                                // on the number of decimal places
                                validInput = /^-|\d|\.$/.test(keyValueString);
                                validInput = validInput ? __testplaces(value,
                                        decimalPlaces, caret) : validInput;

                                // breaks the switch
                                break;

                            // in case the type is float positive
                            case "floatp" :
                                // tests the input against the regular expression
                                // and then in case the input is still valid runs the test
                                // on the number of decimal places
                                validInput = /^\d|\.$/.test(keyValueString);
                                validInput = validInput ? __testplaces(value,
                                        decimalPlaces, caret) : validInput;

                                // breaks the switch
                                break;

                            // in case the type is percent
                            case "percent" :
                                // tests the input against the regular expression
                                // and then in case the input is still valid runs the test
                                // on the number of decimal places
                                validInput = /^-|\d|\.$/.test(keyValueString);
                                validInput = validInput ? __testplaces(value,
                                        decimalPlaces, caret) : validInput;

                                // breaks the switch
                                break;

                            // in case the type is regex
                            case "regex" :
                                // tests the input against the regular expression
                                var regex = new RegExp(regexString);
                                validInput = regex.test(keyValueString);

                                // breaks the switch
                                break;
                        }

                        // returns valid input
                        return validInput;
                    });

            // registers for key down event
            matchedObject.keydown(function(event) {
                        // retrieves the element
                        var element = jQuery(this);

                        // retrieves the avoid escape data attribute
                        var avoidEscape = element.data("avoid_escape");

                        // in case the escape key should be escaped
                        // must return immediately nothing to be done
                        if (avoidEscape) {
                            // returns immediately, nothing to be done
                            return;
                        }

                        // retrieves the key value
                        var keyValue = event.keyCode
                                ? event.keyCode
                                : event.charCode ? event.charCode : event.which;

                        // in case the escape key is pressed
                        // need to blur the text field
                        if (keyValue == 27) {
                            // blurs the text field
                            element.blur();
                        }

                        // in case the key value represents an alpha
                        // numeric value the propagation must be avoided
                        if (keyValue > 64 && keyValue < 91) {
                            // stops the event propagation
                            // (avoid problems in global key
                            // listening)
                            event.stopImmediatePropagation();
                        }
                    });

            // registers for key up event
            matchedObject.keyup(function(event) {
                        // retrieves the element
                        var element = jQuery(this);

                        // checks if the text field is "lower"
                        var isLower = element.hasClass("lower");

                        // in case the text field is "lower"
                        if (isLower) {
                            // returns immediately (avoids problems
                            // of double update value calls on blur)
                            return;
                        }

                        // updates the value using the input
                        __updateValue(element, options);

                        // resets the error state
                        __resetError(element, options);

                        // stops the event propagation
                        // (avoid problems in global key
                        // listening)
                        event.stopPropagation();
                    });

            // registers for the change event so that it's possible
            // to update the error state of the current field
            matchedObject.change(function() {
                        // retrieves the element
                        var element = jQuery(this);

                        // resets the error state
                        __resetError(element, options);
                    });

            // registers for the flush event to update the current
            // internal state variables to the latest version
            matchedObject.bind("flush", function() {
                        var element = jQuery(this);
                        __updateValue(element, options);
                    });

            matchedObject.each(function(index, element) {
                // retrieves the element reference
                var elementReference = jQuery(element);

                // retrieves the containing form
                var parentForm = elementReference.parents("form");

                // registers for the submit event
                parentForm.bind("pre_submit", function() {
                    // checks if the text field is "lower", to be able
                    // to chose between send a hidden field or a normal field
                    var isLower = elementReference.hasClass("lower");

                    // in case the current text field is lowered, must create
                    // an empty field to represent it
                    if (isLower) {
                        // retrieves the name value from the element reference
                        // and then uses it to create a clone of the element
                        // with the hidden type and with the same name
                        var elementName = elementReference.attr("name");
                        var elementClone = jQuery("<input type=\"hidden\" name=\""
                                + elementName + "\"/>");

                        // removes the name attribute from the element, it's
                        // no longer required and avoids unwanted submits
                        elementReference.removeAttr("name");

                        // retrieves the element value, to update the hidden
                        // field accordingly
                        var elementValue = elementReference.attr("data-value");

                        // sets the element value in the cloned element and then
                        // adds the cloned element after the text field
                        elementClone.attr("value", elementValue);
                        elementReference.after(elementClone);
                    }
                    // otherwise it's a normal processing the data value must
                    // be set as the current value
                    else {
                        // updates the current value with the most updated version
                        // based on the dom value and then retrieves its value to
                        // be used in the proper value to be set, this trick avoids
                        // problems leading with "lowered" values
                        __updateValue(elementReference, options);
                        var elementValue = elementReference.attr("data-value");

                        // sets the element value in the input field
                        elementReference.attr("value", elementValue);
                    }
                });

                // registers for the success event
                parentForm.bind("success", function() {
                            __reset(elementReference, options);
                        });

                // registers for the error event
                parentForm.bind("error", function() {
                            __reset(elementReference, options);
                        });

                // sets an interval to check for modifications
                // in the text field
                setInterval(function() {
                            // checks if the text field is "lower"
                            var isLower = elementReference.hasClass("lower");

                            // in case the text field is "lower"
                            if (isLower) {
                                // returns immediately
                                return;
                            }

                            // updates the value conveniently
                            __updateValue(elementReference, options);
                        }, 250);
            });
        };

        var _value = function(matchedObject, options) {
            // tries to retrieve the value from options
            var value = options["value"];

            // in case it's a "normal" get operation
            // (no value defined)
            if (value === undefined) {
                // updates the current value base on the current status
                // and then retrieves the data based value (logical value)
                // that it's going to be used in transforming the value
                __updateValue(matchedObject, options);
                var elementValue = matchedObject.attr("data-value");

                // retrieves the data type for the matached object
                // and uses it to create the (possible) value type
                // retrieval method then calls it in case it exists
                // otherwise uses the normal element value
                var type = matchedObject.attr("data-type");
                var valueMethodName = "__value" + type;
                var hasMethod = __hasMethod(valueMethodName, matchedObject,
                        options);
                var elementValue = hasMethod ? __callMethod(valueMethodName,
                        matchedObject, options) : elementValue;

                // returns the retrieved value
                return elementValue;
            }
            // otherwise the "target" value is valid
            // it's a set operation
            else {
                // retrieves the data type for the matached object
                // and uses it to create the (possible) format value
                // retrieval method then calls it in case it exists
                // otherwise uses the normal value, note that the method
                // is not called in case the value is empty (nothing will
                // be formatted for such case)
                var type = matchedObject.attr("data-type");
                var valueMethodName = "__fvalue" + type;
                var hasMethod = __hasMethod(valueMethodName, matchedObject,
                        options);
                var value = hasMethod && value != "" ? __callMethod(
                        valueMethodName, matchedObject, value) : value;

                // sets the value in the attributes
                matchedObject.attr("value", value);

                // removes the lower (background) mode class
                matchedObject.removeClass("lower");

                // updates the value using the input
                __updateValue(matchedObject, options);

                // resets the element
                __reset(matchedObject, options);
            }
        };

        var _reset = function(matchedObject, options) {
            _value(matchedObject, {
                        value : ""
                    });
        };

        var _focus = function(matchedObject, options) {
            // retrieves the element as the matched object
            var element = matchedObject;

            // verifies if the element is already focused and in
            // case it's returns immediately avoiding the new
            // redundant focus event that would do anything
            var isFocus = element.hasClass("focus");
            if (isFocus) {
                return;
            }

            // blurs all the active text fields (avoids bluring
            // the current text field)
            __bluractive(element, options);

            // adds the focus class to the text field, signals
            // the focus on it and then adds the active class
            // also indicating the general active behavior
            element.addClass("focus");
            element.addClass("active");

            // removes the lower (background) mode class so
            // that the placeholder value is removed
            element.removeClass("lower");

            // retrieves the (data) type of the element to be
            // able to call the proper show method for the type
            // in case it exists
            var type = element.attr("data-type");

            // shows the type specific structures
            var showMethodName = "__show" + type;
            type && __callMethod(showMethodName, element, options);

            // retrieves the element value
            var elementValue = element.attr("data-value");

            // sets the element value in the text field
            element.attr("value", elementValue);

            // triggers the composite focus event so that the
            // listeners "know" about the "real" focus action
            element.triggerHandler("_focus");
        };

        var _blur = function(matchedObject, options) {
            // retrieves the element as the matched object
            var element = matchedObject;

            // verifies if the current element is focused and
            // in case it's not avoids the blur action as the element
            // is already considered to be in a blur state
            var isFocus = element.hasClass("focus");
            if (!isFocus) {
                return;
            }

            // retrieves the value of the avoid next flag
            // and updates the state of it to false
            var avoidNext = element.data("avoid_next");
            element.data("avoid_next", false);

            // in case the avoid next flag is set
            // (no blur logic is done)
            if (avoidNext) {
                // re-focus on the element
                element.focus();

                // returns immediately
                return;
            }

            // retrieves the (data) type of the element
            var type = element.attr("data-type");

            // hides the type specific structures
            var hideMethodName = "__hide" + type;
            type && __callMethod(hideMethodName, element, options);

            // removes the active class
            element.removeClass("active");

            // updates the value using the input
            __updateValue(element, options);

            // resets the element
            __reset(element, options);

            // removes the focus class to the text field, signals
            // the blur from it
            element.removeClass("focus");

            // triggers the composite blur event so that the
            // listeners "know" about the "real" blur action
            element.triggerHandler("_blur");
        };

        var __start = function(matchedObject, options) {
            // retrieves the input value
            var inputFieldValue = matchedObject.attr("value");

            // retrieves the element value
            var elementValue = matchedObject.attr("data-value");

            // retrieves the original value
            var originalValue = matchedObject.attr("data-original_value");

            // retrieves the force complete value, this value controls
            // if the autcomplete feature must be forced in non compliant
            // browsers (eg: firefox)
            var forceComplete = matchedObject.attr("data-force_complete");

            // in case the element value is not provided
            if (elementValue != null) {
                // returns immediately
                return;
            }

            // unsets the autocomplete feature in the text field
            // to avoid possible (unwanted) autocomplete sugestions
            // this is only done in case the force complete flag
            // is unset (default behavior)
            !forceComplete && matchedObject.attr("autocomplete", "off");

            // in case the input field value is the original one
            // this is a known issue with refreshing browser (need
            // to reset to value in order to avoid side effects)
            // in case the autocomplete has been already disabled
            // there is no need to do this because the problem
            // is not observed
            forceComplete && inputFieldValue == originalValue
                    && matchedObject.attr("value", "");

            // runs the initial update operations for both the error
            // and the value, the updating of the value is
            // important to avoid sync errors
            __updateError(matchedObject, options);
            __updateValue(matchedObject, options);
        };

        var __reset = function(matchedObject, options) {
            // retrieves the element value
            var elementValue = matchedObject.attr("data-value");

            // in case the element value is not empty
            if (elementValue != "") {
                // returns immediately
                return;
            }

            // retrieves the original value
            var originalValue = matchedObject.attr("data-original_value");

            // in case the original value is not defined
            if (originalValue == null) {
                // returns immediately
                return;
            }

            // sets the value attribute to the original value
            matchedObject.attr("value", originalValue);

            // adds the lower class
            matchedObject.addClass("lower");
        };

        var __updateValue = function(matchedObject, options) {
            // checks if the input field is lowered (original value
            // is set) in such cases there's no need to update the
            // data value (could cause problems in data sync)
            var isLower = matchedObject.hasClass("lower");
            if (isLower) {
                // returns immediately, no need to update
                // a "lowered" input field
                return;
            }

            // retrieves the (previous) input field value
            // from the data value attribute
            var previousInputFieldValue = matchedObject.attr("data-value");

            // retrieves the input value (real value) that
            // its going to be set in the data attribute
            var inputFieldValue = matchedObject.attr("value");

            // sets the data value
            matchedObject.attr("data-value", inputFieldValue);

            // triggers the value change event in case the previous
            // input field value is different from the current
            inputFieldValue != previousInputFieldValue
                    && matchedObject.triggerHandler("value_change",
                            [inputFieldValue]);
        };

        var __updateError = function(matchedObject, options) {
            // retrieves the element error
            var elementError = matchedObject.attr("data-error");

            // in case there is an error
            if (elementError) {
                // adds the invalid mode class and triggers the invalid
                // set event
                matchedObject.addClass("invalid");
                matchedObject.triggerHandler("invalid_set");
            }
        };

        var __resetError = function(matchedObject, options) {
            // removes the invalid mode class and triggers
            // the invalid unset event
            matchedObject.removeClass("invalid");
            matchedObject.triggerHandler("invalid_unset");
        };

        var __callMethod = function(methodName, element, options) {
            // creates the string to be eavluated and then evaluates it
            var evalString = "if(typeof " + methodName
                    + " != \"undefined\") { var result = " + methodName
                    + "(element, options)} else { var result = null; }";
            eval(evalString);
            return result;
        };

        var __hasMethod = function(methodName, element, options) {
            // creates the string to be eavluated and then evaluates it
            var evalString = "var result = typeof " + methodName
                    + " != \"undefined\";";
            eval(evalString);
            return result;
        };

        var __startdatetime = function(element, options) {
            // retrieves the value of the utc offset flag
            // (if the utc flag is set the date is set to work
            // in the utc zone)
            var utc = element.hasClass("utc");

            // retrieves the current (initial) value from the
            // element (text field)
            var currentValue = element.attr("value");
            var currentTimestamp = parseInt(currentValue);

            // in case the parse of the timestamp was not successful
            if (!isNaN(currentTimestamp)) {
                // converts the date object from the
                // current timestamp value
                var date = new Date(currentTimestamp * 1000);

                // retrieves the various components of the date
                var year = utc ? date.getUTCFullYear() : date.getFullYear();
                var month = utc ? date.getUTCMonth() + 1 : date.getMonth() + 1;
                var day = utc ? date.getUTCDate() : date.getDate();
                var hours = utc ? date.getUTCHours() : date.getHours();
                var minutes = utc ? date.getUTCMinutes() : date.getMinutes();
                var seconds = utc ? date.getUTCSeconds() : date.getSeconds();

                // creates the date string from the various
                // date components
                var yearString = String(year);
                var monthString = month > 9 ? String(month) : "0"
                        + String(month);
                var dayString = day > 9 ? String(day) : "0" + String(day);
                var hoursString = hours > 9 ? String(hours) : "0"
                        + String(hours);
                var minutesString = minutes > 9 ? String(minutes) : "0"
                        + String(minutes);
                var secondsString = seconds > 9 ? String(seconds) : "0"
                        + String(seconds);
                var dateString = yearString + "/" + monthString + "/"
                        + dayString + " " + hoursString + ":" + minutesString
                        + ":" + secondsString;

                // updates both the logical value and the real value
                element.attr("data-value", dateString);
                element.attr("value", dateString);
            }

            // retrieves the containing form
            var parentForm = element.parents("form");

            // registers for the submit event in the parent form
            // to create an hidden field that "sends" the converted timestamp
            parentForm.bind("pre_submit", function() {
                        // retrieves the current value and then uses it to parse
                        // it as current timestamp
                        var currentValue = element.attr("value");
                        var currentTimestamp = utc ? Date.parse(currentValue
                                + " UTC")
                                / 1000 : Date.parseUtc(currentValue) / 1000;

                        // retrieves the name attribute from the element
                        // and then removes it to avoid sending the literal date value
                        var name = element.attr("name");
                        element.removeAttr("name");

                        // creates the hidden field to submit the timestamp value
                        // described in the text field
                        element.after("<input type=\"hidden\" name=\"" + name
                                + "\" value=\"" + String(currentTimestamp)
                                + "\" />");
                    });
        };

        var __startdate = function(element, options) {
            // retrieves the reference to the top level
            // window element
            var _window = jQuery(window);

            // checks if the no calendar class (flag) is set
            var noCalendar = element.hasClass("no-calendar")

            // in case the no calendar flag is set
            // no need to create the text field calendar
            if (noCalendar) {
                // creates the empty element representing
                // the calendar
                var calendar = jQuery();
            }
            // otherwise the calendar element must be created
            else {
                // creates the calendar component from the
                // html code and inserts it after the element
                var calendar = jQuery("<div class=\"calendar text-field-calendar\"></div>");
                element.after(calendar);

                // unsets the autocomplete feature in the text field
                // to avoid possible (unwanted) autocomplete sugestions
                element.attr("autocomplete", "off");
            }

            // creates the calendar correctly and then hides it
            calendar.uxcalendar();
            calendar.hide();

            // retrieves the offset and height values
            // from the element to calculate
            // the relative position for the calendar
            var offset = element.offset();
            var height = element.outerHeight();

            // calculates the calendar top and left
            // positions from the element offset and height
            // and then sets them in the calendar
            var calendarTop = offset["top"] + height;
            var calendarLeft = offset["left"];
            calendar.css("top", calendarTop + "px");
            calendar.css("left", calendarLeft + "px");

            // retrieves the current (initial) value from the
            // element (text field)
            var currentValue = element.attr("value");
            var currentTimestamp = parseInt(currentValue);

            // in case the parse of the timestamp was not successful
            if (!isNaN(currentTimestamp)) {
                // converts the date object from the
                // current timestamp value
                var date = new Date(currentTimestamp * 1000);

                // retrieves the various components of the date
                var year = date.getUTCFullYear();
                var month = date.getUTCMonth() + 1;
                var day = date.getUTCDate();

                // sets the calendar value to reflect
                // the initial date value
                calendar.uxcalendar("set", {
                            current : {
                                year : year,
                                month : month,
                                day : day
                            }
                        });

                // creates the date string from the various
                // date components
                var yearString = String(year);
                var monthString = month > 9 ? String(month) : "0"
                        + String(month);
                var dayString = day > 9 ? String(day) : "0" + String(day);
                var dateString = yearString + "/" + monthString + "/"
                        + dayString;

                // updates both the logical value and the real value
                element.attr("data-value", dateString);
                element.attr("value", dateString);
            }

            // registers for the current change event in the calendar
            // to update the text field accordingly
            calendar.bind("current_change", function(event, current) {
                        // retrieves the date format defined in the current element
                        // and uses it with the current map to retrieve the date string
                        var format = element.attr("data-format") || "%Y/%m/%d";
                        var dateString = jQuery.uxformat(current, format);

                        // updates both the logical value and the real value
                        element.attr("data-value", dateString);
                        element.attr("value", dateString);

                        // triggers the value change event for the element
                        // to notify the event handlers
                        element.triggerHandler("value_change", [dateString]);
                    });

            // registers for the mouse down event on the calendar
            calendar.mousedown(function() {
                        //element to avoid the next (blur)
                        element.data("avoid_next", true);
                    });

            // registers for the mouse up event on the calendar
            calendar.mouseup(function() {
                        // re-focus on the element
                        element.focus();
                    });

            // registers for the value change event on the element
            // to update the value in the calendar
            element.bind("value_change", function(event, inputFieldValue) {
                        // parses the input field value, retrieving
                        // the corresponding timestamp
                        var timestamp = Date.parse(inputFieldValue);

                        // in case the timestamp was not correctly
                        // parsed (not a number)
                        if (isNaN(timestamp)) {
                            // returns immediately
                            return;
                        }

                        // creates the date object from the timestamp
                        // and then uses it to unpack the various date
                        // values fro it (value decomposition)
                        var date = new Date(timestamp);
                        var year = date.getFullYear();
                        var month = date.getMonth() + 1;
                        var day = date.getDate();

                        // sets the calendar value to reflect
                        // the text field value changes
                        calendar.uxcalendar("set", {
                                    current : {
                                        year : year,
                                        month : month,
                                        day : day
                                    }
                                });
                    });

            // registers the resize in the window to reposition
            // the calendar in the correct place
            _window.resize(function(event) {
                        // retrieves the offset and height values
                        // from the element to calculate
                        // the relative position for the calendar
                        var offset = element.offset();
                        var height = element.outerHeight();

                        // calculates the calendar top and left
                        // positions from the element offset and height
                        // and then sets them in the calendar
                        var calendarTop = offset["top"] + height;
                        var calendarLeft = offset["left"];
                        calendar.css("top", calendarTop + "px");
                        calendar.css("left", calendarLeft + "px");
                    });

            // retrieves the containing form
            var parentForm = element.parents("form");

            // registers for the submit event in the parent form
            // to create an hidden field that "sends" the converted utc timestamp
            parentForm.bind("pre_submit", function() {
                // retrieves the current value and then uses it to parse
                // it as current timestamp
                var currentValue = element.attr("value");
                var currentTimestamp = Date.parse(currentValue + " UTC") / 1000;

                // retrieves the name attribute from the element
                // and then removes it to avoid sending the literal date value
                var name = element.attr("name");
                element.removeAttr("name");

                // creates the hidden field to submit the timestamp value
                // described in the text field
                element.after("<input type=\"hidden\" name=\"" + name
                        + "\" value=\"" + String(currentTimestamp) + "\" />");
            });

            // sets the calendar in the element
            element.data("calendar", calendar);
        };

        var __fvaluefloatp = function(element, value) {
            // retrieves the decimal places number and tries to
            // parse it as an integer, incase it fails returns
            // immediately the number without processing
            var decimalPlaces = element.attr("data-decimal_places");
            decimalPlaces = parseInt(decimalPlaces);
            if (isNaN(decimalPlaces)) {
                return value;
            }

            // converts teh provided value into a float value and
            // then usees this value to convert it into a fixed
            // representation with the requested number of decimal
            // places (correct specification)
            var valueF = parseFloat(value);
            return valueF.toFixed(decimalPlaces);
        };

        var __fvaluefloat = function(element, value) {
            // retrieves the decimal places number and tries to
            // parse it as an integer, incase it fails returns
            // immediately the number without processing
            var decimalPlaces = element.attr("data-decimal_places");
            decimalPlaces = parseInt(decimalPlaces);
            if (isNaN(decimalPlaces)) {
                return value;
            }

            // converts teh provided value into a float value and
            // then usees this value to convert it into a fixed
            // representation with the requested number of decimal
            // places (correct specification)
            var valueF = parseFloat(value);
            return valueF.toFixed(decimalPlaces);
        };

        var __valuedate = function(element, options) {
            // retrieves the current value and then uses it to parse
            // it as current timestamp then returns it
            var currentValue = element.attr("value");
            var currentTimestamp = Date.parse(currentValue + " UTC") / 1000;
            return currentTimestamp;
        };

        var __showdate = function(element, options) {
            // tries to retrieve the calendar from the element
            var calendar = element.data("calendar")

            // in case no calendar is defined
            if (!calendar) {
                // returns immediately
                return;
            }

            // checks if the calendar is visible
            var isVisible = calendar.is(":visible");

            // in case the calendar is visible
            if (isVisible) {
                // returns immediately
                return;
            }

            // retrieves the offset and height values
            // from the element to calculate
            // the relative position for the calendar
            var offset = element.offset();
            var height = element.outerHeight();

            // calculates the calendar top and left
            // positions from the element offset and height
            // and then sets them in the calendar
            var calendarTop = offset["top"] + height;
            var calendarLeft = offset["left"];
            calendar.css("top", calendarTop + "px");
            calendar.css("left", calendarLeft + "px");

            // "resets" the state of the ux calendar
            calendar.uxcalendar("reset")

            // shows the calendar
            calendar.show();
        };

        var __hidedate = function(element, options) {
            // tries to retrieve the associated
            // calendar and hides it if necessary
            var calendar = element.data("calendar");
            calendar && calendar.hide();
        };

        var __testlength = function(stringValue, length) {
            // converts the (maximum) length into an integer value
            // and then checks if the parsed of length represents
            // a valid number (integer validation)
            var lengthInteger = parseInt(length);
            var isValid = !isNaN(lengthInteger);

            // in case the parsing was not successfull
            // the places test is considered not to be
            // runnable
            if (!isValid) {
                // returns immediately in success, no validation
                // was required for the length
                return true;
            }

            // checks id the length of the current string value is smaller
            // than the maximum allowed length (minus one value)
            valid = stringValue.length <= lengthInteger - 1;

            // returns the result of the length result
            return valid;
        };

        var __testplaces = function(stringValue, decimalPlaces, caret) {
            // converts the decimal places into an integer value
            // and then checks if the parsed number of decimal places
            // represents a valid number
            var decimalPlacesInteger = parseInt(decimalPlaces);
            var isValid = !isNaN(decimalPlacesInteger);

            // in case the parsing was not successfull
            // the places test is considered not to be
            // runnable
            if (!isValid) {
                // returns immediately in success, no validation
                // was required for the places
                return true;
            }

            // retrieves the index for the decimal separator
            // then using it checks if the float number is still
            // valid (decimal places within range)
            var separatorIndex = stringValue.indexOf(".");
            var valid = separatorIndex >= stringValue.length
                    - decimalPlacesInteger
                    || separatorIndex == -1;

            // in case the places validation is valid according
            // to decimal separator validation, no need to run
            // anyting more because no decimal places are found
            if (valid) {
                return valid;
            }

            // checks if the caret is positioned after the decimal
            // separator only in that case the user can change the
            // current string into an invalid one
            valid = caret < stringValue.length - 2;

            // returns the result of the decimal places range result
            return valid;
        };

        var __bluractive = function(matchedObject, options) {
            // retrieves the currently active text fields
            // to blur them in case their are not the current
            var active = jQuery(".text-field.active");

            // iterates over all the elements that are
            // considered to be active text fields
            active.each(function(index, element) {
                        // retrieves the element reference
                        var _element = jQuery(element);

                        // checks if the current element reference
                        // dom element is the same as the matched
                        // object (top level reference) in such
                        // case the object cannot be blured
                        if (_element.get(0) == matchedObject.get(0)) {
                            // returns immediately, avoids blur
                            return;
                        }

                        // blurs the current element according to the
                        // the current options map
                        _blur(_element, options);
                    });
        };

        // switches over the method
        switch (method) {
            case "value" :
                // retrieves the value
                var value = _value(matchedObject, options);

                // returns the value
                return value;

            case "reset" :
                // resets the current text field value to
                // its original value
                _reset(matchedObject, options);

                // breaks the switch
                break;

            case "focus" :
                // focus the matched object
                _focus(matchedObject, options);

                // breaks the switch
                break;

            case "blur" :
                // blurs the matched object
                _blur(matchedObject, options);

                // breaks the switch
                break;

            case "default" :
                // initializes the plugin
                initialize();

                // breaks the switch
                break;
        }

        // returns the object
        return this;
    };
})(jQuery);
