if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

/**
 * jQuery drop field plugin, this jQuery plugin provides the base
 * infra-structure for the creation of a drop field component. The most
 * "powerfull" drop based component to be used together with a data source and
 * provides both the select and the "find" modes of working for active (mouse
 * only) or passive (kwyboard based) models of interaction.
 *
 * @name uxf-drop-field.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2018 Hive Solutions Lda.
 * @license Apache License, Version 2.0 - http://www.apache.org/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxdropfield = function(method, options) {
        // the array of types that are considered valid for the values
        // to be retrieved from the data source
        var VALID_TYPES = ["object", "string", "number", "boolean"];

        // the default values for the drop field
        var defaults = {};

        // sets the default method value
        method = method || "default";

        // sets the default options value
        options = options || {
            numberOptions: 6,
            filterOptions: true
        };

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
         * Creates the necessary html for the component.
         */
        var _appendHtml = function() {
            // sets the ux global object representation as drop
            // field, this value may be used latter for fast ux
            // object type access (hash based conditions)
            matchedObject.uxobject("dropfield");

            // iterates over all the matched objects
            matchedObject.each(function(index, element) {
                // retrieves the element reference
                var _element = jQuery(element);

                // retrieves the drop field contents and the value
                // fields from the current element in iteration
                var dropFieldContents = jQuery(".drop-field-contents", _element);
                var valueFields = jQuery(".value-field", _element);

                // retrieves the number of options and the filter
                // options from the provided options map
                var numberOptions = options["numberOptions"];
                var filterOptions = options["filterOptions"];

                // retrieves the number of options attribute and then tries to
                // parse it as an integer value in case it fails falls back to
                // the original value otherwise used the newly processed one
                var numberOptionsS = _element.attr("data-number_options");
                var numberOptionsI = parseInt(numberOptionsS);
                numberOptions = isNaN(numberOptionsI) ? numberOptions : numberOptionsI;

                // checks if the element (drop field) is of type select
                var isSelect = _element.hasClass("drop-field-select");

                // retrieves both the display, extra, value and link attributes
                // additionally retrieves also the placeholder so that it may
                // propagated to the lower layers
                var placeholder = _element.attr("placeholder");
                var displayAttribute = _element.attr("data-display_attribute") || "name";
                var extraAttribute = _element.attr("data-extra_attribute") || "extra";
                var valueAttribute = _element.attr("data-value_attribute") || "value";
                var linkAttribute = _element.attr("data-link_attribute") || "link";

                // retrieves any possible filter information, both the name
                // and the operation, these values may be used to change the
                // default behavior of the query so that a "composite" filter
                // is used instead giveing more flexibility to the query
                var filterName = _element.attr("data-filter_name") || null;
                var filterOperation = _element.attr("data-filter_operation") || "like";

                // retrieves the filter attributes and converts it
                // to a list of string from the token separator
                var filterAttributes = _element.attr("data-filter_attributes");
                var filterAttributesList = filterAttributes ? filterAttributes.split(",") : null;

                // retrieves the text field (element)
                var textField = jQuery(".text-field", _element);

                // in case there is no text field defined for the
                // current element one must be created
                if (textField.length === 0) {
                    // retrieves the various attributes from the element
                    // to be propagated to the text field
                    var name = _element.attr("name");
                    var value = _element.attr("value");
                    var originalValue = _element.attr("data-original_value");
                    var error = _element.attr("data-error");
                    var type = _element.attr("data-type");
                    var decimalPlaces = _element.attr("data-decimal_places");

                    // creates the text field element and sets the various
                    // attributes in it (attribute propagation)
                    textField = jQuery('<input type="text" class="text-field" />');
                    textField.val(value);
                    textField.attr("name", name);
                    textField.attr("placeholder", placeholder);
                    textField.attr("data-original_value", originalValue);
                    textField.attr("data-error", error);
                    textField.attr("data-type", type);
                    textField.attr("data-decimal_places", decimalPlaces);

                    // appends the text field to the element and runs the
                    // text field initializer
                    _element.append(textField);
                    textField.uxtextfield();
                }

                // retrieves the text field value and if it's currently
                // in the "lowered" state
                var textFieldValue = textField.val();
                var textFieldIsLower = textField.hasClass("lower");

                // sets the appropriate text field value taking into account
                // if the text field is lowered (empty field) or if the value
                // is correctly set (otherwise)
                textFieldValue = textFieldIsLower ? "" : textFieldValue;

                // adds the "extra" html to the matched object,
                // in case no drop field contents is found
                dropFieldContents.length === 0 &&
                    _element.append('<div class="drop-field-clear"></div>') &&
                    _element.append('<ul class="drop-field-contents"></ul>');

                // retrieves the hidden field and tries to retrieve its value
                // using the proper operator for that
                var hiddenField = jQuery(".hidden-field", _element);
                var hiddenFieldValue = hiddenField.val();

                // creates the map that will hold the complete set of
                // value field associated with the attribute to be set
                // no each of them
                var _valueFields = {};

                // iterates over all the value fields to process them
                // and set them in the element associated with the
                // attribute they "represent"
                valueFields.each(function(element, index) {
                    // retrieves the current element (value field) in
                    // iteration and the attribute it represents
                    var _element = jQuery(this);
                    var attribute = _element.attr("data-attribute");

                    // sets the current element (value field) in the
                    // map associated with the attribute it represents
                    _valueFields[attribute] = _element;
                });

                // adds the lock class to the element
                // in case the hidden field value is already set and valid
                hiddenFieldValue && _element.addClass("drop-field-lock");

                // disables the auto complete in the text field element
                // and in the hidden field (side effects are generated
                // if the autcomplete is not disabled)
                textField.attr("autocomplete", "off");
                hiddenField.attr("autocomplete", "off");

                // ses the text field as read only in case the drop
                // field is of type select
                isSelect && textField.attr("readonly", "true");

                // avoids the escape handling in the text field, the drop
                // field will handle them manually
                textField.data("avoid_escape", true);

                // sets the initial element values
                _element.data("cache", {});
                _element.data("value", textFieldValue);
                _element.data("selection", 0);
                _element.data("mouse_control", false);
                _element.data("display_attribute", displayAttribute);
                _element.data("extra_attribute", extraAttribute);
                _element.data("value_attribute", valueAttribute);
                _element.data("link_attribute", linkAttribute);
                _element.data("filter_name", filterName);
                _element.data("filter_operation", filterOperation);
                _element.data("filter_attributes", filterAttributesList);
                _element.data("number_options", numberOptions);
                _element.data("filter_options", filterOptions);
                _element.data("value_fields", _valueFields);

                // schedules an update operation for the next tick cycle
                // (ensures data source loading) for the various drop fields
                // that have an hidden (logical) value defined but that don't
                // have a valid value defined in the drop field, this is
                // considered a "self bootstrap" operation  and should be used
                // carrefully in order to avoid extra server side calls
                var bootstrap = !textFieldValue && hiddenFieldValue;
                bootstrap &&
                    setTimeout(function() {
                        _update(_element, options, true, [
                            [valueAttribute, "equals", hiddenFieldValue]
                        ]);
                    });
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the body
            var _body = jQuery("body");

            // retrieves the matched object elements
            var dropFieldContents = jQuery(".drop-field-contents", matchedObject);
            var textField = jQuery(".text-field", matchedObject);

            // checks if the drop field click event is already
            // registerd in the body and set the variable as
            // true to avoid further registrations
            var isRegistered = _body.data("drop_field_click");
            _body.data("drop_field_click", true);

            // iterates over each of the matched objects
            // to register the select elements
            matchedObject.each(function(index, element) {
                // retrieves the element reference
                var _element = jQuery(element);

                // retrieves the drop field and the drop field elements
                var dropField = _element;
                var textField = jQuery(".text-field", dropField);
                var dropFieldContents = jQuery(".drop-field-contents", dropField);

                // checks if the drop field is of type select
                var isSelect = dropField.hasClass("drop-field-select");

                // registers for the click event in the text field
                // (select click) so that the proper
                isSelect &&
                    textField.click(function(event) {
                        // checks if the drop field to verify that the
                        // drop field is not disabled, in case it is
                        // no action is done
                        var isDisabled = dropField.hasClass("disabled");
                        if (isDisabled) {
                            return;
                        }

                        // in case the drop field contents is visible
                        // (should move the cursor)
                        if (dropFieldContents.is(":visible")) {
                            // hides the drop field contents, so that the
                            // options are removed from user's visibility
                            _hide(dropField);
                        }
                        // otherwise it should show the updated
                        // drop field contents
                        else {
                            // shows the drop field contents, so that the
                            // options remain visible to the user
                            _show(dropField);
                        }

                        // stops the event propagation (avoids immediate closing of
                        // the drop field contents, from the click)
                        event.stopPropagation();
                    });

                // registers for the click operation in case the current
                // drop field is not of type select, this should only prevent
                // a series of default behaviours (would cause issues)
                !isSelect &&
                    textField.click(function(event) {
                        event.stopPropagation();
                    });
            });

            // binds the drop field do the enabled event
            // so that is possible to propagate the enabling
            matchedObject.bind("enable enabled", function() {
                // retrieves the current element and the associated
                // text field element
                var element = jQuery(this);
                var textField = jQuery(".text-field", element);

                // enables the text field associated with
                // the element (drop field)
                textField.uxenable();
            });

            // binds the drop field to the disabled event
            // so that is possible to propagate the disabling
            matchedObject.bind("disable disabled", function() {
                // retrieves the current element and the associated
                // text field element
                var element = jQuery(this);
                var textField = jQuery(".text-field", element);

                // disables the text field associated with
                // the element (drop field)
                textField.uxdisable();
            });

            // registers the current matched object for the show
            // drop event that should display the drop field list
            // and optionally update the current data source with
            // the latest values according to definition
            matchedObject.bind("show_drop", function(event, noUpdate) {
                var element = jQuery(this);
                !noUpdate && _update(element, options, true);
                _show(element);
            });

            // registers for the hide drop event that should hide the
            // drop field list with the default options
            matchedObject.bind("hide_drop", function() {
                var element = jQuery(this);
                _hide(element);
            });

            // registers for the update drop event that should refresh
            // the currently associated drop list with the latest
            // data comming from the data source
            matchedObject.bind("update_drop", function() {
                var element = jQuery(this);
                _update(element, options, true);
            });

            // registers for the click event in the body
            !isRegistered &&
                _body.click(function() {
                    // retrieves the element
                    var element = jQuery(this);

                    // retrieves all the visible drop fields contents
                    // contained in the current element context (body)
                    // and the reference to each parents
                    var dropFieldContents = jQuery(
                        ".drop-field .drop-field-contents:visible",
                        element
                    );
                    var dropFields = dropFieldContents.parents(".drop-field");

                    // iterates over each of the drop fields to hide the
                    // associated contents (using proper manner)
                    dropFields.each(function(index, element) {
                        // retrieves the reference to the current element
                        // in iteration and hides the drop field contents
                        var _element = jQuery(this);
                        _hide(_element);
                    });
                });

            // registers for the key down even on the text field
            textField.keydown(function(event) {
                // retrieves th current element
                var element = jQuery(this);

                // retrieves the drop field associated with the
                // current element (text field) and then retrieves
                // its contents
                var dropField = element.parents(".drop-field");
                var dropFieldContents = jQuery(".drop-field-contents", dropField);

                // checks if the drop field to verify that the
                // drop field is not disabled, in case it is
                // no action is done
                var isDisabled = dropField.hasClass("disabled");
                if (isDisabled) {
                    return;
                }

                // retrieves the event key code
                var eventKeyCode = event.keyCode ? event.keyCode : event.which;

                // in case the pressed key is not the escape
                // key no need to act
                if (eventKeyCode !== 27) {
                    // returns immediately
                    return;
                }

                // in case the drop field contents are
                // visible must act accordingly
                if (dropFieldContents.is(":visible")) {
                    // hides the drop field contents
                    _hide(dropField);
                }
                // otherwise the normal behavior applies
                // must blur from the element
                else {
                    // blurs from the element (unfocus)
                    element.blur();
                }
            });

            // registers for the focus event in the matched object
            // in order to propagate it to the underlying elements
            // that are "focusable"
            matchedObject.focus(function() {
                // retrieves the element and the associated text
                // field and propagates the focus event to it
                var element = jQuery(this);
                var textField = jQuery(".text-field", element);
                var isFocus = textField.hasClass("focus");
                !isFocus && textField.focus();
            });

            // registers for the blur event in the matched object
            // in order to propagate it to the underlying elements
            // that are "focusable"
            matchedObject.blur(function() {
                // retrieves the element and the associated text
                // field and propagates the blur event to it
                var element = jQuery(this);
                var textField = jQuery(".text-field", element);
                var isFocus = textField.hasClass("focus");
                isFocus && textField.blur();
            });

            // registers for the focus event in the text field
            textField.focus(function(event) {
                // retrieves the element
                var element = jQuery(this);

                // retrieves the parent dopr field associated
                // with the current text field in event
                var dropField = element.parents(".drop-field");

                // adds the focus class to the drop field indicating
                // that the current drop field "contains" focus
                dropField.addClass("focus");

                // triggers the focus event on the drop field so that
                // any listner gets notified abou the new event
                dropField.triggerHandler("focus");

                // avoids the propagation of the event otherwise
                // a loop may be created
                event.stopPropagation();
            });

            // registers for the blur event in the text field
            textField.blur(function(event) {
                // retrieves the element
                var element = jQuery(this);

                // retrieves the drop field in order to get
                // the mouse control flag
                var dropField = element.parents(".drop-field");
                var mouseControl = dropField.data("mouse_control");

                // hides the drop field contents, only in case the mouse
                // control flag is set, prevents the browser from hidding
                // the drop field contents in case before the click event
                // is propagated
                !mouseControl && _hide(dropField);

                // checks if the drop field is of type select
                var isSelect = dropField.hasClass("drop-field-select");

                // updates the drop field data, only in case
                // current drop field is not of type select
                !isSelect && _update(dropField, options);

                // removes the focus class from the parent drop field
                // it's not focused anymore
                dropField.removeClass("focus");

                // triggers the blur event on the drop field so that
                // any listner gets notified abou the new event
                dropField.triggerHandler("blur");

                // avoids the propagation of the event otherwise
                // a loop may be created
                event.stopPropagation();
            });

            // registers for the mouse enter event in the drop field contents
            dropFieldContents.mouseenter(function() {
                // retrieves the element
                var element = jQuery(this);

                // retrieves the drop field to set the
                // mouse control flag
                var dropField = element.parents(".drop-field");
                dropField.data("mouse_control", true);
            });

            // registers for the mouse leave event in the drop field contents
            dropFieldContents.mouseleave(function() {
                // retrieves the element
                var element = jQuery(this);

                // retrieves the drop field to unset the
                // mouse control flag
                var dropField = element.parents(".drop-field");
                dropField.data("mouse_control", false);
            });

            // registers for the key down event in the text field
            textField.keydown(function(event) {
                // retrieves the element
                var element = jQuery(this);

                // retrieves the drop field and the drop field elements
                var dropField = element.parents(".drop-field");
                var hiddenField = jQuery(".hidden-field", dropField);
                var hiddenTemplate = jQuery(".hidden-template", dropField);
                var textField = jQuery(".text-field", dropField);
                var dropFieldContents = jQuery(".drop-field-contents", dropField);
                var template = jQuery(".template", dropField);

                // checks if the drop field to verify that the
                // drop field is not disabled, in case it is
                // no action is done
                var isDisabled = dropField.hasClass("disabled");
                if (isDisabled) {
                    return;
                }

                // retrieves the event key code
                var eventKeyCode = event.keyCode ? event.keyCode : event.which;

                // switches over the event key code
                switch (eventKeyCode) {
                    // in case it's the tab key
                    case 9:
                        // in case the drop field contents is visible
                        if (dropFieldContents.is(":visible")) {
                            // retrieves the selected list item
                            var listItemSelected = jQuery(
                                ".drop-field-contents > .selected",
                                dropField
                            );

                            // retrieves the value, the logic value
                            // and the value link from the selected list item
                            var value = listItemSelected.attr("data-display");
                            var valueLogic = listItemSelected.attr("data-value");

                            // retrieves the complete set of value fields from the drop
                            // field to apply the item values into them
                            var valueFields = dropField.data("value_fields");

                            // retrieves the item associated with the selected list item
                            // so that it may be used for the template rendering
                            var item = listItemSelected.data("item");

                            // applies the template to the template (item)
                            // retrieving the resulting template item
                            var templateItem = template.uxtemplate(item);

                            // clears the hidden template elements and then
                            // adds the template item to it
                            hiddenTemplate.empty();
                            hiddenTemplate.append(templateItem);

                            // updates the value fields
                            hiddenField.val(valueLogic);
                            textField.uxtextfield("value", {
                                value: value
                            });
                            dropField.data("value", value);

                            // iterates over all the value fields to apply the
                            // correct item value to them
                            for (var key in valueFields) {
                                var field = valueFields[key];
                                var _value = item[key];
                                field.val(_value);
                            }

                            // adds the lock class to the drop field
                            // in case the hidden field is present
                            // and there is a logic field "selected"
                            hiddenField.length > 0 &&
                                valueLogic &&
                                dropField.addClass("drop-field-lock");

                            // triggers the value select event
                            dropField.triggerHandler("value_select", [value, valueLogic, item]);

                            // hides the drop field contents, so that they
                            // are no longer visible to the end-user
                            _hide(dropField);

                            // stops the event propagation
                            // (avoids extra problems in form)
                            event.stopPropagation();
                            event.preventDefault();
                        }

                        // breaks the switch
                        break;

                    // in case it's the enter key
                    case 13:
                        // in case the drop field contents are visible
                        if (dropFieldContents.is(":visible")) {
                            // stops the event propagation
                            // (avoids extra problems in form)
                            event.stopPropagation();
                            event.preventDefault();
                        }

                        // breaks the switch
                        break;

                    // in case it's the page up, the
                    // page down, the up or the
                    // down keys
                    case 33:
                    case 34:
                    case 38:
                    case 40:
                        // stops the event propagation
                        // (avoids extra problems in form)
                        event.stopPropagation();
                        event.preventDefault();

                        // breaks the switch
                        break;
                }
            });

            // registers for the key up event in the text field
            textField.keyup(function(event) {
                // retrieves the element
                var element = jQuery(this);

                // retrieves the drop field and the drop field elements
                var dropField = element.parents(".drop-field");
                var form = dropField.parents("form");
                var hiddenField = jQuery(".hidden-field", dropField);
                var hiddenTemplate = jQuery(".hidden-template", dropField);
                var textField = jQuery(".text-field", dropField);
                var dropFieldContents = jQuery(".drop-field-contents", dropField);
                var template = jQuery(".template", dropField);

                // verifies if the drop field is currently configured to
                // be submited after the pressing of the action
                var isSubmit = dropField.attr("data-submit");

                // retrieves the current value for the hidden field
                // this value must represent if the drop field is
                // currently locked or not
                var hiddenFieldValue = hiddenField.val();

                // checks if the drop field to verify that the
                // drop field is not disabled, in case it is
                // no action is done
                var isDisabled = dropField.hasClass("disabled");
                if (isDisabled) {
                    return;
                }

                // retrieves the event key code
                var eventKeyCode = event.keyCode ? event.keyCode : event.which;

                // switches over the event key code
                switch (eventKeyCode) {
                    // in case it's the enter key
                    case 13:
                        // in case the drop field contents is visible
                        if (dropFieldContents.is(":visible")) {
                            // retrieves the selected list item
                            var listItemSelected = jQuery(
                                ".drop-field-contents > .selected",
                                dropField
                            );

                            // retrieves the value, the logic value
                            // and the value link from the selected list item
                            var value = listItemSelected.attr("data-display");
                            var valueLogic = listItemSelected.attr("data-value");
                            var valueLink = listItemSelected.attr("data-link");

                            // retrieves the complete set of value fields from the drop
                            // field to apply the item values into them
                            var valueFields = dropField.data("value_fields");

                            // retrieves the item associated with the selected list item
                            // so that it may be used for the template rendering
                            var item = listItemSelected.data("item");

                            // applies the template to the template (item)
                            // retrieving the resulting template item
                            var templateItem = template.uxtemplate(item);

                            // clears the hidden template elements and then
                            // adds the template item to it
                            hiddenTemplate.empty();
                            hiddenTemplate.append(templateItem);

                            // updates the value fields
                            hiddenField.val(valueLogic);
                            textField.uxtextfield("value", {
                                value: value
                            });
                            dropField.data("value", value);

                            // iterates over all the value field to apply the
                            // correct item value to them
                            for (var key in valueFields) {
                                var field = valueFields[key];
                                var _value = item[key];
                                field.val(_value);
                            }

                            // adds the lock class to the drop field
                            // in case the hidden field is present
                            // and there is a logic field "selected"
                            hiddenField.length > 0 &&
                                valueLogic &&
                                dropField.addClass("drop-field-lock");

                            // triggers the value select event
                            dropField.triggerHandler("value_select", [value, valueLogic, item]);

                            // in case the value link is set it must be used
                            // so that the current context gets switched
                            if (valueLink) {
                                // changes the document location to
                                // the value link value (as expected)
                                _location(dropField, valueLink);
                            }

                            // verifies if the current drop field is of type
                            // submit and if that's the case submits the form
                            if (isSubmit) {
                                form.submit();
                            }

                            // hides the drop field contents
                            _hide(dropField);
                        }

                        // breaks the switch
                        break;

                    // in case it's the escape key
                    case 27:
                        // hides the drop field contents
                        _hide(dropField);

                        // stops the event propagation (to
                        // avoid colateral problem in text field)
                        event.stopPropagation();

                        // breaks the switch
                        break;

                    // in case it's the page up key
                    case 33:
                        // in case the drop field contents is visible
                        // (should move the cursor)
                        if (dropFieldContents.is(":visible")) {
                            // sets the "current" selection to the up
                            _upSelection(dropField, options);
                        }
                        // otherwise it should show the updated
                        // drop field contents
                        else {
                            // updates the drop field
                            _update(dropField, options);

                            // shows the drop field contents, only in case
                            // the current drop field contents is not empty
                            !hiddenFieldValue &&
                                !dropFieldContents.is(":empty") &&
                                _show(dropField);
                        }

                        break;

                    // in case it's the page down key
                    case 34:
                        // in case the drop field contents is visible
                        // (should move the cursor)
                        if (dropFieldContents.is(":visible")) {
                            // sets the "current" selection to the bottom
                            _downSelection(dropField, options);
                        }
                        // otherwise it should show the updated
                        // drop field contents
                        else {
                            // updates the drop field
                            _update(dropField, options);

                            // shows the drop field contents, only in case
                            // the current drop field contents is not empty
                            !hiddenFieldValue &&
                                !dropFieldContents.is(":empty") &&
                                _show(dropField);
                        }

                        break;

                    // in case it's the up key
                    case 38:
                        // in case the drop field contents is visible
                        // (should move the cursor)
                        if (dropFieldContents.is(":visible")) {
                            // increments the "current" selection
                            _incrementSelection(dropField, options);
                        }
                        // otherwise it should show the updated
                        // drop field contents
                        else {
                            // updates the drop field
                            _update(dropField, options);

                            // shows the drop field contents, only in case
                            // the current drop field contents is not empty
                            !hiddenFieldValue &&
                                !dropFieldContents.is(":empty") &&
                                _show(dropField);
                        }

                        // breaks the switch
                        break;

                    // in case it's the down key
                    case 40:
                        // in case the drop field contents is visible
                        // (should move the cursor)
                        if (dropFieldContents.is(":visible")) {
                            // decrements the "current" selection
                            _decrementSelection(dropField, options);
                        }
                        // otherwise it should show the updated
                        // drop field contents
                        else {
                            // updates the drop field
                            _update(dropField, options);

                            // shows the drop field contents, only in case
                            // the current drop field contents is not empty
                            !hiddenFieldValue &&
                                !dropFieldContents.is(":empty") &&
                                _show(dropField);
                        }

                        // breaks the switch
                        break;

                    // in case it's any other key
                    default:
                        // checks if the drop field is of type select
                        var isSelect = dropField.hasClass("drop-field-select");

                        // updates the drop field data, only in case
                        // current drop field is not of type select
                        !isSelect && _update(dropField, options);

                        // breaks the switch
                        break;
                }
            });

            // registers for the paste event on the text field so that
            // any new text "transfered" to the text field is used to
            // update the current drop field status
            textField.bind("paste", function() {
                // retrieves the reference to the current element and
                // uses it to retrieve the parent dropfield
                var element = jQuery(this);
                var dropField = element.parents(".drop-field");

                // schedules a new timeout operation for the next execution
                // cycle so that the text is properly updated
                setTimeout(function() {
                    // checks if the drop field is of type select
                    // updates the drop field data, only in case
                    // current drop field is not of type select
                    var isSelect = dropField.hasClass("drop-field-select");
                    !isSelect && _update(dropField, options);
                });
            });
        };

        var _update = function(matchedObject, options, force, filters) {
            // retrieves the drop field elements
            var dropField = matchedObject;
            var dataSource = jQuery("> .data-source", dropField);
            var hiddenField = jQuery(".hidden-field", dropField);
            var valueFields = jQuery(".value-field", dropField);
            var hiddenTemplate = jQuery(".hidden-template", dropField);
            var textField = jQuery(".text-field", dropField);
            var dropFieldContents = jQuery(".drop-field-contents", dropField);
            var dropFieldNoResults = jQuery(".drop-field-no-results", dropField);
            var template = jQuery(".template", dropField);

            // retrieves the current drop field value and the current
            // (logic) value for the drop field (from the hidden value)
            var value = dropField.data("value");
            var valueLogic = hiddenField.val();

            // retrieves the display, value and the link attributes
            var displayAttribute = matchedObject.data("display_attribute");
            var extraAttribute = matchedObject.data("extra_attribute");
            var valueAttribute = matchedObject.data("value_attribute");
            var linkAttribute = matchedObject.data("link_attribute");

            // retrieves the filter attributes
            var filterName = matchedObject.data("filter_name");
            var filterOperation = matchedObject.data("filter_operation");
            var filterAttributes = matchedObject.data("filter_attributes");

            // retrieves the number of options to display
            // and if they should be filtered
            var numberOptions = matchedObject.data("number_options");
            var filterOptions = matchedObject.data("filter_options");

            // retrieves the auto size value from the drop field
            // (in case active the drop field is positioned)
            var autoResize = dropField.attr("data-auto_size");

            // verifies if the text field is under the lower mode and
            // then retrieves the current text field value
            var isLower = textField.hasClass("lower");
            var textFieldValue = textField.val();

            // checks if the drop field is of type select
            var isSelect = dropField.hasClass("drop-field-select");

            // in case the value did not change or the selected mode
            // is lower and the drop field is not of type select
            // (no need to show the contents) returns immediately
            // the control flow to the caller function/method, note
            // that the force flag will override this behavior
            if ((textFieldValue === value || isLower) && !isSelect && !force) {
                return;
            }

            // in case the text field value is empty and the current
            // type is not select the drop field contents panel must
            // be hidden (nova valid data to be shown)
            if (textFieldValue === "" && !isSelect) {
                _hide(dropField);
            }

            // creates the filter string from the text field value in
            // case the select mode is not enabled and the mode is not
            // the lower one, otherwise an empty value is used
            var filterString = isSelect || isLower ? "" : textFieldValue;

            // in case the filter name value is defined, this is a "composite"
            // filter operation and the (global) filter string should be avoided
            // and replaced by a single filter tuple value
            if (filterName) {
                // runs the defaulting operation in the filters value so that
                // the provided set of filters is allways an empty list, then
                // adds the new filter tuple to the sequence and invalidates
                // the filter string so that no base filtering is used
                filters = filters || [];
                filters.push([filterName, filterOperation, filterString]);
                filterString = "";
            }

            // invalidates the "logical" hidden field, may
            // assume the value is in an invalid (transient state)
            // and so there is no "logical" value, avoids doing
            // this in case select field mode is selected (in this
            // mode a value is always selected)
            if (!isSelect) {
                // empties the hidden template and updates the hidden
                // field value (and value field) to empty because there's
                // been a new value selected and so these values must be
                // invalidated and set back to the original values
                hiddenTemplate.empty();
                hiddenField.val("");
                valueFields.val("");

                // verifies if the current drop field is locked and in case
                // it's removes the lock class and triggers the value unselected
                // event indicating that the value is no longer selected
                var isLocked = dropField.hasClass("drop-field-lock");
                if (isLocked) {
                    dropField.removeClass("drop-field-lock");
                    dropField.triggerHandler("value_unselect", []);
                }
            }

            // adds the updating class as we should be waiting for the results
            // this may take some time in case the data source is remote
            dropField.addClass("updating");

            // nullifies the number of options in case it's necessary
            numberOptions = filterOptions ? numberOptions : null;

            // runs the query in the data source, this should be
            // redirected to the proper data source handler
            dataSource.uxdataquery(
                {
                    filterString: filterString,
                    filterAttributes: filterAttributes,
                    filters: filters,
                    startRecord: 0,
                    numberRecords: numberOptions
                },
                function(validItems, moreItems) {
                    // removes the updating class as the element is no longer under
                    // the updating state (returned information)
                    dropField.removeClass("updating");

                    // in case the valid items value is not valid (error occurred)
                    // so items are avaiable for the update (must avoid update)
                    if (!validItems) {
                        return;
                    }

                    // in case the drop field is locked or the containing
                    // text field does not contains focus there is no need
                    // to process the results (something occured in betweed
                    // the request and the response) must return immediately,
                    // note that this immediate return operation may be skipped
                    // in case the force flag is set (avoids skipping)
                    var isInvalid =
                        (!isSelect && dropField.hasClass("drop-field-lock")) ||
                        !textField.hasClass("focus");
                    if (isInvalid && !force) {
                        return;
                    }

                    // empties (clears) the drop field contents
                    dropFieldContents.empty();

                    // in case no valid items were retrieves, must show
                    // the no results element
                    if (validItems.length === 0) {
                        // clones the drop field no results element, to create
                        // an instance to be added, then removes the hidding
                        // class from it
                        var _dropFieldNoResults = dropFieldNoResults.clone();
                        _dropFieldNoResults.removeClass("drop-field-no-results");

                        // adds the filter no results element to the
                        // drop field contents
                        dropFieldContents.append(_dropFieldNoResults);
                    }

                    // retrieves the cache map to be used to determine if the
                    // various elements should be contructed from scratch or
                    // if an already existing element should be used instead
                    var cache = dropField.data("cache") || {};

                    // iterates over all the valid and filtered items
                    // to adds them to the drop field contents
                    for (var index = 0; index < validItems.length; index++) {
                        // retrieves the current item (from the valid items)
                        var currentItem = validItems[index];

                        // triggers the (new) item event so that the
                        // current item may be (changed)
                        dropField.triggerHandler("item", [currentItem]);

                        // tries to retrieve the unique identifier from the
                        // current item to be used as the cache key
                        var uniqueId = currentItem["unique_id"] || currentItem["uid"];

                        // retrieves the cache map from the drop field and
                        // tries to find the cache item for the unique identifier
                        // in case it's found validates it so that the data contained
                        // in it matches the one cached in such case (valid case)
                        // adds the item to the drop field contents and continues
                        // the loop immediately (no layout rendering)
                        var cacheItem = cache[uniqueId];
                        var cachedData = cacheItem ? cacheItem.data : null;
                        var cacheValid = cachedData
                            ? jQuery.uxequals(cachedData, currentItem)
                            : false;
                        if (cacheItem && cacheValid) {
                            // sets the cache item as the inner item contained
                            // in the cache item (layout element)
                            cacheItem = cacheItem.item;

                            // sets the current item in the cache item data
                            // so that it can be used for latter template rendering
                            cacheItem.data("item", currentItem);

                            // adds the template item item to the
                            // drop field contents
                            dropFieldContents.append(cacheItem);
                            continue;
                        }

                        // retrieves both the display and the value
                        // attributes for the current item
                        var currentDisplayAttribute =
                            displayAttribute &&
                            VALID_TYPES.isIn(typeof currentItem[displayAttribute])
                                ? currentItem[displayAttribute]
                                : currentItem;
                        var currentExtraAttribute =
                            extraAttribute && VALID_TYPES.isIn(typeof currentItem[extraAttribute])
                                ? currentItem[extraAttribute]
                                : null;
                        var currentValueAttribute =
                            valueAttribute && VALID_TYPES.isIn(typeof currentItem[valueAttribute])
                                ? currentItem[valueAttribute]
                                : currentItem;
                        var currentLinkAttribute =
                            linkAttribute && VALID_TYPES.isIn(typeof currentItem[linkAttribute])
                                ? currentItem[linkAttribute]
                                : null;

                        // retrieves the default values for the display
                        // and values taking into account the type of
                        // the retrieved values (in case it's map resolves again)
                        currentDisplayAttribute =
                            currentDisplayAttribute && typeof currentDisplayAttribute === "object"
                                ? currentDisplayAttribute["name"]
                                : currentDisplayAttribute;
                        currentExtraAttribute =
                            currentExtraAttribute && typeof currentExtraAttribute === "object"
                                ? currentExtraAttribute["extra"]
                                : currentExtraAttribute;
                        currentValueAttribute =
                            currentValueAttribute && typeof currentValueAttribute === "object"
                                ? currentValueAttribute["value"]
                                : currentValueAttribute;
                        currentLinkAttribute =
                            currentLinkAttribute && typeof currentLinkAttribute === "object"
                                ? currentLinkAttribute["link"]
                                : currentLinkAttribute;

                        // initializes the template item value to its original
                        // value, to be populated under the conditional
                        var templateItem = null;

                        // in case the template is defined
                        if (template.length > 0) {
                            // applies the template to the template (item)
                            // retrieving the resulting template item
                            templateItem = template.uxtemplate(currentItem);

                            // sets the data display and data value
                            // attributes in the template item
                            templateItem.attr("data-display", currentDisplayAttribute);
                            templateItem.attr("data-value", currentValueAttribute);

                            // sets the current item in the template item data
                            // so that it can be used for latter template rendering
                            templateItem.data("item", currentItem);
                        }
                        // otherwise the template is not defined and
                        // it must be constructed from base
                        else {
                            // creates the base template item from
                            // the current item
                            templateItem = jQuery(
                                '<li data-display="' +
                                    currentDisplayAttribute +
                                    '" data-value="' +
                                    currentValueAttribute +
                                    '">' +
                                    currentDisplayAttribute +
                                    "</li>"
                            );

                            // in case the extra attribute value is defined the
                            // subscript section should also be added to
                            // the generated template item
                            currentExtraAttribute &&
                                templateItem.append(
                                    '<span class="subscript-extra">' +
                                        currentExtraAttribute +
                                        "</span>"
                                );

                            // sets the current item in the template item data
                            // so that it can be used for latter template rendering
                            templateItem.data("item", currentItem);
                        }

                        // retrieves the first link element available in the
                        // template item, then uses it to retrieve
                        // its hyperlink reference (in case it's necessary)
                        var linkElement = jQuery("a", templateItem);
                        currentLinkAttribute = linkElement.length
                            ? linkElement.attr("href")
                            : currentLinkAttribute;

                        // sets the data link attribute in the
                        // template item in case it's valid
                        currentLinkAttribute &&
                            templateItem.attr("data-link", currentLinkAttribute);

                        // sets the template item in the cache map
                        // to provide cache for the visual element
                        // only in case the unique id is valid (set)
                        if (uniqueId) {
                            cache[uniqueId] = {
                                item: templateItem,
                                data: currentItem
                            };
                        }

                        // adds the template item item to the
                        // drop field contents
                        dropFieldContents.append(templateItem);
                    }

                    // retrieves the "current" list items
                    var listItems = jQuery(".drop-field-contents > *", dropField);

                    // registers for the mouse down event in the list items
                    listItems.mousedown(function(event) {
                        // avoids event propagation this way the focus
                        // is not lost when clicking on a list item
                        // (this is the desired behavior)
                        event.stopPropagation();
                        event.preventDefault();
                    });

                    // registers for the mouse over event in the list items
                    // on order to prevent propagation of such events
                    listItems.mouseover(function() {
                        // removes the propagation and prevents the default operations
                        // to be performed for the current event
                        event.stopPropagation();
                        event.preventDefault();
                    });

                    // registers for the click event in each of the list items
                    // that have just been constructed
                    listItems.click(function(event) {
                        // retrieves the element to be used in click handling
                        // this should be the list item (element) reference
                        var element = jQuery(this);

                        // retrieves the index associated with the current
                        // selected element and updates the options map with
                        // this value to condition the index change call
                        var index = element.index();
                        options["index"] = index;

                        // changes the index of the current drop field to match
                        // the one "required" in the provided options map
                        _index(dropField, options);

                        // avoids event propagation this way the focus
                        // is not lost when clicking on a list item
                        // (this is the desired behavior)
                        event.stopPropagation();
                        event.preventDefault();
                    });

                    // retrieves the previous selection (original selection)
                    // using the value from the text field, then tries to guess
                    // the index by comparing the string value agains the
                    // display value of the list item (this is usefull for the
                    // select type drop fields)
                    var preSelection = jQuery(
                        "li[data-display='" + textFieldValue + "']",
                        dropFieldContents
                    );
                    var preSelectionIndex = preSelection.length > 0 ? preSelection.index() + 1 : 0;

                    // updates the drop field state, note that the index is updated
                    // differenty in case it's a select drop field (uses the pre select
                    // index value)
                    isSelect
                        ? dropField.data("selection", preSelectionIndex)
                        : dropField.data("selection", 1);
                    dropField.data("value", textFieldValue);

                    // shows the drop field contents in case there
                    // are valid items pending to be show otherwise
                    // hides the drop field contents (no need to show)
                    // an empty set of items, the drop field contents
                    // are only shown in case there is still focus in
                    // the text field
                    validItems.length > 0 &&
                    textField.hasClass("focus") &&
                    (textFieldValue !== "" || isSelect)
                        ? _show(dropField)
                        : _hide(dropField);

                    // in case the auto resize options is set
                    // (must position the drop field contents)
                    if (autoResize !== "false") {
                        _resize(dropField);
                    }

                    // updates the current selection, this operation should change
                    // the "focus" to the currently selected list item
                    _updateSelection(dropField, options);

                    // verifies if the current loading of values should be considered
                    // bootstrap ones, if that's the case an extra iteration should
                    // be performed on the complete set of list items trying to find
                    // the one that matched the current logic value and then uses it
                    // to update the "visual" drop field value
                    var bootstrap = !value && valueLogic;
                    bootstrap &&
                        listItems.each(function(index, element) {
                            // retrieves the current list item (element) in iteration and
                            // unpacks its data value, checking it agains the currently
                            // set logic value (for proper match value)
                            var _element = jQuery(this);
                            var isValid = valueLogic === _element.attr("data-value");
                            if (!isValid) {
                                return;
                            }

                            // if this logic is reached there was a match with the list
                            // item value and the proper index change should be triggered
                            index = _element.index();
                            options["index"] = index;
                            _index(dropField, options);
                        });

                    // verifies if the current loading of values should be considered
                    // incomplete ones, if that's the case an extra iteration should
                    // be performed on the complete set of list items trying to find
                    // the one that matched the current (display) value and then uses it
                    // to update the "logic" drop field value
                    var incomplete = value && !valueLogic;
                    incomplete &&
                        options.force &&
                        listItems.each(function(index, element) {
                            // retrieves the current list item (element) in iteration and
                            // unpacks its data value, checking it agains the currently
                            // set "display" value (for proper match value)
                            var _element = jQuery(this);
                            var isValid = value === _element.attr("data-display");
                            if (!isValid) {
                                return;
                            }

                            // if this logic is reached there was a match with the list
                            // item value and the proper index change should be triggered
                            index = _element.index();
                            options["index"] = index;
                            _index(dropField, options);
                        });
                }
            );
        };

        var _value = function(matchedObject, options) {
            // sets the default value that is going to be returned
            // in case no other has been selected
            var value = null;

            // in case the value is defined then this is a set operation
            // and should be handled as such
            if (options.value) {
                return _set(matchedObject, {
                    value: options.value,
                    force: options.force === undefined ? true : options.force
                });
            }

            // retrieves the field associated with the (logic of visual)
            // current matched object and runs the value method
            // in it retrieving and returning the value (pipeline)
            if (options.logic) {
                var field = jQuery(".hidden-field", matchedObject);
                value = field.uxvalue();
            } else {
                var textField = jQuery(".text-field", matchedObject);
                value = textField.uxtextfield("value", options);
            }

            // returns the final value to the caller method, this
            // value come from the proper data sourcing
            return value;
        };

        var _incrementSelection = function(matchedObject, options) {
            // retrieves the current selection value
            var selection = matchedObject.data("selection");

            // in case the selection row not "overlfows"
            if (selection > 0) {
                // decrements the current selection
                matchedObject.data("selection", selection - 1);
            }

            // updates the current selection
            _updateSelection(matchedObject, options);
        };

        var _decrementSelection = function(matchedObject, options) {
            // retrieves the current selection value
            var selection = matchedObject.data("selection");

            // retrieves the "current" list items
            var listItems = jQuery(".drop-field-contents > *", matchedObject);

            // in case the selection row not "overlfows"
            if (selection < listItems.length) {
                // increments the current selection
                matchedObject.data("selection", selection + 1);
            }

            // updates the current selection
            _updateSelection(matchedObject, options);
        };

        var _upSelection = function(matchedObject, options) {
            // retrieves the current selection value
            var selection = matchedObject.data("selection");

            // in case the selection row is not the first
            // one (goes to the top)
            if (selection > 1) {
                // resets the current selection to be top
                // selection value
                matchedObject.data("selection", 1);
            }
            // otherwise goes to the "invisible" value
            else {
                // resets the current selection to be base
                // selection value
                matchedObject.data("selection", 0);
            }

            // updates the current selection
            _updateSelection(matchedObject, options);
        };

        var _downSelection = function(matchedObject, options) {
            // retrieves the current selection value
            var selection = matchedObject.data("selection");

            // retrieves the "current" list items
            var listItems = jQuery(".drop-field-contents > *", matchedObject);

            // in case the selection row is not the base
            // one (goes to the bottom)
            if (selection > 0) {
                // resets the current selection to be bottom
                // selection value
                matchedObject.data("selection", listItems.length);
            }
            // otherwise it's the base selection and the drop field
            // must be scrolled to the top
            else {
                // resets the current selection to be top
                // selection value
                matchedObject.data("selection", 1);
            }

            // updates the current selection
            _updateSelection(matchedObject, options);
        };

        var _updateSelection = function(matchedObject, options) {
            // retrieves the current selection value
            var selection = matchedObject.data("selection");

            // retrieves the current list items
            var listItems = jQuery(".drop-field-contents > *", matchedObject);

            // removes the selected class from the current list
            // items (unselection)
            listItems.removeClass("selected");

            // retrieves the list item to be selected
            var selectedListItem = jQuery(
                ".drop-field-contents > :nth-child(" + selection + ")",
                matchedObject
            );

            // adds the selected class to the selected list item
            selectedListItem.addClass("selected");
        };

        var _set = function(matchedObject, options) {
            // retrieves both the value of the item and the logic
            // value to be set in the hidden field
            var value = options["value"];
            var valueLogic = options["valueLogic"];

            // tries to retieve the item definition from the
            // options in case it's defined
            var item = options["item"] || {};

            // retrieves the drop field elements and the final
            // value for the value attribute name of the drop field
            var dropField = matchedObject;
            var hiddenField = jQuery(".hidden-field", dropField);
            var hiddenTemplate = jQuery(".hidden-template", dropField);
            var textField = jQuery(".text-field", dropField);
            var dropFieldContents = jQuery(".drop-field-contents", dropField);
            var displayAttribute = dropField.attr("data-display_attribute") || "name";
            var valueAttribute = dropField.attr("data-value_attribute") || "value";

            // verifies if the bootstrap mode is set meaning that the
            // logic value has been set but the visual one not, this
            // should trigger an extra query to the data source
            var bootstrap = !value && valueLogic;

            // verifies if the incomplete mode is enabled, meaning that
            // the visual value is provided but the logical one not
            var incomplete = value && !valueLogic;

            // verifies if the incomplete mode is set (just visual) and
            // the forced mode is set, for this situation the data source
            // update operation is still going to be performed
            var force = incomplete && options.force;

            // retrieves the complete set of value fields from the drop
            // field to apply the item values into them
            var valueFields = dropField.data("value_fields");

            // empties the drop field contents, so that no items
            // are show in the drop field contents (invalidates data)
            dropFieldContents.empty();

            // clears the hidden template elements no valid
            // element is set on it (hidden template is empty)
            hiddenTemplate.empty();

            // updates the value fields, to the values provided
            // in the options map
            hiddenField.val(valueLogic);
            textField.uxtextfield("value", {
                value: value
            });
            dropField.data("value", value);
            dropField.data("selection", 1);
            dropField.data("updated", false);

            // iterates over all the value fields to apply the
            // correct item (from options) value to them
            for (var key in valueFields) {
                var field = valueFields[key];
                var _value = item[key];
                field.val(_value);
            }

            // adds the drop field lock class from the drop field
            // adds the lock symbol to the drop field
            dropField.addClass("drop-field-lock");

            // in case the bootstrap mode is enabled an extra update
            // operation is scheduled to update the values of the drop
            // field according to the logic attribute that has been set
            bootstrap &&
                _update(dropField, options, true, [[valueAttribute, "equals", valueLogic]]);

            // in case the incomplete mode is enabled an extra operation
            // is scheduled to update the drop field accordingly, this is
            // performed only if the force option is set
            force && _update(dropField, options, true, [[displayAttribute, "equals", value]]);
        };

        var _reset = function(matchedObject, options) {
            // retrieves the drop field elements
            var dropField = matchedObject;
            var hiddenField = jQuery(".hidden-field", dropField);
            var valueFields = jQuery(".value-field", dropField);
            var hiddenTemplate = jQuery(".hidden-template", dropField);
            var textField = jQuery(".text-field", dropField);
            var dropFieldContents = jQuery(".drop-field-contents", dropField);

            // empties the drop field contents, so that no items
            // are show in the drop field contents
            dropFieldContents.empty();

            // clears the hidden template elements no valid
            // element is set on it (hidden template is empty)
            hiddenTemplate.empty();

            // updates the value fields, to the original
            // "empty" (unset) values
            hiddenField.val(null);
            valueFields.val(null);
            textField.uxtextfield("value", {
                value: ""
            });
            dropField.data("value", "");
            dropField.data("selection", 1);
            dropField.data("updated", false);

            // removes the drop field lock class from the drop field
            // no need to retain the lock symbol in the drop field
            dropField.removeClass("drop-field-lock");
        };

        var _index = function(matchedObject, options) {
            // retrievs the target index from the provided options
            // map, this value will be used to retrieved the correct
            // child element for the change
            var index = options["index"];

            // retrieves the the various elements required for
            // the changing of the index on the drop field, note
            // that the drop field is set as the current object
            var dropField = matchedObject;
            var form = dropField.parents("form");
            var hiddenField = jQuery(".hidden-field", dropField);
            var textField = jQuery(".text-field", dropField);
            var template = jQuery(".template", dropField);
            var hiddenTemplate = jQuery(".hidden-template", dropField);
            var dropFieldContents = jQuery(".drop-field-contents", dropField);
            var element = jQuery("> :nth-child(" + (index + 1) + ")", dropFieldContents);

            // verifies if the drop field is currently configured to
            // be submited after the pressing of the action
            var isSubmit = dropField.attr("data-submit");

            // retrieves the value, the logic value
            // and the value link from the element
            var value = element.attr("data-display");
            var valueLogic = element.attr("data-value");
            var valueLink = element.attr("data-link");

            // retrieves the complete set of value fields from the drop
            // field to apply the item values into them
            var valueFields = dropField.data("value_fields");

            // retrieves the item associated with the selected list item
            // so that it may be used for the template rendering
            var item = element.data("item");

            // applies the template to the template (item)
            // retrieving the resulting template item
            var templateItem = template.uxtemplate(item);

            // clears the hidden template elements and then
            // adds the template item to it
            hiddenTemplate.empty();
            hiddenTemplate.append(templateItem);

            // updates the value fields
            hiddenField.val(valueLogic);
            textField.uxtextfield("value", {
                value: value
            });
            dropField.data("value", value);

            // iterates over all the value field to apply the
            // correct item value to them
            for (var key in valueFields) {
                var field = valueFields[key];
                var _value = item[key];
                field.val(_value);
            }

            // adds the lock class to the drop field
            // in case the hidden field is present
            // and there is a logic field "selected"
            hiddenField.length > 0 && valueLogic && dropField.addClass("drop-field-lock");

            // triggers the value select event
            dropField.triggerHandler("value_select", [value, valueLogic, item]);

            // in case the value link is set and it's valid
            // it must be processed so that the link gets
            // interpreted and ran (switching to new page)
            if (valueLink) {
                _location(dropField, valueLink);
            }

            // verifies if the current drop field is of type
            // submit and if that's the case submits the form
            if (isSubmit) {
                form.submit();
            }

            // calculates the new selection index from the element
            // index and updates the data attribute of the drop
            // field accordingly, then runs the update selection
            // to update the graphics
            var selectionIndex = element.index() + 1;
            dropField.data("selection", selectionIndex);
            _updateSelection(dropField, options);

            // hides the drop field contents
            _hide(dropField);
        };

        var _location = function(matchedObject, valueLink) {
            // sets the provided matched object as the drop field
            // this is used for better alias based operation
            var dropField = matchedObject;

            // retrieves the duration and converts it
            // into an integer to be used in the scroll
            // operation at the end of the function
            var duration = dropField.attr("data-duration");
            var durationInteger = parseInt(duration);

            // checks if the duration integer value is valid
            // (meaning conversion successful)
            var durationValid = !isNaN(durationInteger);

            // in case the duration is valid (the link is
            // internal and a scroll to shall be used)
            if (durationValid) {
                // retrieves the offset and converts it
                // into an integer to be used in the
                var offset = dropField.attr("data-offset");
                var offsetInteger = parseInt(offset);

                // creates the settings map based on the offset
                // note that the value gets defaulted to zero
                var settings = {
                    offset: isNaN(offsetInteger) ? 0 : offsetInteger
                };

                // scrolls to the reference using the proper
                // plugin operation (performing smooth effect)
                jQuery.uxscrollto(valueLink, durationInteger, settings);
            } else {
                // changes the document location to/ the value
                // link value, using the proper plugin
                jQuery.uxlocation(valueLink);
            }
        };

        var _resize = function(matchedObject, force) {
            // sets the provided matched object as the drop field
            // and then uses it to retrieve the various components
            // that are going to be used in the resize operation
            var dropField = matchedObject;
            var textField = jQuery(".text-field", dropField);
            var dropFieldContents = jQuery(".drop-field-contents", dropField);

            // verifies if the auto resize mode is disabled and if
            // that's the case and the force flag is not set the
            // control flow is returned immediately to caller
            var autoResize = dropField.attr("data-auto_size");
            if (autoResize === "false" && !force) {
                return;
            }

            // checks if the current drop field contents component
            // is visible and in case it's not shows it, as this is
            // required in order to retrieve the proper measures
            var isVisible = dropFieldContents.is(":visible");
            !isVisible && dropFieldContents.show();

            // determines if the drop field contents is bord box based
            // sizing, if that the case a different sizing is going to
            // be applied to determine the width of the drop field
            var boxSizing = dropFieldContents.css("box-sizing");
            var isBorderBox = boxSizing === "border-box";

            // calculates the drop field contents width using the text
            // field width as reference and calculating the extra width
            // to be removed from the dropfield as the extra margin
            // (and border) values that it may contain
            var textFieldWidth = textField.outerWidth(true);
            var dropFieldContentsExtraWidth =
                dropFieldContents.outerWidth() - dropFieldContents.width();
            var dropFieldContentsWidth = isBorderBox
                ? textFieldWidth
                : textFieldWidth - dropFieldContentsExtraWidth;

            // in case the current drop field contents are not visible
            // hides them back (original visibility)
            !isVisible && _hide(dropField);

            // sets the drop field contents width with the resulting value
            // so that the contents placeholder is properly updated
            dropFieldContents.width(dropFieldContentsWidth);
        };

        var _show = function(matchedObject) {
            // sets the provided matched object as the drop field
            // and then uses it to retrieve the various components
            // that are going to be used in the show operation
            var dropField = matchedObject;
            var dropFieldContents = jQuery(".drop-field-contents", dropField);

            // tries to retieve the updated flag from the
            // drop field and in case it's not been already
            // updated, runs the update process on it after
            // that sets the updated flag on its data
            var updated = dropField.data("updated");
            dropField.data("updated", true);
            !updated && _update(dropField, options);

            // runs the resize operation in the drop field so that the proper
            // size is defined for the contents and the other elements
            _resize(dropField);

            // shows/displays the current drop field contents so that the
            // proper layout is positioned in the screen
            dropFieldContents.show();

            // adds the drop field (visible) class to the drop field, meaning
            // that currently the contents are visible on the layout
            dropField.addClass("visible");
        };

        var _hide = function(matchedObject) {
            // sets the provided matched object as the drop field
            // and then uses it to retrieve the various components
            // that are going to be used in the hide operation
            var dropField = matchedObject;
            var dropFieldContents = jQuery(".drop-field-contents", dropField);

            // hides/removes the current drop field contents so that the
            // proper layout is removed from the screen
            dropFieldContents.hide();

            // removes the visible class from the drop field, meaning
            // that the drop field contents are no longer visible
            dropField.removeClass("visible");
        };

        // switches over the method
        switch (method) {
            case "set":
                // sets the value in the drop field value
                _set(matchedObject, options);
                break;

            case "reset":
                // resets the drop field value
                _reset(matchedObject, options);
                return true;

            case "index":
                // selects the proper index value in the drop
                // field, usefull for drop field select elements
                _index(matchedObject, options);
                break;

            case "value":
                // retrieves the value and returns it to the
                // caler function for handling
                var value = _value(matchedObject, options);
                return value;

            case "default":
                // initializes the plugin
                initialize();
                break;
        }

        // returns the object
        return this;
    };
})(jQuery);
