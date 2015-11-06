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

            // sets the ux global object representation as drop
            // down, this value may be used latter for fast ux
            // object type access (hash based conditions)
            matchedObject.uxobject("dropdown");

            // creates the upper structure for the drop down, this should
            // include the button part so that it's possible to active the
            // drop down contents using the "usual" manner
            matchedObject.wrap("<div class=\"drop-down-container\"></div>");
            var container = matchedObject.parents(".drop-down-container");
            container.prepend("<div class=\"button button-drop-down\"></div>");

            // iterates over the complete set of drop down elements so that
            // it's possible to properly set each button's name
            matchedObject.each(function(index, element) {
                        // retrieves the various elements, including the current element
                        // so that the proper initializing operation may be performed
                        var _element = jQuery(this);
                        var container = _element.parents(".drop-down-container");
                        var button = jQuery(".button-drop-down", container);
                        var inputElement = jQuery("input", container);
                        var elements = jQuery("> li", _element);

                        // retrieves the various attributes that are going to
                        // be applied also to the parent drop down element
                        var name = _element.attr("data-name");
                        var input = _element.attr("data-input");
                        var extra = _element.attr("data-extra") || "";
                        var classes = _element.attr("class") || "";
                        var containerClasses = container.attr("class") || "";
                        var buttonClasses = button.attr("class") || "";

                        // verifies if the current drop down is considered to
                        // be an empty one (no elements contained in it)
                        var isEmpty = elements.length == 0;

                        // verifies if the request for an input like drop
                        // down exists and if that the case created or re-uses
                        // the input associated with the drop down container
                        if (input && inputElement.length == 0) {
                            container.prepend("<input type=\"hidden\" name=\""
                                    + input + "\"/>");
                        } else if (input) {
                            container.prepend(inputElement);
                        }

                        // retreives the compete set of elements that are meant
                        // to be defaulted in case no logical value is defined
                        // allowing proper value interface for them
                        var defaults = input ? elements : jQuery([]);
                        defaults.each(function() {
                                    // retrieves the current element in iteration and
                                    // verifies that a proper logical value is defined
                                    // for it and if that's the case skips iteration
                                    var __element = jQuery(this);
                                    var value = __element.attr("data-value");
                                    var hasValue = typeof value !== typeof undefined
                                            && value !== false;
                                    if (hasValue) {
                                        return;
                                    }

                                    // no value is defined for the element and
                                    // so the text representation of the element
                                    // is used instead for its logical representation
                                    var text = __element.uxcontent().trim()
                                            || __element.text().trim();
                                    __element.attr("data-value", text);
                                });

                        // retrieves the "original" (logical) value as the
                        // value of the input element (in case it exists)
                        // or an empty value otherwise
                        var original = inputElement.val() || "";

                        // updates the button text value with the original
                        // name value and the classes for it (avoiding drop down)
                        button.text(name);
                        button.attr("class", buttonClasses + " " + classes);
                        button.removeClass("drop-down");

                        // in case there's a valid extra (note) name to be added to
                        // the drop down button it's added at the end of the button
                        extra
                                && button.append("<span class=\"extra\">"
                                        + extra + "</span>");

                        // updates the drop down classes with the parent values
                        // of classes according to the specification
                        container.attr("class", containerClasses + " "
                                        + classes);
                        container.removeClass("drop-down");

                        // verifies if the drop down is empty and for that case
                        // the container is hidden (not going to be displayed)
                        isEmpty && container.hide();

                        // updates the original (logical) value of the drop down
                        // and then runs the original operation to restore it to the
                        // initial valid state (include logical value initialization)
                        _element.data("original", original);
                        _original(_element, options);
                    });

            // adds the menu class to the matched object so that it's
            // possible to manage its visibility as typical menu element
            matchedObject.addClass("menu");
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
                        // retrieves the reference to the "clicked" element and
                        // the associated parent and child elements that are
                        // going to be used in the selection change operation
                        var element = jQuery(this);
                        var container = element.parents(".drop-down-container");
                        var dropDown = jQuery(".drop-down", container);

                        // runs the select operation on the target element as
                        // "requested" by the click operation in it
                        _select(dropDown, options, element);

                        // stops the event propagation, avoiding possible issues with
                        // the propagation of the click event on the element
                        event.stopPropagation();
                    });

            // registers for the "basic" show operation of the current
            // drop down so that the element is shown
            matchedObject.bind("show", function() {
                        var element = jQuery(this);
                        _show(element, options);
                    });

            // registers for the "basic" hide operation of the current
            // drop down so that the element is hidden
            matchedObject.bind("hide", function() {
                        var element = jQuery(this);
                        _hide(element, options);
                    });

            // registers for the enable operation of the current
            // drop down so that the interaction is enabled
            matchedObject.bind("enable", function() {
                        var element = jQuery(this);
                        _enable(element, options);
                    });

            // registers for the disable operation of the current
            // drop down so that the interaction is disabled
            matchedObject.bind("disable", function() {
                        var element = jQuery(this);
                        _disable(element, options);
                    });

            // registers for the "basic" original operation of the current
            // drop down so that the element is restored to original state
            matchedObject.bind("original", function() {
                        var element = jQuery(this);
                        _original(element, options);
                    });

            // registers for the reset (values) operation of the current
            // drop down so that the element is restored to empty state
            matchedObject.bind("reset", function() {
                        var element = jQuery(this);
                        _reset(element, options)
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

        var _set = function(matchedObject, options) {
            // tries to retrieve the (new) value to be set either from
            // the value of the value logic fields
            var value = options["value"];
            var valueLogic = options["valueLogic"];
            value = value || valueLogic;

            // retrieves the complete set of element present in the
            // provided drop down (matched object) and then filters
            // the one that contains the target value
            var elements = jQuery("> li", matchedObject);
            var element = elements.filter("[data-value=\"" + value + "\"]");

            // runs the select operation on the target element as
            // "requested" by the click operation in it
            _select(matchedObject, options, element);
        };

        var _value = function(matchedObject, options) {
            // tries to retrieve a possible value from the set of
            // provided options, this value is going to be used to
            // set a new value in case that's required
            var value = options["value"];

            // determines if the current opetation is a set one and
            // if that's the case redirect the control flow to the
            // set operation so that it may be correctly used
            var isSet = value !== undefined;
            if (isSet) {
                return _set(matchedObject, options);
            }

            // retrieves the parent container of the matched object and
            // then uses it to retrieve the underlying input and the
            // logical value from it (as it's expected)
            var container = matchedObject.parents(".drop-down-container");
            var input = jQuery("input", container);
            var value = input.val();
            return value;
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
            // verifies if the current object is disabled and if
            // that's the case returns immediately (no show)
            var isDisabled = matchedObject.hasClass("disabled");
            if (isDisabled) {
                return;
            }

            // retrieves the reference for both the global menu contents and
            // basic menu values and to the drop down container, these are
            // going to be the elements to be updated by the show operation
            var _menu = jQuery(".menu.active");
            var _menuContents = jQuery(".menu-contents:visible");
            var container = matchedObject.parents(".drop-down-container");

            // triggers the proper hide events for the menu and the menu
            // contents elements (note that this is global event trigger)
            _menu.trigger("hide");
            _menuContents.trigger("hide");

            // updates both the active and the visible status/classes in the
            // various components of the drop down
            matchedObject.addClass("active");
            container.addClass("visible");
        };

        var _hide = function(matchedObject, options) {
            // retrieves the reference to the drop down container and updates
            // both the active and visible status of the container
            var container = matchedObject.parents(".drop-down-container");
            matchedObject.removeClass("active");
            container.removeClass("visible");
        };

        var _enable = function(matchedObject, options) {
            var container = matchedObject.parents(".drop-down-container");
            container.removeClass("disabled");
            matchedObject.removeClass("disabled");
        };

        var _disable = function(matchedObject, options) {
            var container = matchedObject.parents(".drop-down-container");
            _hide(matchedObject, options);
            container.addClass("disabled");
            matchedObject.addClass("disabled");
        };

        var _original = function(matchedObject, options) {
            // retrieves the reference to the drop down elements and uses
            // these elements to restore the values to the original values
            var container = matchedObject.parents(".drop-down-container");
            var button = jQuery(".button-drop-down", container);
            var input = jQuery("input", container);
            var name = matchedObject.attr("data-name");
            var extra = matchedObject.attr("data-extra") || "";
            var original = matchedObject.data("original");
            var elements = jQuery("> li", matchedObject);
            var originalElement = elements.filter("[data-value=\"" + original
                    + "\"]");

            // verifies if an element was selected (original element) and if
            // that's the case retrieves the proper original text either from
            // it's content of from it's complete text
            if (originalElement.length > 0) {
                var originalText = originalElement.uxcontent().trim()
                        || originalElement.text().trim();
                var originalExtra = null;
            }
            // otherwise sets the original text as the name of the drop field
            // as no original value has been selected
            else {
                var originalText = name;
                var originalExtra = extra;
            }

            // hides the current drop down as it's no longer going to be
            // display (selected value) and then updates the proper selected
            // class to the target original element (if it exists)
            _hide(matchedObject, options);
            elements.removeClass("selected");
            originalElement.addClass("selected");

            // changes the value of the "logical" input value and updates
            // the text of the button with the "new" original text
            input.val(original);
            button.text(originalText);

            // in case there's a valid extra (note) name to be added to
            // the drop down button it's added at the end of the button
            originalExtra
                    && button.append("<span class=\"extra\">" + originalExtra
                            + "</span>");
        };

        var _reset = function(matchedObject, options) {
            matchedObject.data("original", "");
            _original(matchedObject, options);
        };

        var _select = function(matchedObject, options, element) {
            // retrieves the reference to the various elements
            // tha are going to be used in the element selection
            var container = matchedObject.parents(".drop-down-container");
            var button = jQuery(".button-drop-down", container);
            var input = jQuery("input", container);
            var elements = jQuery("> li", matchedObject);

            // retrieves both the textual/visual value of the selected
            // element and the logical/data value for it, note that the
            // content of the elememt has priority over the complete text
            var text = element.uxcontent().trim() || element.text().trim();
            var value = element.attr("data-value");

            // removes the selected class from the complete set of list
            // elements and then adds the selected class to the selected
            // item so that it's properly marked as selected
            elements.removeClass("selected");
            value && element.addClass("selected");

            // changes both the input value and the button textual value
            // but only in case a logical value is defined (input mode)
            value && input.val(value);
            value && button.text(text);

            // hides the drop down as it's no longer required to be open
            // (the value has been selected)
            _hide(matchedObject, options);

            // triggers the value changed operation with the text/visual
            // value and the logical value, so that listeners may be
            // properly notified about the changing value
            matchedObject.triggerHandler("value_change", [text, value]);
        };

        // switches over the method that is going to be performed
        // for the current operation (as requested)
        switch (method) {
            case "set" :
                // sets the value in the drop down according to
                // the requested value (provided by options)
                _set(matchedObject, options);
                break

            case "value" :
                // retrieves the value from the matched object and
                // then returns the same value to the caller method
                var value = _value(matchedObject, options);
                return value;

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

            case "enable" :
                // runs the enable operation on the currently matched
                // object so that interaction is enabled
                _enable(matchedObject, options);
                break;

            case "disable" :
                // runs the disable operation on the currently matched
                // object so that interaction is disabled
                _disable(matchedObject, options);
                break;

            case "original" :
                // runs the original operation on the currently matched
                // object so that the element is restored to original
                _original(matchedObject, options);
                break;

            case "reset" :
                // runs the reset operation on the currently matched
                // object so that the element is restored to empty
                _reset(matchedObject, options);
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
