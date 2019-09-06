if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

/**
 * jQuery drop down plugin, this jQuery plugin provides the base infra-structure
 * for the creation of a drop down component. Should be used for situations
 * where a menu should be displayed uppon a button based action.
 *
 * @name uxf-drop-down.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2019 Hive Solutions Lda.
 * @license Apache License, Version 2.0 - http://www.apache.org/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxdropdown = function(method, options) {
        // the default values for the drop down
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
            // in case the matched object is not defined
            // or in case it's an empty list must return
            // immediatly initialization is not meant to
            // be run (corruption may occur)
            if (!matchedObject || matchedObject.length === 0) {
                return;
            }

            // sets the ux global object representation as drop
            // down, this value may be used latter for fast ux
            // object type access (hash based conditions)
            matchedObject.uxobject("dropdown");

            // creates the upper structure for the drop down, this should
            // include the button part so that it's possible to active the
            // drop down contents using the "usual" manner
            matchedObject.wrap('<div class="drop-down-container"></div>');
            var container = matchedObject.parents(".drop-down-container");
            container.prepend('<div class="button button-drop-down"></div>');

            // iterates over the complete set of drop down elements so that
            // it's possible to properly set each button's name
            matchedObject.each(function(index, element) {
                // retrieves the various elements, including the current element
                // so that the proper initializing operation may be performed
                var _element = jQuery(this);
                var container = _element.parents(".drop-down-container");
                var button = jQuery(".button-drop-down", container);
                var inputElement = jQuery("input", container);
                var prepend = jQuery(".drop-down-prepend", _element);
                var elements = jQuery("> li", _element);

                // retrieves the various attributes that are going to
                // be applied also to the parent drop down element
                var name = _element.attr("data-name") || "";
                var input = _element.attr("data-input") || "";
                var extra = _element.attr("data-extra") || "";
                var error = _element.attr("data-error") || "";
                var classes = _element.attr("class") || "";
                var containerClasses = container.attr("class") || "";
                var buttonClasses = button.attr("class") || "";

                // retrieves the value of the various classes that are
                // going to condition the initial state of the element
                var isOpen = _element.hasClass("drop-down-open");

                // verifies if the current drop down is considered to
                // be an empty one (no elements contained in it)
                var isEmpty = elements.length === 0;

                // verifies if the request for an input like drop
                // down exists and if that the case created or re-uses
                // the input associated with the drop down container
                if (input && inputElement.length === 0) {
                    container.prepend('<input type="hidden" name="' + input + '"/>');
                } else if (input) {
                    container.prepend(inputElement);
                }

                // moves the prepend part of the drop down (if any) top the top
                // container element so that it may be correctly used
                container.prepend(prepend);

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
                    var hasValue = typeof value !== typeof undefined && value !== false;
                    if (hasValue) {
                        return;
                    }

                    // no value is defined for the element and
                    // so the text representation of the element
                    // is used instead for its logical representation
                    var text = __element.uxcontent(null, "text").trim() || __element.text().trim();
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
                extra && button.append('<span class="extra">' + extra + "</span>");

                // updates the drop down classes with the parent values
                // of classes according to the specification
                container.attr("class", containerClasses + " " + classes);
                container.removeClass("drop-down");

                // in case there's an error defined for the drop down the
                // invalid class is added to all elements and sub-elements
                error && _element.addClass("invalid");
                error && container.addClass("invalid");
                error && button.addClass("invalid");

                // verifies if the drop down is empty and for that case
                // the container is hidden (not going to be displayed)
                isEmpty && container.hide();
                _element.data("empty", true);

                // updates the original (logical) value of the drop down
                // and then runs the original operation to restore it to the
                // initial valid state (include logical value initialization)
                _element.data("original", original);
                _original(_element, options);

                // in case the open (class based) flag is defined for the
                // drop down element it is shown with the current options
                // defined as the open/shown state is considered initial
                isOpen && _show(_element, options);
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
            if (!matchedObject || matchedObject.length === 0) {
                return;
            }

            // retrieves the reference to the various elements that are
            // to be used in the event handling registration
            var _window = jQuery(window);
            var _body = jQuery("body");
            var container = matchedObject.parents(".drop-down-container");
            var button = jQuery(".button-drop-down", container);
            var elements = jQuery("> li", matchedObject);

            // checks if the drop down click event is already
            // registered in the body and sets the variable as
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

            // registers for the update operation that is responsible
            // for the update of the element's internal structures according
            // to the DOM structure of it
            matchedObject.bind("update", function() {
                var element = jQuery(this);
                _update(element, options);
            });

            // registers for the "basic" toggle operation of the current
            // drop down so that the element visibility is toggled
            matchedObject.bind("toggle", function() {
                var element = jQuery(this);
                _toggle(element, options);
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
            matchedObject.bind("enable enabled", function() {
                var element = jQuery(this);
                _enable(element, options);
            });

            // registers for the disable operation of the current
            // drop down so that the interaction is disabled
            matchedObject.bind("disable disabled", function() {
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
                _reset(element, options);
            });

            // register for the key down event in the body,
            // only in case the registration was not already made
            !isRegistered &&
                _body.keydown(function(event) {
                    // retrieves the element
                    var element = jQuery(this);

                    // retrieves the key value
                    var keyValue = event.keyCode
                        ? event.keyCode
                        : event.charCode
                        ? event.charCode
                        : event.which;

                    // in case the key that was pressed in not the
                    // escape one there's nothing to be done and so
                    // the control flow is returned immediately
                    if (keyValue !== 27) {
                        return;
                    }

                    // retrieves the reference to the complete set of drop down
                    // conatainers that are visible for the current body and then
                    // runs the hide operation for the associated drop down
                    var container = jQuery(".drop-down-container.visible", element);
                    var dropDown = jQuery(".drop-down", container);
                    _hide(dropDown, options);
                });

            !isRegistered &&
                _body.click(function(event) {
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

            !isRegistered &&
                _window.click(function(event) {
                    // retrieves the reference to the body element, this should
                    // be a top level body element (from dom structure)
                    var element = jQuery("body");

                    // retrieves the reference to the complete set of drop down
                    // conatainers that are visible for the current body and then
                    // runs the hide operation for the associated drop down
                    var container = jQuery(".drop-down-container.visible", element);
                    var dropDown = jQuery(".drop-down", container);
                    _hide(dropDown, options);
                });

            // marks the complete set of elements as registered this is going to
            // be used in the update event to determine the elements that already
            // have the event handler registered and the one that don't
            elements.data("registered", true);
        };

        var _set = function(matchedObject, options) {
            // tries to retrieve the (new) value to be set either from
            // the value of the value logic fields
            var value = options.value;
            var valueLogic = options.valueLogic;
            value = value || valueLogic;

            // retrieves the complete set of element present in the
            // provided drop down (matched object) and then filters
            // the one that contains the target value
            var elements = jQuery("> li", matchedObject);
            var element = elements.filter('[data-value="' + value + '"]');
            element = element.length > 0 ? jQuery(element[0]) : element;

            // runs the select operation on the target element as
            // "requested" by the click operation in it
            _select(matchedObject, options, element);
        };

        var _value = function(matchedObject, options) {
            // tries to retrieve a possible value from the set of
            // provided options, this value is going to be used to
            // set a new value in case that's required
            var value = options.value;

            // determines if the current operation is a set one and
            // if that's the case redirects the control flow to the
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
            value = input.val();
            return value;
        };

        var _update = function(matchedObject, options) {
            // saves the state value that determins if the current drop down
            // for update was empty before the update
            var wasEmpty = matchedObject.data("empty") || false;

            // retrieves the reference to the parent container of the element
            // to be used for the container level operations
            var container = matchedObject.parents(".drop-down-container");

            // retrieves the complete set of elements for the current object
            // and then filters the ones that are already registered (to avoid
            // a double registration operation)
            var elements = jQuery("> li", matchedObject);
            var isEmpty = elements.length === 0;
            elements = elements.filter(function(index) {
                var _element = jQuery(this);
                var isRegistered = _element.data("registered") || false;
                return isRegistered === false;
            });

            // registers the "new" elements for the click operation so
            // that the state of the drop down gets updated
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

            // marks the new elements as registered so that further calls
            // to this method do not register new event handlers
            elements.data("registered", true);

            // verifies if the drop down is empty and if that's not
            // the case and the drop down was previously empty
            // then shows it re-displaying it again
            if (!isEmpty && wasEmpty) {
                container.show();
                matchedObject.data("empty", false);
            }
        };

        var _toggle = function(matchedObject, options) {
            // verifies the current visibility of the object and then uses
            // the value to decide the operation to be performed
            var isVisible = matchedObject.hasClass("active");
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

            // triggers the pre show event indicating that the panel is going to
            // be shown and that pre operations must be performed now
            matchedObject.triggerHandler("pre_show");

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

            // triggers the post show event indicating that the panel has been
            // shown an that post operations may now be performed
            matchedObject.triggerHandler("post_show");
        };

        var _hide = function(matchedObject, options) {
            // triggers the pre hide event indicating that the panel is going to
            // be hidden and that pre operations must be performed now
            matchedObject.triggerHandler("pre_hide");

            // retrieves the reference to the drop down container and updates
            // both the active and visible status of the container
            var container = matchedObject.parents(".drop-down-container");
            matchedObject.removeClass("active");
            container.removeClass("visible");

            // triggers the post hide event indicating that the panel has been
            // hidden an that post operations may now be performed
            matchedObject.triggerHandler("post_hide");
        };

        var _enable = function(matchedObject, options) {
            matchedObject.triggerHandler("pre_enable");
            var container = matchedObject.parents(".drop-down-container");
            var button = jQuery(".button-drop-down", container);
            button.uxenable();
            container.removeClass("disabled");
            matchedObject.removeClass("disabled");
            matchedObject.triggerHandler("post_enable");
        };

        var _disable = function(matchedObject, options) {
            matchedObject.triggerHandler("pre_disable");
            var container = matchedObject.parents(".drop-down-container");
            var button = jQuery(".button-drop-down", container);
            _hide(matchedObject, options);
            button.uxdisable();
            container.addClass("disabled");
            matchedObject.addClass("disabled");
            matchedObject.triggerHandler("post_disable");
        };

        var _original = function(matchedObject, options) {
            // retrieves the reference to the drop down elements and uses
            // these elements to restore the values to the original values
            var container = matchedObject.parents(".drop-down-container");
            var button = jQuery(".button-drop-down", container);
            var input = jQuery("input", container);
            var name = matchedObject.attr("data-name") || "";
            var extra = matchedObject.attr("data-extra") || "";
            var original = matchedObject.data("original");
            var elements = jQuery("> li", matchedObject);
            var originalElement = elements.filter('[data-value="' + original + '"]');
            originalElement =
                originalElement.length > 0 ? jQuery(originalElement[0]) : originalElement;

            // starts some of the values that are going to be latter populated
            // by following code execution
            var originalText = null;
            var originalExtra = null;

            // verifies if an element was selected (original element) and if
            // that's the case retrieves the proper original text either from
            // it's content of from it's complete text
            if (originalElement.length > 0) {
                originalText =
                    originalElement.uxcontent(null, "text").trim() || originalElement.text().trim();
                originalExtra = null;
            }
            // otherwise sets the original text as the name of the drop field
            // as no original value has been selected
            else {
                originalText = name;
                originalExtra = extra;
            }

            // hides the current drop down as it's no longer going to be
            // display (selected value) and then updates the proper selected
            // class to the target original element (if it exists)
            _hide(matchedObject, options);
            elements.removeClass("selected");
            originalElement.addClass("selected");

            // removes the selected drop down container class and then if the
            // value is valid (not empty or invalid) adds the selected class
            // to it meaning that at least one value of the drop down is selected
            container.removeClass("selected");
            original && container.addClass("selected");

            // changes the value of the "logical" input value and updates
            // the text of the button with the "new" original text
            input.val(original);
            button.text(originalText);

            // in case there's a valid extra (note) name to be added to
            // the drop down button it's added at the end of the button
            originalExtra && button.append('<span class="extra">' + originalExtra + "</span>");
        };

        var _reset = function(matchedObject, options) {
            matchedObject.data("original", "");
            _original(matchedObject, options);
        };

        var _select = function(matchedObject, options, element) {
            // in case no element is selected nothing is meant to
            // be performed under the current function, and the
            // control flow must be returned immediately
            if (element.length === 0) {
                return;
            }

            // in case the target element for selection is disabled
            // returns immediately (not possible to select it)
            var isDisabled = element.hasClass("disabled");
            if (isDisabled) {
                return;
            }

            // retrieves the reference to the various elements
            // tha are going to be used in the element selection
            var container = matchedObject.parents(".drop-down-container");
            var button = jQuery(".button-drop-down", container);
            var input = jQuery("input", container);
            var elements = jQuery("> li", matchedObject);

            // retrieves both the textual/visual value of the selected
            // element and the logical/data value for it, note that the
            // content of the elememt has priority over the complete text
            var text = element.uxcontent(null, "text").trim() || element.text().trim();
            var value = element.attr("data-value");

            // verifies if the element already has the selected class
            // if that's the case the (is) same flag is activated
            var same = element.hasClass("selected");

            // removes the invalid class from both the container and the
            // drop down (matched object) element, as at leat one selection
            // has been performed (invalidation has been removed)
            matchedObject.removeClass("invalid");
            container.removeClass("invalid");
            button.removeClass("invalid");

            // removes the selected class from the complete set of list
            // elements and then adds the selected class to the selected
            // item so that it's properly marked as selected
            elements.removeClass("selected");
            value && element.addClass("selected");

            // changes both the input value and the button textual value
            // but only in case a logical value is defined (input mode)
            value && input.val(value);
            value && button.text(text);

            // removes the selected drop down container class and then if the
            // value is valid (not empty or invalid) adds the selected class
            // to it meaning that at least one value of the drop down is selected
            container.removeClass("selected");
            value && container.addClass("selected");

            // hides the drop down as it's no longer required to be open
            // (the value has been selected)
            _hide(matchedObject, options);

            // triggers the value changed operation with the text/visual
            // value and the logical value, so that listeners may be
            // properly notified about the changing value
            matchedObject.triggerHandler("value_change", [text, value, same]);
        };

        // switches over the method that is going to be performed
        // for the current operation (as requested)
        switch (method) {
            case "set":
                // sets the value in the drop down according to
                // the requested value (provided by options)
                _set(matchedObject, options);
                break;

            case "value":
                // retrieves the value from the matched object and
                // then returns the same value to the caller method
                var value = _value(matchedObject, options);
                return value;

            case "update":
                // updates the component internal structures
                // to reflect the layout changes
                _update(matchedObject, options);
                break;

            case "toggle":
                // runs the tpggçe operation on the currently matched
                // object so that the proper contents are shown or hidden
                // according to their current state
                _toggle(matchedObject, options);
                break;

            case "show":
                // runs the show operation on the currently matched
                // object so that the proper contents are displayed
                _show(matchedObject, options);
                break;

            case "hide":
                // runs the hide operation on the currently matched
                // object so that the proper contents are hidden
                _hide(matchedObject, options);
                break;

            case "enable":
                // runs the enable operation on the currently matched
                // object so that interaction is enabled
                _enable(matchedObject, options);
                break;

            case "disable":
                // runs the disable operation on the currently matched
                // object so that interaction is disabled
                _disable(matchedObject, options);
                break;

            case "original":
                // runs the original operation on the currently matched
                // object so that the element is restored to original
                _original(matchedObject, options);
                return true;

            case "reset":
                // runs the reset operation on the currently matched
                // object so that the element is restored to empty
                _reset(matchedObject, options);
                return true;

            case "default":
                // initializes the plugin and then breaks the current
                // switch (no more operations)
                initialize();
                break;
        }

        // returns the object
        return this;
    };
})(jQuery);
