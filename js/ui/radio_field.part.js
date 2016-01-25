/**
 * jQuery radio field plugin, this jQuery plugin provides the base
 * infra-structure for the creation of a radio field component.
 *
 * @name jquery-radio-field.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2015 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxradiofield = function(method, options) {
        // the default values for the radio field
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
            // sets the data object reference in the selected objects
            // so that they may be used latter
            matchedObject.uxobject("radiofield");

            // iterates over all the matched objects to update their
            // current internal state values
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
            // retrieves the (possible) next radio field label
            // to register it for checking
            var radioFieldLabel = matchedObject.next(".radio-field-label");

            // registers the radio field label for the click
            // event to check the associated radio field
            radioFieldLabel.click(function() {
                // retrieves the current element and uses it to retrieve
                // the previous radio field
                var element = jQuery(this);
                var radioField = element.prev(".radio-field");

                // checks the "just" retrieved radio field, this should
                // enable its boolean value
                _check(radioField, options);
            });
        };

        var _check = function(matchedObject, options, force) {
            // verifies if the current object is disabled (has the
            // disabled class) and if that's the case and the force
            // flag is not set returns the control flow immediately
            var isDisabled = matchedObject.hasClass("disabled");
            if (isDisabled && !force) {
                return;
            }

            // checks the current matched object by setting
            // the its checked attribute
            matchedObject.attr("checked", true);

            // triggers the (value) change event meaning that the value
            // for the radio field has changed (as expected by developer)
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

        var _reset = function(matchedObject, options) {
            // removes the checked attribute from the matched
            // object so that the element becomes unselected
            matchedObject.removeAttr("checked");
        };

        // switches over the method
        switch (method) {
            case "reset":
                // runs the reset method in the current element
                _reset(matchedObject, options);

                // breaks the switch
                break;

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
