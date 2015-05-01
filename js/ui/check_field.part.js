/**
 * jQuery check field plugin, this jQuery plugin provides the base
 * infra-structure for the creation of a check field component.
 *
 * @name jquery-check-field.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2015 Hive Solutions Lda.
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
        };

        var _toggle = function(matchedObject, options) {
            // retrieves the current checked state from the matched
            // object and "invert" it to toggle the state
            var checked = matchedObject.attr("checked");
            var _checked = checked ? false : true;

            // checks the current matched object by setting
            // the its checked attribute
            matchedObject.attr("checked", _checked);
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
