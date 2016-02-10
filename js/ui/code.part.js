/**
 * jQuery code plugin, this jQuery plugin provides the base infra-structure for
 * the creation of a code component.
 *
 * @name jquery-check-field.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2016 Hive Solutions Lda.
 * @license Apache License, Version 2.0 - http://www.apache.org/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxcode = function(options) {
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
            matchedObject.each(function(index, element) {
                // retrieves the reference to the current element in iteration
                // and verifies it has already been highlighted
                var _element = jQuery(this);
                var highlighted = _element.data("highlighted");
                if (highlighted) {
                    return;
                }

                // retrieves the reference to the dom element
                // associated with the current element and runs
                // the highlight operation in it setting the run
                // flag in it afterwards
                var domElement = _element[0];
                Prism.highlightElement(domElement);
                _element.data("highlighted", true);
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {};

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
