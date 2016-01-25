/**
 * jQuery replacer plugin, this jQuery plugin provides the base infra-structure
 * for the creation of a replacer component.
 *
 * @name jquery-replacer.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2016 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxreplacer = function(options) {
        // the default values for the replacer
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
            // iterates over all the matched objects
            // to check for target value existence
            matchedObject.each(function(index, element) {
                // retrieves the replacer
                var replacer = jQuery(element);

                // retrieves the selector value for the target
                // and then uses it to retrieve the target
                var targetSelector = replacer.attr("data-target");
                var noAuto = replacer.attr("data-no_auto");
                var target = jQuery(targetSelector);

                // retrieves the target element value so that it's
                // possible to check if the target should be automaitcally
                // shown (replaced)
                var value = target.uxvalue();

                // replaces the elements (not focusing in the
                // target element) because the target element
                // already contains a value, this is only done
                // when the not auto attribute is not set
                !noAuto && value && _replace(replacer, options, false);
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // register for the click event on the matched
            // object (replacement action)
            matchedObject.click(function() {
                // retrieves the element
                var element = jQuery(this);

                // replaces the elements (focusing in the
                // target element)
                _replace(element, options, true);
            });
        };

        var _replace = function(matchedObject, options, focus) {
            // retrieves the selector value for the target
            // and then uses it to retrieve the target
            var targetSelector = matchedObject.attr("data-target");
            var target = jQuery(targetSelector);

            // checks if the current target is a text field or a
            // text area in case it's not the target for focus
            // should be a sub element that is a text field (or area)
            var isTextField = target.hasClass("text-field") || target.hasClass("text-area");
            focusTarget = isTextField ? target : jQuery(
                ".text-field, .text-area", target);

            // hides the matched object and then shows (and focus)
            // the target (element)
            matchedObject.hide();
            target.show();
            focus && focusTarget.focus();
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
