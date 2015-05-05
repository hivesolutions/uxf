/**
 * jQuery drop down plugin, this jQuery plugin provides the base infra-structure
 * for the creation of a drop down component. Should be used for situations
 * where a menu should be displayed uppon a button based action.
 *
 * @name jquery-drop-down.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2015 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxdropdown = function(method, options) {
        // the default values for the drop down
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
            // in case the matched object is not defined
            // or in case it's an empty list must return
            // immediatly initialization is not meant to
            // be run (corruption may occur)
            if (!matchedObject || matchedObject.length == 0) {
                return;
            }

            // creates the upper structure for the drop down, this should
            // include the button part so that it's possible to active the
            // drop down contents using the "usual" manner
            matchedObject.wrap("<div class=\"drop-down-container\"></div>");
            var container = matchedObject.parents(".drop-down-container");
            container.prepend("<div class=\"button button-drop-down\"></div>");

            // iterates over the complete set of drop down elements so that
            // it's possible to properly set each button's name
            matchedObject.each(function(index, element) {
                        var _element = jQuery(this);
                        var container = _element.parents(".drop-down-container");
                        var button = jQuery(".button-drop-down", container);
                        var name = _element.attr("data-name");
                        var classes = _element.attr("class") || "";
                        var buttonClasses = button.attr("class") || "";
                        button.text(name);
                        button.attr("class", buttonClasses + " " + classes);
                        button.removeClass("drop-down");
                    });
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

            // retrieves the reference to the various elements that are
            // to be used in the event handling registration
            var _body = jQuery("body");
            var container = matchedObject.parents(".drop-down-container");
            var button = jQuery(".button-drop-down", container);
            var elements = jQuery("> li", matchedObject);

            // checks if the drop downk click event is already
            // registerd in the body and set the variable as
            // true to avoid further registrations
            var isRegistered = _body.data("drop_down_click");
            _body.data("drop_down_click", true);

            // registers for the click operation in the drop down button
            // that is going to toggle the current drop down list visibility
            button.click(function(event) {
                        var element = jQuery(this);
                        var container = element.parents(".drop-down-container");
                        var dropDown = jQuery(".drop-down", container);
                        _toggle(dropDown, options);
                        event.stopPropagation();
                    });

            // registers for the click operation in the element so that the
            // visibility of the curren drop down is hidden
            elements.click(function(event) {
                        var element = jQuery(this);
                        var dropDown = element.parents(".drop-down");
                        _hide(dropDown, options);
                        event.stopPropagation();
                    });

            // registers for the "basic" hide operation of the current
            // drop down so that the element is shown
            matchedObject.bind("hide", function() {
                        var element = jQuery(this);
                        _hide(element, options);
                    });

            // register for the key down event in the body,
            // only in case the registration was not already made
            !isRegistered && _body.keydown(function(event) {
                // retrieves the element
                var element = jQuery(this);

                // retrieves the key value
                var keyValue = event.keyCode ? event.keyCode : event.charCode
                        ? event.charCode
                        : event.which;

                // in case the key that was pressed in not the
                // escape one there's nothing to be done and so
                // the control flow is returned immediately
                if (keyValue != 27) {
                    return;
                }

                // retrieves the reference to the complete set of drop down
                // conatainers that are visible for the current body and then
                // runs the hide operation for the associated drop down
                var container = jQuery(".drop-down-container.visible", element);
                var dropDown = jQuery(".drop-down", container);
                _hide(dropDown, options);
            });

            !isRegistered && _body.click(function(event) {
                // retrieves the reference to the current element, this should
                // be a top level body element (from dom structure)
                var element = jQuery(this);

                // retrieves the reference to the complete set of drop down
                // conatainers that are visible for the current body and then
                // runs the hide operation for the associated drop down
                var container = jQuery(".drop-down-container.visible", element);
                var dropDown = jQuery(".drop-down", container);
                _hide(dropDown, options);
            });
        };

        var _toggle = function(matchedObject, options) {
            // verifies the current visibility of the object and then uses
            // the value to decide the operation to be performed
            var isVisible = matchedObject.is(":visible");
            if (isVisible) {
                _hide(matchedObject, options);
            } else {
                _show(matchedObject, options);
            }
        };

        var _show = function(matchedObject, options) {
            var container = matchedObject.parents(".drop-down-container");
            container.addClass("visible");
        };

        var _hide = function(matchedObject, options) {
            var container = matchedObject.parents(".drop-down-container");
            container.removeClass("visible");
        };

        // switches over the method that is going to be performed
        // for the current operation (as requested)
        switch (method) {
            case "show" :
                // runs the show operation on the currently matched
                // object so that the proper contents are displayed
                _show(matchedObject, options);
                break;

            case "hide" :
                // runs the hide operation on the currently matched
                // object so that the proper contents are hidden
                _hide(matchedObject, options);
                break;

            case "default" :
                // initializes the plugin and then breaks the current
                // switch (no more operations)
                initialize();
                break;
        }

        // returns the object
        return this;
    };
})(jQuery);
