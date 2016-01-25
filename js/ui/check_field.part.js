/**
 * jQuery check field plugin, this jQuery plugin provides the base
 * infra-structure for the creation of a check field component.
 *
 * @name jquery-check-field.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2016 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxcheckfield = function(options) {
        // the default values for the check field
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
            // iterates over all the matched object
            matchedObject.each(function(index, element) {
                // retrieves the element refence
                var _element = jQuery(element);
                _update(_element, options);
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the (possible) next check field label
            // to register it for checking
            var checkFieldLabel = matchedObject.next(".check-field-label");

            // registers the check field label for the click
            // event to check the associated check field
            checkFieldLabel.click(function() {
                // retrieves the current element and uses it to retrieve
                // the previous check field
                var element = jQuery(this);
                var checkField = element.prev(".check-field");

                // toggles the "just" retrieved check field, this should
                // change its boolean value
                _toggle(checkField, options);
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
                    // current tag field (avoid duplicated submission)
                    var inputs = jQuery("input", _element)
                    inputs.remove("input");

                    // in case the current element is checked no need to
                    // continue as the
                    var isChecked = _element.is(":checked");
                    if (isChecked) {
                        return;
                    }

                    // adds the input element representing the unset
                    // check field value to the proper element
                    _element.append("<input type=\"hidden\" name=\"" + elementName +
                        "\" value=\"\" />");
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
            var checked = matchedObject.attr("checked");
            var _checked = checked ? false : true;

            // checks the current matched object by setting
            // the its checked attribute
            matchedObject.attr("checked", _checked);

            // triggers the (value) change event meaning that the value
            // for the check field has changed (as expected by developer)
            matchedObject.triggerHandler("change");
        };

        var _update = function(matchedObject, options) {
            // retrives the value and the checked value
            var value = matchedObject.val();
            var checked = matchedObject.attr("data-checked");

            // in case the checked value is the same
            // as the value (current option)
            if (checked == value) {
                // sets the element as checked
                matchedObject.attr("checked", true);
            }
            // otherwise it's not the selected element
            else {
                // sets the element as unchecked
                matchedObject.attr("checked", false);
            }
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
