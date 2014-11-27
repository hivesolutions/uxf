/**
 * jQuery menu link plugin, this jQuery plugin provides the base infra-structure
 * for the creation of a menu link for a menu component.
 *
 * @name jquery-menu-link.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @date March 10, 2010
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2014 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function(jQuery) {
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
            // in case the matched object is not defined
            // or in case it's an empty list must return
            // immediatly initialization is not meant to
            // be run (corruption may occur)
            if (!matchedObject || matchedObject.length == 0) {
                return;
            }

            // retrieves the window and body elements
            var _window = jQuery(window);
            var _body = jQuery("body");

            // retrieves the menu to be able to retrieve the
            // reference to the menu contents element
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

                        // in case the menu link is currently disable must
                        // return immediately to avoid the typical work
                        // to be done (not required)
                        var isDisabled = element.hasClass("disabled");
                        if (isDisabled) {
                            return;
                        }

                        // tries to retrieve the menu selector associated
                        // with the current menu link (this is for custom)
                        // menu references
                        var menuSelector = element.attr("data-menu");

                        // retrieves the menu to retieve the
                        // menu contents
                        var menu = menuSelector
                                ? jQuery(menuSelector)
                                : element.parents(".menu");
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

                        // iterates over each of the other menu in order to be
                        // able to inactivate their owners
                        _menu.each(function(index, element) {
                                    var _element = jQuery(this);
                                    var owner = _element.data("owner");
                                    owner && owner.removeClass("active");
                                });

                        // removes the active class from the visible menus
                        // and hides the menu contents
                        _menu.removeClass("active");
                        _menuContents.hide();
                        _menuContents.triggerHandler("hidden");

                        // in case the menu already has the active class
                        // (the menu is shown)
                        if (isActive) {
                            // tries to retrieve the current owner of the menu
                            // contents and in case it exists removes the active
                            // class from it
                            var owner = menu.data("owner");
                            owner && owner.removeClass("active");

                            // triggers the hide event handler on the
                            // on the menu and removes the active class
                            // from the same menu
                            menu.triggerHandler("hide");
                            menu.removeClass("active");

                            // hides the menu contents
                            menuContents.hide();
                            menuContents.triggerHandler("hidden");

                            // triggers the hidden event handler on the
                            // on the menu
                            menu.triggerHandler("hidden");
                        }
                        // otherwise the menu contents are probably hidden
                        else {
                            // sets the owner of the menu contents as the current
                            // element as it was the responsible for the show of
                            // the contents
                            menu.data("owner", element);
                            element.addClass("active");

                            // triggers the show event handler on the
                            // on the menu and adds the active class
                            // into the same menu
                            menu.triggerHandler("show");
                            menu.addClass("active");

                            // shows the menu contents an then
                            // repositions them in the display
                            menuContents.show();
                            menuContents.triggerHandler("shown");
                            _reposition(menu, menuButton, element);

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

            // registers for the hide event in the menu so
            // that if such event is triggerred the menu
            // is correctly hidden from the environment
            menu.bind("hide", function() {
                        // retrieves the current element and sets it as the
                        // current menu to be used in the function
                        var element = jQuery(this);
                        var menu = element;

                        // tries to retrieve the current owner of the menu
                        // contents and in case it exists removes the active
                        // class from it
                        var owner = menu.data("owner");
                        owner && owner.removeClass("active");

                        // removes the active class from the menu and
                        // then hides the menu contents
                        menu.removeClass("active");
                        menuContents.hide();
                        menuContents.triggerHandler("hidden");
                    });

            // register for the key down event in the body,
            // only in case the registration was not already made
            !isRegistered && _body.keydown(function(event) {
                        // retrieves the element
                        var element = jQuery(this);

                        // retrieves the key value
                        var keyValue = event.keyCode
                                ? event.keyCode
                                : event.charCode ? event.charCode : event.which;

                        // in case the key that was pressed in not the
                        // escape one there's nothing to be done and so
                        // the control flow is returned immediately
                        if (keyValue != 27) {
                            return;
                        }

                        // retrieves the menu to retieve the and uses it to
                        // retrieve the reference to the menu contents
                        var menu = jQuery(".menu.active", element);
                        var menuContents = jQuery(".menu-contents:visible",
                                menu);

                        // checks if the current menu is of type drop
                        // (it must be removed and not hidden)
                        var isDrop = menu.hasClass("drop-menu");

                        // in case the current menu is of type drop
                        // (must be removed)
                        if (isDrop) {
                            // removes the menu from the environment
                            menu.remove();
                        }
                        // otherwise the normal behavior applies (hidding)
                        else {
                            // tries to retrieve the current owner of the menu
                            // contents and in case it exists removes the active
                            // class from it
                            var owner = menu.data("owner");
                            owner && owner.removeClass("active");

                            // removes the active class from the menu and
                            // then hides the menu contents
                            menu.removeClass("active");
                            menuContents.hide();
                            menuContents.triggerHandler("hidden");
                        }
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
                        // (it must be removed and not hidden)
                        var isDrop = menu.hasClass("drop-menu");

                        // in case the current menu is of type drop
                        // (must be removed)
                        if (isDrop) {
                            // removes the menu from the environment
                            menu.remove();
                        }
                        // otherwise the normal behavior applies (hidding)
                        else {
                            // tries to retrieve the current owner of the menu
                            // contents and in case it exists removes the active
                            // class from it
                            var owner = menu.data("owner");
                            owner && owner.removeClass("active");

                            // removes the active class from the menu and
                            // then hides the menu contents
                            menu.removeClass("active");
                            menuContents.hide();
                            menuContents.triggerHandler("hidden");
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
         * @param {Element}
         *            menuButton The button used in the triggering of the menu,
         *            if any.
         * @parm {Element} menuLink The link element used in the triggering of
         *       the menu, if any.
         */
        var _reposition = function(menu, menuButton, menuLink) {
            // retrieves the menu button and contents
            // for the matched object
            menuButton = menuButton || jQuery(".menu-button", menu);
            menuLink = menuLink || jQuery(".menu-link", menu);
            var menuContents = jQuery(".menu-contents", menu);

            // in case no menu link is defined it's not possible
            // to run the reposition operation, not enought information
            // to archive the objective
            if (menuLink.length == 0) {
                return;
            }

            // retrieves the various dimensions from the various elements
            // associated with the menu to be repositioned
            var buttonWidth = menuButton.outerWidth();
            var contentsWidth = menuContents.outerWidth();
            var contentsHeight = menuContents.outerHeight(true);

            // retrieves the value for the border left with ignore value
            // defaulting to innvalid in case no value is retrieved then
            // gathers the value of the auto width flag
            var right = menuLink.attr("data-right") || false;
            var ignoreLeft = menuLink.attr("data-no_left") || false;
            var autoWidth = menuLink.attr("data-auto_width") || false;

            // retrieves the size of the border at the left of the menu
            // contents to be used in the calculus
            var borderLeftWidth = parseInt(menuContents.css("border-left-width"));
            var borderRightWidth = parseInt(menuContents.css("border-right-width"));
            var _borderWidth = borderLeftWidth + borderRightWidth;
            var borderWidth = ignoreLeft ? 0 : parseInt(borderLeftWidth);

            // checks if the menu link is of type reference, for such cases
            // the left position will not be used and checks if the menu is
            // meant to be positioned above the menu link structure
            var isReference = menuLink.attr("data-menu");
            var isTop = menuLink.hasClass("menu-top");

            // in case the auto width flag is set the size of the menu contents
            // must be re-calculated according to the current size of the menu
            // button/link so that it's at least the same value
            if (autoWidth) {
                var _buttonWidth = buttonWidth - _borderWidth;
                menuContents.css("min-width", _buttonWidth + "px");
                contentsWidth = menuContents.outerWidth();
            }

            // calculates the margin to the top so that the menu is positioned
            // a bit above the top of the menu link that originated it and sets
            // it the menu contents in case it's meant that way
            var contentsMarginTop = (contentsHeight + 8) * -1;
            isTop && menuContents.css("margin-top", contentsMarginTop + "px");

            // calculates and sets the menu contents margin left, this should
            // be able to position the menu to the left of the corresponding link
            // in case the menu is meant bo displayed to the right no margin is
            // applies as the menu contents should be displayed to the right already
            var contentsMarginLeft = ((contentsWidth - buttonWidth) - borderWidth)
                    * -1;
            contentsMarginLeft = right ? 0 : contentsMarginLeft;
            !isReference
                    && menuContents.css("margin-left", contentsMarginLeft
                                    + "px");
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
