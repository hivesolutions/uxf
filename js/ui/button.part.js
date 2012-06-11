/**
 * jQuery button plugin, this jQuery plugin provides the base infra-structure
 * for the creation of a button component.
 *
 * @name jquery-button.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @date March 10, 2010
 * @category jQuery plugin
 * @copyright Copyright (c) 2010 Hive Solutions Lda.
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

                        // sets the "new" element data
                        _element.data("link", link);
                        _element.data("submit", submit);
                        _element.data("action", action);
                    });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the body
            var _body = jQuery("body");

            // registers for the click event
            matchedObject.click(function() {
                        // retrieves the element
                        var element = jQuery(this);

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
                    });

            // registers for focus event
            matchedObject.mousedown(function() {
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

        var __submit = function(matchedObject, options) {
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
            // retrieves the parent form
            var parentForm = matchedObject.parents("form");

            // retrieves the current action from the matched
            // object and then updates the action attribute
            // in the parent form
            var action = matchedObject.data("action");
            parentForm.attr("action", action);
        };

        var __link = function(matchedObject, options) {
            // retrieves the matched object link
            var link = matchedObject.data("link");

            // sets the "new" document location
            document.location = link;
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
