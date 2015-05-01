/**
 * jQuery panel plugin, this jQuery plugin provides the base infra-structure for
 * the creation of a panel component.
 *
 * @name jquery-panel.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2015 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxpanel = function(method, options) {
        // the default values for the plugin
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
            // creates the panels (count) value
            var panels = 0;

            // starts the panels list in the matched object
            matchedObject.data("panels", panels);
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
        };

        var _push = function(matchedObject, options) {
            // retrieves the "new" panel to be pushed
            var panel = options["panel"];

            // retrieves the panels list
            var panels = matchedObject.data("panels");

            // composes the panel with the panel item class
            var panel = "<div class=\"panel-item\">" + panel + "</div>";

            // retrieves the last panel and hides it
            var lastPanel = matchedObject.children(".panel-item:last-child");
            lastPanel.hide();

            // adds the "new" panel in the matched object
            matchedObject.append(panel);

            // retrieves the "new" last panel and applies the ux
            // components to it
            var lastPanel = matchedObject.children(".panel-item:last-child");
            lastPanel.uxapply();

            // increments the number of panels and saves
            // the value in the matched object
            panels++;
            matchedObject.data("panels", panels);
        };

        var _pop = function(matchedObject, options) {
            // retrieves the panels list
            var panels = matchedObject.data("panels");

            // retrieves the last panel and removes it
            var lastPanel = matchedObject.children(".panel-item:last-child");
            lastPanel.remove();

            // retrieves the "new" last panel and shows it
            var lastPanel = matchedObject.children(".panel-item:last-child");
            lastPanel.show();

            // decrements the number of panels and saves
            // the value in the matched object
            panels--;
            matchedObject.data("panels", panels);
        };

        // switches over the method
        switch (method) {
            case "push" :
                // pushes the panel to the matched object
                _push(matchedObject, options);

                // breaks the switch
                break;

            case "pop" :
                // pops a panel from the matched object
                _pop(matchedObject, options);

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
