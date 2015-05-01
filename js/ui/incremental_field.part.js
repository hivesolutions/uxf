/**
 * jQuery incremental field plugin, this jQuery plugin provides the base
 * infra-structure for the creation of a incremental field component.
 *
 * @name jquery-incremental-field.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2015 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxincrementalfield = function(method, options) {
        // the default values for the button
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
            // wraps the matched object around the the incremental field
            // element so that the buttons may be added, then retrieves
            // the "just" created incremental field and adds the buttons
            // to it (minus and plus buttons)
            matchedObject.wrap("<div class=\"incremental-field\"></div>");
            var incrementalField = matchedObject.parents(".incremental-field");
            incrementalField.prepend("<div class=\"button minus\"></div>");
            incrementalField.append("<div class=\"button plus\"></div>");

            // sets the ux global object representation as incremental
            // field, this value may be used latter for fast ux
            // object type access (hash based conditions)
            incrementalField.attr("data-object", "incrementalfield");

            // removes the incremental field from the text field base element
            // and then add the text field class and registers it as a text field
            matchedObject.removeClass("incremental-field");
            matchedObject.addClass("text-field");
            matchedObject.uxtextfield();
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
            incrementalField.bind("enabled", function() {
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
            incrementalField.bind("disabled", function() {
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
            var floatvalue = textField.uxfloat()

            // checks if the incremental field to verify that the
            // incremental field is not disabled, in case it is
            // no action is done
            var isDisabled = incrementalField.hasClass("disabled");
            if (isDisabled) {
                return;
            }

            // increments the float value and uses it to update the
            // text field string representation value
            floatvalue += 1;
            textField.uxtextfield("value", {
                        value : floatvalue
                    });
        };

        var __decrement = function(incrementalField, options) {
            // retrieves the text field associated with the incremental
            // field then retrieves the current value of it and converts
            // it into a float representation
            var textField = jQuery(".text-field", incrementalField);
            var floatvalue = textField.uxfloat();

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
            if ((type == "natural" || type == "floatp") && floatvalue <= 0) {
                // returns immediately (avoids changing the value)
                return;
            }

            // decrements the float value and uses it to update the
            // text field string representation value
            floatvalue -= 1;
            textField.uxtextfield("value", {
                        value : floatvalue
                    });
        };

        // switches over the method
        switch (method) {
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
