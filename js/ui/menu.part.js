if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

/**
 * jQuery menu plugin, this jQuery plugin provides the base infra-structure for
 * the creation of a menu component. This plugin is meant to be used both
 * directly and indirectly as a decorator.
 *
 * @name uxf-menu.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2019 Hive Solutions Lda.
 * @license Apache License, Version 2.0 - http://www.apache.org/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxmenu = function(method, options) {
        // the default values for the eval
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
        var _appendHtml = function() {};

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // in case the matched object is not defined
            // or in case it's an empty list must return
            // immediatly initialization is not meant to
            // be run (corruption may occur)
            if (!matchedObject || matchedObject.length === 0) {
                return;
            }

            // retrieves the reference to the parent body element
            // to be used in global registration
            var _body = jQuery("body");

            // retrieves the contents section of the menu so
            // that it's possible to register foe events in it
            var menuContents = jQuery(".menu-contents", matchedObject);

            // checks if the menu value is already
            // registered in the body and sets the variable as
            // true to avoid further registrations
            var isRegistered = _body.data("menu");
            _body.data("menu", true);

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
                _show(menu, options);
            });

            // registers/binds the contents of the menu to the hide
            // event in order to hide the upper/parent menu
            menuContents.bind("hide", function() {
                var element = jQuery(this);
                var menu = element.parents(".menu");
                _hide(menu, options);
            });

            // registers for the global hide modal event
            // so that the menu is properly hidden
            !isRegistered &&
                _body.bind("hide_modal", function() {
                    // retrieves the current element (body) and uses it
                    // to retrieve the complete set of menus
                    var element = jQuery(this);
                    var menus = jQuery(".menu", element);

                    // iterates over the complete set of menus present
                    // to be able to hide everyone
                    menus.each(function() {
                        // runs the hide operation for the current
                        // element (menu in iteration)
                        var _element = jQuery(this);
                        _hide(_element, options);
                    });
                });
        };

        var _show = function(matchedObject, options) {
            var _body = jQuery("body");
            var menuContents = jQuery(".menu-contents", matchedObject);
            _body.triggerHandler("hide_modal");
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
