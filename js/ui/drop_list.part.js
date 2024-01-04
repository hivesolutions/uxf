if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

/**
 * jQuery drop list plugin, this jQuery plugin provides the base infra-structure
 * for the creation of a drop list component. To be used in graphical operations
 * where the list of elements to be selected (both text or graphical) should not
 * allways be viewable and its visibility should be "togglable".
 *
 * @name uxf-drop-list.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2024 Hive Solutions Lda.
 * @license Apache License, Version 2.0 - http://www.apache.org/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxdroplist = function(method, options) {
        // the default values for the drop list
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
            // sets the ux global object representation as drop
            // list, this value may be used latter for fast ux
            // object type access (hash based conditions)
            matchedObject.uxobject("droplist");

            // retrieves the reference to the options part of the
            // drop list to be able to change properly
            var dropOptions = jQuery(".drop-options", matchedObject);

            // adds the menu class to the current object and then
            // adds the menu contents to the drop options
            matchedObject.addClass("menu");
            dropOptions.addClass("menu-contents");
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the complete reference to the
            var dropItem = jQuery(".drop-item", matchedObject);
            var dropItems = jQuery(".drop-options > li", matchedObject);

            // registers for the click event on the main drop item contained
            // in the drop list so that the drop list contents are displayed
            dropItem.click(function(event) {
                // retrieves the current element and uses it to retrieve the
                // parent drop list and the associated drop options
                var element = jQuery(this);
                var dropList = element.parents(".drop-list");
                var dropOptions = jQuery(".drop-options", dropList);

                // verifies if the drop list is currently active so that
                // the toggle operation may be performed
                var isActive = dropList.hasClass("active");

                // retrieves the current set of visible menus and menu
                // contents to be able to control them
                var _menu = jQuery(".menu.active");
                var _menuContents = jQuery(".menu-contents:visible");

                // iterates over each of the other menu in order to be
                // able to inactivate their owners
                _menu.each(function(index, element) {
                    var _element = jQuery(this);
                    var owner = _element.data("owner");
                    owner && owner.removeClass("active");
                });

                // triggers the hide event for all the menu and menu contents
                // so that their contents are properly disabled/hidden
                _menu.trigger("hide");
                _menuContents.trigger("hide");

                // verifies the current drop list status to check if it's
                // currently acive or not in case it's active hides it
                // and then removes the active class
                if (isActive) {
                    dropOptions.hide();
                    dropList.removeClass("active");
                }
                // otherwise shows it and then adds the active class to it
                // so that the drop list contents are displayed
                else {
                    dropOptions.show();
                    dropList.addClass("active");
                }

                // stops the event propagation so that no side effects arise
                // from this click event
                event.stopPropagation();
            });

            // registers for the click event on all of the drop items contained
            // in the drop list so that the value of the drop list may be updated
            // in accordance with the selected item
            dropItems.click(function() {
                // retrieves the current element and uses it to retrieve the parent
                // drop list element, the associated drop item and the various (other)
                // items from the current drop list
                var element = jQuery(this);
                var dropList = element.parents(".drop-list");
                var dropItem = jQuery(".drop-item", dropList);
                var dropItems = jQuery(".drop-options > li", dropList);

                // retrieves the HTML based contents and the "logical" value for the
                // currently selected element, to be used in the update
                var contents = element.html();
                var value = element.attr("data-value") || "";

                // updates both the drop item hrml contents with the value of the selected
                // element and also the drop list "logical" value
                dropItem.html(contents);
                dropList.attr("data-value", value);

                // removes the active class from the complete set of drop items and
                // then adds the active class to the "clicked" element
                dropItems.removeClass("active");
                element.addClass("active");

                // triggers the selected event in the drop list with the current selected
                // element and value as arguments
                dropList.trigger("selected", [element, value]);
            });

            // iterates over each of the drop list elements that were
            // selected to be able to register them for form submission
            matchedObject.each(function(index, element) {
                // retrieves the current element in iteration and the
                // associated form as the parent form
                var _element = jQuery(this);
                var parentForm = _element.parents("form");

                // registers for the pre submit event, so that it's possible
                // to create an hidden input representing the value that
                // will be submited accordint to the drop list
                parentForm.bind("pre_submit", function() {
                    // retrieves the name of the element, this value is
                    // going to be used in the input element to be create
                    // in case the name does not exists no submission of
                    // values is created (returns immediately)
                    var name = _element.attr("name");
                    if (!name) {
                        return;
                    }

                    // tries to retrieve the value from the currently selected
                    // element and in case the value is not valid returns
                    var value = _element.attr("data-value");
                    if (!value) {
                        return;
                    }

                    // creates the hidden input field representing the selected item
                    // and prepends it to the current drop list element
                    _element.prepend(
                        '<input type="hidden" name="' + name + '" value="' + value + '" />'
                    );
                });
            });
        };

        var _value = function(matchedObject, options) {
            // retrieves the current value of the object as the value
            // of the value data attribute in the element and returns
            // it to the caller method (value returning)
            var value = matchedObject.attr("data-value");
            return value;
        };

        // switches over the method
        switch (method) {
            case "value":
                // retrieves the value
                var value = _value(matchedObject, options);

                // returns the value
                return value;

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
