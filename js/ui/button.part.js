/**
 * jQuery button plugin, this jQuery plugin provides the base infra-structure
 * for the creation of a button component.
 *
 * @name jquery-button.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2016 Hive Solutions Lda.
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
                var message = _element.attr("data-message");
                var show = _element.attr("data-show");
                var window = _element.attr("data-window");
                var windowOpen = _element.attr("data-window_open");

                // sets the "new" element data
                _element.data("link", link);
                _element.data("submit", submit);
                _element.data("action", action);
                _element.data("message", message);
                _element.data("show", show);
                _element.data("window", window);
                _element.data("window_open", windowOpen);
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

                // verifies if the button is currently disabled
                // and in such cases prevents the propagation and
                // returns control immediately to the caller method
                var isDisabled = element.hasClass("disabled");
                if (isDisabled) {
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                    return;
                }

                // checks if the current click is from a middle
                // button and in such case sets the new window
                // option to open the link in a new window
                var window = event.which == 2;
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
                    // retrieves the reference to the body element
                    // then removes the click class from the element
                    // and unbinds the element from the mouse up event
                    var _body = jQuery("body");
                    element.removeClass("click");
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
                // so that the button may be disabled registers
                // also for the unlock event so that the disabled
                // class is remove in such ocasions
                var parentForm = _element.parents("form");
                parentForm.bind("pre_submit", function() {
                    // verifies if the button is a child of a form
                    // success element for such cases the disable is
                    // prevented as disabling it would create problems
                    var formSuccess = _element.parents(".form-success");
                    if (formSuccess.length > 0) {
                        return;
                    }

                    // disables the button element in order
                    // to avoid further submits
                    _element.uxdisable();
                });
                parentForm.bind("unlock", function() {
                    // re-enables the button to the normal state
                    // (because the form is in the normal state again)
                    _element.uxenable();
                });
            });
        };

        var __trigger = function(matchedObject, options) {
            // retrieves the reference to the global body
            // object that is going to be used to trigger
            // some of the behavior
            var _body = jQuery("body");

            // verifies if the current button is of type confirm
            // if that's the case a confirmation must be first processed
            // and only then the peopr rediction is done
            var isConfirm = matchedObject.hasClass("button-confirm");

            // tries to retrieve the message that is going to be used in
            // case the confirm option is enabled for the button
            var message = matchedObject.data("message");

            // makes sure that a confirmation message is defined and only
            // for such situations the confirmation mode is set otherwise
            // the "normal" action mode is used (uses flag validation)
            isConfirm = isConfirm && message;

            // calls the confirm window in the document, because the action
            // must be first validated before any redirection occurs
            isConfirm && _body.uxconfirm(message, function(result) {
                // in case the result is cancel (false),
                // avoids execution and returns immediately
                if (result == false) {
                    return;
                }

                // executes the "punching" of the button this should trigger
                // the proper behavior to be executed
                __punch(matchedObject, options);
            });

            // in case the is confirm flag is set the control flow must
            // return immediately to the caller function to avoid any
            // extra behavior from being executed (must be validated)
            if (isConfirm) {
                return;
            }

            // executes the "punching" of the button this should trigger
            // the proper behavior to be executed
            __punch(matchedObject, options);
        };

        var __punch = function(matchedObject, options) {
            // retrieves the current matched object as the
            // element, this is going to be used in the function
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
            var show = element.data("show");
            var windowOpen = element.data("window_open");

            // links the element in case the link flag is set
            link && __link(element, options);

            // "actions" the element in case the action flag is set
            action && __action(element, options);

            // submits the element in case the submit flag is set
            submit && __submit(element, options);

            // in case the show value exists triggers the show operation
            // for the defined selector in the button
            show && __show(element, options);

            // opens the window associated with the provided selector
            // it should be displayed as modal in the current viewport
            windowOpen && __windowOpen(element, options);
        };

        var __submit = function(matchedObject, options) {
            // in case the window flag is set returns immediately
            // no need to submit the form
            var _window = matchedObject.data("window") || options["window"];
            if (_window) {
                return;
            }

            // retrieves the parent form reference so that
            // the proper submit action may be performed
            var parentForm = matchedObject.parents("form");

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
            _window ? window.open(link, "_blank") : jQuery.uxlocation(link);
        };

        var __show = function(matchedObject, options) {
            // retrieves the show value from the matched object
            // this valud should contain the target selector
            var show = matchedObject.data("show");

            // retrieves the target to be show and display it on
            // the current viewport using the event as trigger
            var target = jQuery(show);
            target.triggerHandler("show");
        };

        var __windowOpen = function(matchedObject, options) {
            // retrieves the window open value from the matched object
            // this valud should contain the window selector
            var windowOpen = matchedObject.data("window_open");

            // retrieves the window to be show and display it on
            // the current viewport
            var window = jQuery(windowOpen);
            window.uxwindow("show");
        };

        // switches over the method
        switch (method) {
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
