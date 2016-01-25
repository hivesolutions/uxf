/**
 * jQuery menu plugin, this jQuery plugin provides the base infra-structure for
 * the creation of a menu component. This plugin is meant to be used both
 * directly and indirectly as a decorator.
 *
 * @name jquery-menu.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2016 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxmenu = function(method, options) {
        // the default values for the eval
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
        var _appendHtml = function() {};

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // in case the matched object is not defined
            // or in case it's an empty list must return
            // immediatly initialization is not meant to
            // be run (corruption may occur)
            if (!matchedObject || matchedObject.length == 0) {
                return;
            }

            // retrieves the contents section of the menu so
            // that it's possible to register foe events in it
            var menuContents = jQuery(".menu-contents", matchedObject);

            // registers for the show operation in the current object
            // to be able to show its visual contents
            matchedObject.bind("show", function() {
                var element = jQuery(this);
                _show(element, options);
            });

            // registers for the hide operation in the current object
            // to be able to hide its visual contents (as expected)
            matchedObject.bind("hide", function() {
                var element = jQuery(this);
                _hide(element, options);
            });

            // registers/binds the contents of the menu to the show
            // event in order to show the upper/parent menu
            menuContents.bind("show", function() {
                var element = jQuery(this);
                var menu = element.parents(".menu");
                show(menu, options);
            });

            // registers/binds the contents of the menu to the hide
            // event in order to hide the upper/parent menu
            menuContents.bind("hide", function() {
                var element = jQuery(this);
                var menu = element.parents(".menu");
                _hide(menu, options);
            });
        };

        var _show = function(matchedObject, options) {
            var menuContents = jQuery(".menu-contents", matchedObject);
            matchedObject.addClass("active");
            menuContents.show();
            menuContents.triggerHandler("shown");
        };

        var _hide = function(matchedObject, options) {
            var menuContents = jQuery(".menu-contents", matchedObject);
            matchedObject.removeClass("active");
            menuContents.hide();
            menuContents.triggerHandler("hidden");
        };

        // switches over the method, so that the proper execution
        // logic is going to be performed
        switch (method) {
            case "show":
                // runs the show operation for the selected object effectivly
                // showing its inner contents (as expected)
                _show(matchedObject, options);
                break;

            case "hide":
                // runs the hide operation for the selected object effectivly
                // hidding its inner contents (as expected)
                _hide(matchedObject, options);
                break;

            case "default":
                // initializes the plugin, and then breaks the current
                // switch so that no more code is executed for workflow
                initialize();
                break;
        }

        // returns the object
        return this;
    };
})(jQuery);
