/**
 * jQuery select list plugin, this jQuery plugin provides the base
 * infra-structure for the creation of a select list component.
 *
 * @name jquery-select-list.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @date March 10, 2010
 * @category jQuery plugin
 * @copyright Copyright (c) 2010-2012 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function($) {
    jQuery.fn.uxselectlist = function(method, options) {
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
            console.info(matchedObject);
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the various items that exist
            // in the select list
            var listItems = jQuery("li", matchedObject);

            // registers for the click event on the list items
            // to change their selection states
            listItems.click(function(event) {
                        // retrieves the current element reference
                        var element = jQuery(this);

                        if (event.ctrlKey) {
                            var action = "change";
                        } else if (event.shiftKey) {
                            var action = "contiguous";
                        } else {
                            var action = "normal";
                        }

                        // switches over the action to be performed
                        // on the current item selection state
                        switch (action) {
                            case "change" :
                                // checks if the element is currently selected and
                                // adds or removes the selected class from it for
                                // each case (complementary)
                                var isSelected = element.hasClass("selected");
                                isSelected
                                        ? element.removeClass("selected")
                                        : element.addClass("selected");

                                // breaks the switch
                                break;

                            case "contiguous" :
                                console.info(element.index());

                                break;

                            case "normal" :
                                // retrieves the parent of the element as the select
                                // list and then retrieves all the list items from it
                                var selectList = element.parent();
                                var listItems = jQuery("li", selectList);

                                // removes the selected class from all the list items
                                // and then adds then selects the current element
                                listItems.removeClass("selected");
                                element.addClass("selected");

                                // breaks the switch
                                break;
                        }
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
