/**
 * jQuery button group plugin, this jQuery plugin provides the base
 * infra-structure for the creation of a button group component.
 *
 * @name jquery-button-group.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @date March 10, 2010
 * @category jQuery plugin
 * @copyright Copyright (c) 2010 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxbuttongroup = function(method, options) {
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
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves all the buttons associated with the button
            // group so that the click may be handled correctly
            var buttons = jQuery(".button", matchedObject);

            // registers for the click event on the button contained
            // in the button group
            buttons.click(function() {
                        // retrieves the current element
                        var element = jQuery(this);

                        // retrieves the button index (inside the button group)
                        var index = element.index();

                        // retrieves the button group associated with the
                        // button (associated button group) then uses it to
                        // trigger the index changed event, the returning value
                        // for this event must defines if the event should be
                        // completely handled (click enabling)
                        var buttonGroup = element.parents(".button-group");
                        var continueChange = buttonGroup.triggerHandler(
                                "index_changed", [index]);
                        if (continueChange == false) {
                            return;
                        }

                        // retieves all the button associated with the button group
                        // then removes the selected class from them
                        var buttons = jQuery(".button", buttonGroup);
                        buttons.removeClass("selected");

                        // adds the selected class to the current element (selects it)
                        element.addClass("selected");
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
