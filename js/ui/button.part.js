/**
 * jQuery button plugin, this jQuery plugin provides the base infra-structure
 * for the creation of a button component.
 *
 * @name jquery-button.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @date March 10, 2010
 * @category jQuery plugin
 * @copyright Copyright (c) 2010-2012 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxbutton = function(method, options) {
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
            // iterates over all the matched objects
            // to update the submit values
            matchedObject.each(function(index, element) {
                        // retrieves the element reference
                        var _element = jQuery(element);

                        // retrieves the element attribute value
                        var link = _element.attr("data-link");
                        var submit = _element.attr("data-submit");
                        var action = _element.attr("data-action");
                        var window = _element.attr("data-window");

                        // sets the "new" element data
                        _element.data("link", link);
                        _element.data("submit", submit);
                        _element.data("action", action);
                        _element.data("window", window);
                    });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the body
            var _body = jQuery("body");

            // registers for the click event
            matchedObject.click(function(event) {
                        // retrieves the element in order trigger
                        // the action operation
                        var element = jQuery(this);

                        // checks if the current click is from a middle
                        // button and in such case sets the new window
                        // option to open the link in a new window
                        var window = event.which == 2
                        options["window"] = window;

                        // triggers the handling of the click event to
                        // the button sub system
                        __trigger(element, options);
                    });

            // registers for focus event
            matchedObject.mousedown(function(event) {
                        // retrieves the element
                        var element = jQuery(this);

                        // checks if the button is disabled in case
                        // it is, nothing should be done returns the
                        // control to the caller function immediately
                        var isDisabled = element.hasClass("disabled");
                        if (isDisabled) {
                            return;
                        }

                        // adds the click class to the element
                        element.addClass("click");

                        // creates the mouse up handler function so that
                        // there is a clojure in the element
                        var _mouseUpHandler = function(event) {
                            // retrieves the body
                            var _body = jQuery("body");

                            // removes the click class from the element
                            element.removeClass("click");

                            // unbinds the mouse up event from the body
                            _body.unbind("mouseup", _mouseUpHandler);
                        };

                        // register for the mouse up in the body
                        _body.mouseup(_mouseUpHandler);

                        // checks if the current click is a middle click
                        // and in such case stops the propagation of the
                        // event avoid the default behavior
                        var isMiddle = event.which == 2;
                        if (isMiddle) {
                            event.stopPropagation();
                            event.preventDefault();
                        }
                    });

            // iterates over each of the buttons to
            // register for their specific handlers
            matchedObject.each(function(index, element) {
                        // retrieves the element reference
                        var _element = jQuery(element);

                        // retrieves the parent form and then
                        // registers for the submit event on them
                        // so that the button may be disabled
                        var parentForm = _element.parents("form");
                        parentForm.submit(function() {
                                    // adds the disabled class to the button
                                    // to avoid further submits
                                    _element.addClass("disabled");
                                });
                    });
        };

        var __trigger = function(matchedObject, options) {
            // retrieves the current matched object as the
            // element
            var element = matchedObject;

            // checks if the button is disabled in case
            // it is, nothing should be done returns the
            // control to the caller function immediately
            var isDisabled = element.hasClass("disabled");
            if (isDisabled) {
                return;
            }

            // retrieves the action flags from the element
            var link = element.data("link");
            var action = element.data("action");
            var submit = element.data("submit");

            // links the element in case the link flag is set
            link && __link(element, options);

            // "actions" the element in case the action flag is set
            action && __action(element, options);

            // submits the element in case the submit flag is set
            submit && __submit(element, options);
        };

        var __submit = function(matchedObject, options) {
            // in case the window flag is set returns immediately
            // no need to submit the form
            var _window = matchedObject.data("window") || options["window"];
            if (_window) {
                return;
            }

            // retrieves the parent form
            var parentForm = matchedObject.parents("form");

            // adds the disabled class to the matched
            // object (avoids duplicate submit)
            matchedObject.addClass("disabled");

            // submits the parent form, triggering
            // the change in the current document
            parentForm.submit();
        };

        var __action = function(matchedObject, options) {
            // in case the window flag is set returns immediately
            // no need to take any action
            var _window = matchedObject.data("window") || options["window"];
            if (_window) {
                return;
            }

            // retrieves the parent form
            var parentForm = matchedObject.parents("form");

            // retrieves the current action from the matched
            // object and then updates the action attribute
            // in the parent form
            var action = matchedObject.data("action");
            parentForm.attr("action", action);
        };

        var __link = function(matchedObject, options) {
            // retrieves the matched object link and the
            // (open in) window flag
            var link = matchedObject.data("link");
            var _window = matchedObject.data("window") || options["window"];

            // checks the window flag and in case it's set
            // opens a new window with the link otherwise
            // sets the "new" document location in
            _window ? window.open(link, "_blank") : document.location = link;
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
