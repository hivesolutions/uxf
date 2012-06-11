/**
 * jQuery radio field plugin, this jQuery plugin provides the base
 * infra-structure for the creation of a radio field component.
 *
 * @name jquery-radio-field.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @date March 10, 2010
 * @category jQuery plugin
 * @copyright Copyright (c) 2010 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxradiofield = function(options) {
        // the default values for the radio field
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

                        // retrives the value and the checked value
                        var value = _element.attr("value");
                        var checked = _element.attr("data-checked");

                        // in case the checked value is the same
                        // as the value (current option)
                        if (checked == value) {
                            // sets the element as checked
                            _element.attr("checked", true);
                        }
                        // otherwise it's not the selected element
                        else {
                            // sets the element as unchecked
                            _element.attr("checked", false);
                        }
                    });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
