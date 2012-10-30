/**
 * jQuery menu link plugin, this jQuery plugin provides the base infra-structure
 * for the creation of a menu link for a menu component.
 *
 * @name jquery-menu-link.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @date March 10, 2010
 * @category jQuery plugin
 * @copyright Copyright (c) 2010-2012 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function($) {
    jQuery.fn.uxmenulink = function(method, options) {
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
        var _appendHtml = function() {
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the window and body elements
            var _window = jQuery(window);
            var _body = jQuery("body");

            // retrieves the menu to retieve the
            // menu contents
            var menu = matchedObject.parents(".menu");
            var menuContents = jQuery(".menu-contents", menu);

            // checks if the menu link click event is already
            // registerd in the body and set the variable as
            // true to avoid further registrations
            var isRegistered = _body.data("menu_link_click");
            _body.data("menu_link_click", true);

            // registers for the click in the matched object
            matchedObject.click(function(event) {
                        // retrieves the element
                        var element = jQuery(this);

                        // retrieves the menu to retieve the
                        // menu contents
                        var menu = element.parents(".menu");
                        var menuButton = jQuery("> .menu-button", menu);
                        var menuContents = jQuery(
                                "> .menu-contents:not(.sub-menu)", menu);

                        // retrieves the current set of visible menus and menu
                        // contents to be able to control them
                        var _menu = jQuery(".menu.active");
                        var _menuContents = jQuery(".menu-contents:visible");

                        // checks if the menu is currently active, current
                        // visibility status is based on this flag
                        var isActive = menu.hasClass("active");

                        // removes the active class from the visible menus
                        // and hides the menu contents
                        _menu.removeClass("active");
                        _menuContents.hide();

                        // in case the menu already has the active class
                        // (the menu is shown)
                        if (isActive) {
                            // triggers the hide event handler on the
                            // on the menu and removes the active class
                            // from the same menu
                            menu.triggerHandler("hide");
                            menu.removeClass("active");

                            // hides the menu contents
                            menuContents.hide();

                            // triggers the hidden event handler on the
                            // on the menu
                            menu.triggerHandler("hidden");
                        }
                        // otherwise the menu contents are probably hidden
                        else {
                            // triggers the show event handler on the
                            // on the menu and adds the active class
                            // into the same menu
                            menu.triggerHandler("show");
                            menu.addClass("active");

                            // shows the menu contents an then
                            // repositions them in the display
                            menuContents.show();
                            _reposition(menu);

                            // triggers the shown event handler on the
                            // on the menu
                            menu.triggerHandler("shown");
                        }

                        // stops the event propagation (avoids
                        // extra problems)
                        event.stopPropagation();
                    });

            // registers for the double click in the matched object
            matchedObject.dblclick(function(event) {
                        // stops the event propagation (avoids
                        // extra problems)
                        event.stopPropagation();
                    });

            // registers for the click event in the menu contents
            menuContents.click(function(event) {
                        // stops the event propagation (avoids
                        // unecessary closing of the window)
                        event.stopPropagation();
                    });

            // register for the click event in the body,
            // only in case the registration was not already made
            !isRegistered && _body.click(function(event) {
                        // retrieves the element
                        var element = jQuery(this);

                        // retrieves the menu to retieve the
                        // menu contents
                        var menu = jQuery(".menu.active", element);
                        var menuContents = jQuery(".menu-contents:visible",
                                menu);

                        // checks if the current menu is of type drop
                        var isDrop = menu.hasClass("drop-menu");

                        // in case the current menu is of type drop
                        // (must be removed)
                        if (isDrop) {
                            // removes the menu from the environment
                            menu.remove();
                        }
                        // otherwise the normal behavior applies (hidding)
                        else {
                            // removes the active class from the manu
                            menu.removeClass("active");

                            // hides the menu contents
                            menuContents.hide();
                        }
                    });

            // register for the right click event in the body,
            // only in case the registration was not already made
            !isRegistered && _window.resize(function() {
                        // retrieves the currently active drop menus
                        // to be able to remove them
                        var menu = jQuery(".drop-menu.active");

                        // removes the (drop) menu
                        menu.remove();
                    });

            !isRegistered && _window.scroll(function() {
                        // retrieves the currently active drop menus
                        // to be able to remove them
                        var menu = jQuery(".drop-menu.active");

                        // removes the (drop) menu
                        menu.remove();
                    });
        };

        /**
         * Repositions the given menu element in order to be at the right of the
         * menu link.
         *
         * @param {Element}
         *            menu The menu to be repositioned.
         */
        var _reposition = function(menu) {
            // retrieves the menu button and contents
            // for the matched object
            var menuButton = jQuery(".menu-button", menu);
            var menuContents = jQuery(".menu-contents", menu);

            // retrieves the elements widths
            var menuButtonWidth = menuButton.outerWidth();
            var menuContentsWidth = menuContents.outerWidth();

            // calculates and sets the menu contents margin left
            var menuContentsMarginLeft = ((menuContentsWidth - menuButtonWidth) - 2)
                    * -1;
            menuContents.css("margin-left", menuContentsMarginLeft + "px");
        };

        // switches over the method
        switch (method) {
            case "reposition" :
                // repositions the matched object (menu)
                _reposition(matchedObject);

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
