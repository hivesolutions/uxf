if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

/**
 * jQuery incremental field plugin, this jQuery plugin provides the base
 * infra-structure for the creation of a incremental field component.
 *
 * @name uxf-incremental-field.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2019 Hive Solutions Lda.
 * @license Apache License, Version 2.0 - http://www.apache.org/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxincrementalfield = function(method, options) {
        // the default values for the button
        var defaults = {};

        // sets the default method value
        method = method || "default";

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
            // wraps the matched object around the the incremental field
            // element so that the buttons may be added, then retrieves
            // the "just" created incremental field and adds the buttons
            // to it (minus and plus buttons)
            matchedObject.wrap('<div class="incremental-field"></div>');
            var incrementalField = matchedObject.parents(".incremental-field");
            incrementalField.prepend('<div class="button minus"></div>');
            incrementalField.append('<div class="button plus"></div>');

            // sets the ux global object representation as incremental
            // field, this value may be used latter for fast ux
            // object type access (hash based conditions)
            incrementalField.uxobject("incrementalfield");

            // removes the incremental field from the text field base element
            // and then add the text field class and registers it as a text field
            matchedObject.removeClass("incremental-field");
            matchedObject.addClass("text-field");
            matchedObject.uxtextfield();

            // iterates over all the matched objects to be able to start
            // their modes structure and layout
            matchedObject.each(function(index, element) {
                // retrieves the current element and uses it to retrieve
                // the parent incremental field
                var _element = jQuery(this);
                var incrementalField = _element.parents(".incremental-field");

                // verifies if the current element is meant to be
                // positioned to the left and in case it's meant
                // adds the proper class to the incremental field
                var isLeft = _element.hasClass("incremental-left");
                isLeft && incrementalField.addClass("incremental-left");

                // verifies if the current element is considered
                // to be small and if that's the case propagates
                // the value to the upper incremental field
                var isSmall = _element.hasClass("small");
                isSmall && incrementalField.addClass("small");
                isSmall && _element.removeClass("small");

                // verifies if the current element is considered
                // to be large and if that's the case propagates
                // the value to the upper incremental field
                var isLarge = _element.hasClass("large");
                isLarge && incrementalField.addClass("large");
                isLarge && _element.removeClass("large");
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the incremental field associated with the matched object
            // and then uses it to retrieve the minus and plus buttons
            var incrementalField = matchedObject.parents(".incremental-field");
            var minusButton = jQuery(".button.minus", incrementalField);
            var plusButton = jQuery(".button.plus", incrementalField);

            // registers for the click event on the minus button
            minusButton.click(function() {
                // retrieves the current element
                var element = jQuery(this);

                // retrieves the incremental field associated with
                // the current element and uses it to decrement the field
                // note that the text field is focused while the operation
                // is done this ensures total text field "emulation"
                var incrementalField = element.parents(".incremental-field");
                var textField = jQuery(".text-field", incrementalField);
                textField.focus();
                __decrement(incrementalField, options);
                textField.blur();
            });

            // registers for the click event on the plus button
            plusButton.click(function() {
                // retrieves the current element
                var element = jQuery(this);

                // retrieves the incremental field associated with
                // the current element and uses it to increment the field
                // note that the text field is focused while the operation
                // is done this ensures total text field "emulation"
                var incrementalField = element.parents(".incremental-field");
                var textField = jQuery(".text-field", incrementalField);
                textField.focus();
                __increment(incrementalField, options);
                textField.blur();
            });

            // binds the incremental field do the enabled event
            // so that is possible to propagate the enabling
            incrementalField.bind("enable enabled", function() {
                // retrieves the current element and the associated
                // text field and button elements
                var element = jQuery(this);
                var textField = jQuery(".text-field", element);
                var buttons = jQuery(".button", element);

                // enables the text field and the buttons associated
                // with the element (incremental field)
                textField.uxenable();
                buttons.uxenable();
            });

            // binds the incremental field do the disabled event
            // so that is possible to propagate the disabling
            incrementalField.bind("disable disabled", function() {
                // retrieves the current element and the associated
                // text field and button elements
                var element = jQuery(this);
                var textField = jQuery(".text-field", element);
                var buttons = jQuery(".button", element);

                // disables the text field and the buttons associated
                // with the element (incremental field)
                textField.uxdisable();
                buttons.uxdisable();
            });
        };

        var __increment = function(incrementalField, options) {
            // retrieves the text field associated with the incremental
            // field then retrieves the current value of it and converts
            // it into a float representation
            var textField = jQuery(".text-field", incrementalField);
            var floatvalue = textField.uxfloat();

            // tries to retrive a possibly existing increment URL value
            // to be used for location change
            var incrementUrl = textField.attr("data-increment_url");

            // checks if the incremental field to verify that the
            // incremental field is not disabled, in case it is
            // no action is done
            var isDisabled = incrementalField.hasClass("disabled");
            if (isDisabled) {
                return;
            }

            // verifies if the increment URL is defined and if that's the
            // cases runs the location plugin to change the current browser's
            // location to the one defined in the increment url
            if (incrementUrl) {
                jQuery.uxlocation(incrementUrl);
                return;
            }

            // increments the float value and uses it to update the
            // text field string representation value
            floatvalue += 1;
            textField.uxtextfield("value", {
                value: floatvalue
            });

            // triggers the incremented event, notifying any listener
            // about the value that has changed
            incrementalField.triggerHandler("incremented", [floatvalue]);
        };

        var __decrement = function(incrementalField, options) {
            // retrieves the text field associated with the incremental
            // field then retrieves the current value of it and converts
            // it into a float representation
            var textField = jQuery(".text-field", incrementalField);
            var floatvalue = textField.uxfloat();

            // tries to retrive a possibly existing decrement URL value
            // to be used for location change
            var decrementUrl = textField.attr("data-decrement_url");

            // retrieves the data type for associated with the text field
            // for the incremental field (non natural validation)
            var type = textField.attr("data-type");

            // checks if the incremental field to verify that the
            // incremental field is not disabled, in case it is
            // no action is done
            var isDisabled = incrementalField.hasClass("disabled");
            if (isDisabled) {
                return;
            }

            // in case the current text field is of data type natural
            // (negative numbers not allowed) and the value is zero or
            // less no changes are done
            if ((type === "natural" || type === "floatp") && floatvalue <= 0) {
                // returns immediately (avoids changing the value)
                return;
            }

            // verifies if the decrement URL is defined and if that's the
            // cases runs the location plugin to change the current browser's
            // location to the one defined in the decrement url
            if (decrementUrl) {
                jQuery.uxlocation(decrementUrl);
                return;
            }

            // decrements the float value and uses it to update the
            // text field string representation value
            floatvalue -= 1;
            textField.uxtextfield("value", {
                value: floatvalue
            });

            // triggers the decremented event, notifying any listener
            // about the value that has changed
            incrementalField.triggerHandler("decremented", [floatvalue]);
        };

        // switches over the method
        switch (method) {
            case "default":
                // initializes the plugin
                initialize();

                // breaks the switch
                break;
        }

        // returns the object
        return this;
    };
})(jQuery);
