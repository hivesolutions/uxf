/**
 * jQuery cross list plugin, this jQuery plugin provides the base
 * infra-structure for the creation of a cross list component.
 *
 * @name jquery-cross-list.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @date March 10, 2010
 * @category jQuery plugin
 * @copyright Copyright (c) 2010-2012 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function($) {
    jQuery.fn.uxcrosslist = function(method, options) {
        // the default values for the panel
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
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves both the target and the source list
            // for the currently selected object
            var sourceList = jQuery(".source-section .select-list",
                    matchedObject);
            var targetList = jQuery(".target-section .select-list",
                    matchedObject);

            // retrieves the arrows for the currently matched object
            // these "buttons" control the flow between sections
            var arrowLeft = jQuery(".arrow-left", matchedObject);
            var arrowRight = jQuery(".arrow-right", matchedObject);

            sourceList.bind("selected", function(event, element) {
                        element.removeClass("selected");
                        targetList.append(element);
                    });

            targetList.bind("selected", function(event, element) {
                        element.removeClass("selected");
                        sourceList.append(element);
                    });

            arrowLeft.click(function() {
                        var element = jQuery(this);
                        var crossList = element.parents(".cross-list");

                        var sourceList = jQuery(".source-section .select-list",
                                crossList);
                        var targetList = jQuery(".target-section .select-list",
                                crossList);

                        var selectedItems = jQuery("li.selected", targetList);
                        selectedItems.removeClass("selected");
                        sourceList.append(selectedItems);
                    });

            arrowRight.click(function() {
                        var element = jQuery(this);
                        var crossList = element.parents(".cross-list");

                        var sourceList = jQuery(".source-section .select-list",
                                crossList);
                        var targetList = jQuery(".target-section .select-list",
                                crossList);

                        var selectedItems = jQuery("li.selected", sourceList);
                        selectedItems.removeClass("selected");
                        targetList.append(selectedItems);
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
