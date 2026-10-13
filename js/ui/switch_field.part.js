if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

/**
 * jQuery switch field plugin, this jQuery plugin provides the base
 * infra-structure for the creation of a switch field component.
 *
 * @name uxf-switch-field.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2024 Hive Solutions Lda.
 * @license Apache License, Version 2.0 - http://www.apache.org/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxswitchfield = function(method, options) {
        // the default values for the switch field
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
            // sets the data object reference in the selected objects
            // so that they may be used latter
            matchedObject.uxobject("switchfield");

            // iterates over all the matched objects to update their
            // current internal state values
            matchedObject.each(function(index, element) {
                // retrieves the element reference
                var _element = jQuery(element);
                _update(_element, options);
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the (possible) next switch field label
            // to register it for toggling
            var switchFieldLabel = matchedObject.next(".switch-field-label");

            // registers the switch field label for the click
            // event to toggle the associated switch field
            switchFieldLabel.click(function() {
                // retrieves the current element and uses it to retrieve
                // the previous switch field
                var element = jQuery(this);
                var switchField = element.prev(".switch-field");

                // toggles the "just" retrieved switch field, this should
                // change its boolean value
                _toggle(switchField, options);
            });

            // iterates over the complete set of matched object to
            // register for their parent form submission
            matchedObject.each(function(index, element) {
                // retrieves the current element in iteration
                var _element = jQuery(element);

                // retrieves the containing form so that it's
                // possible to register for its actions
                var parentForm = _element.parents("form");

                // registers for the submit event on the parent
                // form, in order to be able to create the appropriate
                // structures for proper submission
                parentForm.bind("pre_submit", function() {
                    // retrieves the name of the element, this value is
                    // going to be used in the input element to be create
                    // in case the name does not exists no submission of
                    // values is created (returns immediately)
                    var elementName = _element.attr("name");
                    if (!elementName) {
                        return;
                    }

                    // removes all the input elements contained inside the
                    // current switch field (avoid duplicated submission)
                    var inputs = jQuery("input", _element);
                    inputs.remove("input");

                    // in case the current element is checked no need to
                    // continue as the value is going to be submitted
                    var isChecked = _element.is(":checked");
                    if (isChecked) {
                        return;
                    }

                    // adds the input element representing the unset
                    // switch field value to the proper element
                    _element.append('<input type="hidden" name="' + elementName + '" value="" />');
                });
            });
        };

        var _toggle = function(matchedObject, options, force) {
            // verifies if the current object is disabled (has the
            // disabled class) and if that's the case and the force
            // flag is not set returns the control flow immediately
            var isDisabled = matchedObject.hasClass("disabled");
            if (isDisabled && !force) {
                return;
            }

            // retrieves the current checked state from the matched
            // object and "invert" it to toggle the state
            var checked = matchedObject.is(":checked");
            var _checked = !checked;

            // checks the current matched object by setting
            // the its checked attribute
            matchedObject.attr("checked", _checked);
            matchedObject.prop && matchedObject.prop("checked", _checked);

            // triggers the (value) change event meaning that the value
            // for the switch field has changed (as expected by developer)
            matchedObject.triggerHandler("change");
        };

        var _update = function(matchedObject, options) {
            // retrieves the value and the checked value
            var value = matchedObject.val();
            var checked = matchedObject.attr("data-checked");

            // in case the checked value is the same
            // as the value (current option)
            if (checked === value) {
                // sets the element as checked
                matchedObject.attr("checked", true);
                matchedObject.prop && matchedObject.prop("checked", true);
            }
            // otherwise it's not the selected element
            else {
                // sets the element as unchecked
                matchedObject.attr("checked", false);
                matchedObject.prop && matchedObject.prop("checked", false);
            }
        };

        var _value = function(matchedObject, options) {
            // tries to retrieve the value from options
            var value = options.value;

            // retrieves the current checked state from the matched
            // object, this is considered to be the value of the field
            var checked = matchedObject.is(":checked");

            // in case it's a "normal" get operation (no value defined),
            // the current checked state should be returned
            if (value === undefined) {
                return checked;
            }

            // otherwise the "target" value is valid and the operations is
            // considered to be a set one (instead of get/read), in case
            // the boolean version of the value differs from the current
            // state the field is toggled (forced operation)
            var _checked = !!value;
            _checked !== checked && _toggle(matchedObject, options, true);
        };

        var _reset = function(matchedObject, options) {
            _value(matchedObject, {
                value: false
            });
        };

        // switches over the method
        switch (method) {
            case "value":
                // retrieves the value and returns it to
                // the caller method for proper handling
                var value = _value(matchedObject, options);
                return value;

            case "reset":
                // resets the current switch field value to
                // its default/unchecked value
                _reset(matchedObject, options);
                return true;

            case "default":
                // initializes the plugin
                initialize();
                break;
        }

        // returns the object
        return this;
    };
})(jQuery);
