/**
 * jQuery panel stack plugin, this jQuery plugin provides the base
 * infra-structure for the creation of a panel stack component.
 *
 * @name jquery-panel-stack.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @date March 10, 2010
 * @category jQuery plugin
 * @copyright Copyright (c) 2010 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function($) {
    jQuery.fn.uxpanelstack = function(method, options) {
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
            // retrieves the index to be set on the initialized
            // object, in case one already exists uses it
            var index = matchedObject.data("index") || 0;

            // sets the initial index information in the panel
            // stack so that the first page is displayed and the
            // runs the stack update operation
            matchedObject.data("index", index);
            _update(matchedObject, options);
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
        };

        var _next = function(matchedObject, options) {
            // retrieves the panels associated with the
            // current stack and then counts them obtain
            // the length of the stack
            var panels = jQuery("> .panel", matchedObject);
            var panelsLength = panels.length;

            // retrieves the current index from the matched
            // object to update the current panel index
            var index = matchedObject.data("index");

            // checks if the current index overflows the
            // current count of panels
            if (index == panelsLength - 1) {
                // returns immediately
                return;
            }

            // updates the index value in the matched object
            // and runs the update function on top of the matched
            // object to update the visuals of the stack panel
            matchedObject.data("index", index + 1);
            _update(matchedObject, options);
        };

        var _previous = function(matchedObject, options) {
            // retrieves the current index from the matched
            // object to update the current panel index
            var index = matchedObject.data("index");

            // checks if the current index is zero, in case
            // it's, not possible to go to a previous position
            if (index == 0) {
                // returns immediately
                return;
            }

            // updates the index value in the matched object
            // and runs the update function on top of the matched
            // object to update the visuals of the stack panel
            matchedObject.data("index", index - 1);
            _update(matchedObject, options);
        };

        var _set = function(matchedObject, options) {
            // retrieves the index value to be used to update
            // the stack panel index (argument)
            var index = options["index"] ? options["index"] : 0;

            // updates the index value in the matched object
            // and runs the update function on top of the matched
            // object to update the visuals of the stack panel
            matchedObject.data("index", index);
            _update(matchedObject, options);
        };

        var _update = function(matchedObject, options) {
            // retrieves the current index information, to know
            // which panel should be displayed
            var index = matchedObject.data("index");

            // retrieves the panels associated with the
            // current stack
            var panels = jQuery("> .panel", matchedObject);

            // hides all the panels to allow the first one
            // to be displayed on top of all
            panels.hide();

            // retrieves the current panel in the to be shown
            // and shows it in the current context, note that
            // the visibility attribute is also set
            var currentPanel = jQuery("> .panel:nth(" + index + ")",
                    matchedObject);
            currentPanel.show();
            currentPanel.css("visibility", "visible");
        };

        // switches over the method
        switch (method) {
            case "next" :
                // increments the panel to the matched object
                _next(matchedObject, options);

                // breaks the switch
                break;

            case "previous" :
                // decrements the panel from the matched object
                _previous(matchedObject, options);

                // breaks the switch
                break;

            case "set" :
                // sets the panel from the matched object
                _set(matchedObject, options);

                // breaks the switch
                break;

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
