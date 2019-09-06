if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

/**
 * jQuery panel plugin, this jQuery plugin provides the base infra-structure for
 * the creation of a panel component.
 *
 * @name uxf-panel.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2019 Hive Solutions Lda.
 * @license Apache License, Version 2.0 - http://www.apache.org/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxpanel = function(method, options) {
        // the default values for the plugin
        var defaults = {};

        // sets the default method value
        method = method || "default";

        // sets the default options value
        options = options || {};

        // constructs the options
        options = jQuery.extend(defaults, options);

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
         * Creates the necessary HTML for the component.
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
        var _registerHandlers = function() {};

        var _push = function(matchedObject, options) {
            // retrieves the "new" panel to be pushed
            var panelHtml = options.panel;

            // retrieves the panels list
            var panels = matchedObject.data("panels");

            // composes the panel with the panel item class
            var panel = '<div class="panel-item">' + panelHtml + "</div>";

            // retrieves the last panel and hides it
            var lastPanel = matchedObject.children(".panel-item:last-child");
            lastPanel.hide();

            // adds the "new" panel in the matched object
            matchedObject.append(panel);

            // retrieves the "new" last panel and applies the ux
            // components to it
            lastPanel = matchedObject.children(".panel-item:last-child");
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
            lastPanel = matchedObject.children(".panel-item:last-child");
            lastPanel.show();

            // decrements the number of panels and saves
            // the value in the matched object
            panels--;
            matchedObject.data("panels", panels);
        };

        // switches over the method
        switch (method) {
            case "push":
                // pushes the panel to the matched object
                _push(matchedObject, options);

                // breaks the switch
                break;

            case "pop":
                // pops a panel from the matched object
                _pop(matchedObject, options);

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
