/**
 * jQuery drop field plugin, this jQuery plugin provides the base
 * infra-structure for the creation of a drop field component.
 *
 * @name jquery-drop-field.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @date March 10, 2010
 * @category jQuery plugin
 * @copyright Copyright (c) 2010-2012 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxdropfield = function(method, options) {
        // the default values for the drop field
        var defaults = {};

        // sets the default method value
        var method = method ? method : "default";

        // sets the default options value
        var options = options ? options : {
            numberOptions : 6,
            filterOptions : true
        };

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
            matchedObject.each(function(index, element) {
                // retrieves the element reference
                var _element = jQuery(element);

                // retrieves the drop field contents
                var dropFieldContents = jQuery(".drop-field-contents", _element);

                // retrieves the number of options
                var numberOptions = options["numberOptions"];

                // retrieves the filter options
                var filterOptions = options["filterOptions"];

                // checks if the element (drop field) is of type select
                var isSelect = _element.hasClass("drop-field-select");

                // retrieves both the display, value and link attributes
                var displayAttribute = _element.attr("data-display_attribute");
                var valueAttribute = _element.attr("data-value_attribute");
                var linkAttribute = _element.attr("data-link_attribute");

                // retrieves the filter attributes and converts it
                // to a list of string from the token separator
                var filterAttributes = _element.attr("data-filter_attributes");
                var filterAttributesList = filterAttributes
                        ? filterAttributes.split(",")
                        : null;

                // retrieves the text field (element)
                var textField = jQuery(".text-field", _element);

                // in case there is no text field defined for the
                // current element one must be created
                if (textField.length == 0) {
                    // retrieves the various attributes from the element
                    // to be propagated to the text field
                    var name = _element.attr("name");
                    var value = _element.attr("value");
                    var originalValue = _element.attr("data-original_value");
                    var error = _element.attr("data-error");

                    // creates the text field element and sets the various
                    // attributes in it
                    var textField = jQuery("<input type=\"text\" class=\"text-field\" />");
                    textField.attr("name", name);
                    textField.attr("value", value);
                    textField.attr("data-original_value", originalValue);
                    textField.attr("data-error", error);

                    // appends the text field to the element and runs the
                    // text field initializer
                    _element.append(textField);
                    textField.uxtextfield();
                }

                // retrieves the text field value and if it's currently
                // in the "lowered" state
                var textFieldValue = textField.attr("value");
                var textFieldIsLower = textField.hasClass("lower");

                // sets the appropriate text field value taking into account
                // if the text field is lowered (empty field) or if the value
                // is correctly set (otherwise)
                textFieldValue = textFieldIsLower ? "" : textFieldValue;

                // adds the "extra" html to the matched object,
                // in case no drop field contents is found
                dropFieldContents.length == 0
                        && _element.append("<div class=\"drop-field-clear\"></div>")
                        && _element.append("<ul class=\"drop-field-contents\"></ul>");

                // retrieves the hidden field and tries
                // to retrieve its value
                var hiddenField = jQuery(".hidden-field", _element);
                var hiddenFieldValue = hiddenField.attr("value");

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
                _element.data("value", textFieldValue);
                _element.data("selection", 0);
                _element.data("mouse_control", false);
                _element.data("display_attribute", displayAttribute);
                _element.data("value_attribute", valueAttribute);
                _element.data("link_attribute", linkAttribute);
                _element.data("filter_attributes", filterAttributesList);
                _element.data("number_options", numberOptions);
                _element.data("filter_options", filterOptions);
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the body
            var _body = jQuery("body");

            // retrieves the matched object elements
            var dropFieldContents = jQuery(".drop-field-contents",
                    matchedObject);
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

                        // in case the current element is not of type
                        // drop field select
                        if (!_element.hasClass("drop-field-select")) {
                            // returns immediately
                            // (continues the loop)
                            return;
                        }

                        // retrieves the drop field and the drop field elements
                        var dropField = _element;
                        var textField = jQuery(".text-field", dropField);
                        var dropFieldContents = jQuery(".drop-field-contents",
                                dropField);

                        // checks if the drop field is of type select
                        var isSelect = dropField.hasClass("drop-field-select");

                        // registers for the click event in the text field
                        // (select click)
                        isSelect && textField.click(function(event) {
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
                                        // hides the drop field contents
                                        dropFieldContents.hide();

                                    }
                                    // otherwise it should show the updated
                                    // drop field contents
                                    else {
                                        // tries to retieve the updated flag from the
                                        // drop field and in case it's not been already
                                        // updated, runs the update process on it after
                                        // that sets the updated flag on its data
                                        var updated = dropField.data("updated");
                                        !updated && _update(dropField, options);
                                        dropField.data("updated", true)

                                        // shows the drop field contents
                                        dropFieldContents.show();
                                    }

                                    // stops the event propagation
                                    // (avoids immediate closing of
                                    // the drop field contents)
                                    event.stopPropagation();
                                    event.preventDefault();
                                });
                    });

            // binds the drop field do the enabled event
            // so that is possible to propagate the enabling
            matchedObject.bind("enabled", function() {
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
            matchedObject.bind("disabled", function() {
                        // retrieves the current element and the associated
                        // text field element
                        var element = jQuery(this);
                        var textField = jQuery(".text-field", element);

                        // disables the text field associated with
                        // the element (drop field)
                        textField.uxdisable();
                    });

            // registers for the click event in the body
            !isRegistered && _body.click(function() {
                        // retrieves the element
                        var element = jQuery(this);

                        // retrieves all the visible drop fields contents
                        // contained in the current element context (body)
                        var dropFieldContents = jQuery(
                                ".drop-field .drop-field-contents:visible",
                                element);

                        // hides the drop field contents
                        dropFieldContents.hide();
                    });

            // registers for the key down even on the text field
            textField.keydown(function(event) {
                        // retrieves th current element
                        var element = jQuery(this);

                        // retrieves the drop field associated with the
                        // current element (text field) and then retrieves
                        // its contents
                        var dropField = element.parents(".drop-field");
                        var dropFieldContents = jQuery(".drop-field-contents",
                                dropField);

                        // checks if the drop field to verify that the
                        // drop field is not disabled, in case it is
                        // no action is done
                        var isDisabled = dropField.hasClass("disabled");
                        if (isDisabled) {
                            return;
                        }

                        // retrieves the event key code
                        var eventKeyCode = event.keyCode
                                ? event.keyCode
                                : event.which;

                        // in case the pressed key is not the escape
                        // key no need to act
                        if (eventKeyCode != 27) {
                            // returns immediately
                            return;
                        }

                        // in case the drop field contents are
                        // visible must act accordingly
                        if (dropFieldContents.is(":visible")) {
                            // hides the drop field contents
                            dropFieldContents.hide();
                        }
                        // otherwise the normal behavior applies
                        // must blur from the element
                        else {
                            // blurs from the element (unfocus)
                            element.blur();
                        }
                    });

            // registers for the blur event in the text field
            textField.blur(function() {
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
                        !mouseControl && dropFieldContents.hide();

                        // checks if the drop field is of type select
                        var isSelect = dropField.hasClass("drop-field-select");

                        // updates the drop field data, only in case
                        // current drop field is not of type select
                        !isSelect && _update(dropField, options);
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
                var dropFieldContents = jQuery(".drop-field-contents",
                        dropField);
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
                    case 9 :
                        // in case the drop field contents is visible
                        if (dropFieldContents.is(":visible")) {
                            // retrieves the selected list item
                            var listItemSelected = jQuery(
                                    ".drop-field-contents > .selected",
                                    dropField);

                            // retrieves the value, the logic value
                            // and the value link from the selected list item
                            var value = listItemSelected.attr("data-display");
                            var valueLogic = listItemSelected.attr("data-value");
                            var valueLink = listItemSelected.attr("data-link");

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
                            hiddenField.attr("value", valueLogic);
                            textField.uxtextfield("value", {
                                        value : value
                                    });
                            dropField.data("value", value);

                            // adds the lock class to the drop field
                            // in case the hidden field is present
                            // and there is a logic field "selected"
                            hiddenField.length > 0 && valueLogic
                                    && dropField.addClass("drop-field-lock");

                            // triggers the value select event
                            dropField.triggerHandler("value_select", [value,
                                            valueLogic, item]);

                            // hides the drop field contents
                            dropFieldContents.hide();

                            // stops the event propagation
                            // (avoids extra problems in form)
                            event.stopPropagation();
                            event.preventDefault();
                        }

                        // breaks the switch
                        break;

                    // in case it's the enter key
                    case 13 :
                        // in case the drop field contents is visible
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
                    case 33 :
                    case 34 :
                    case 38 :
                    case 40 :
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
                var hiddenField = jQuery(".hidden-field", dropField);
                var hiddenTemplate = jQuery(".hidden-template", dropField);
                var textField = jQuery(".text-field", dropField);
                var dropFieldContents = jQuery(".drop-field-contents",
                        dropField);
                var template = jQuery(".template", dropField);

                // retrieves the current value for the hidden field
                // this value must represent if the drop field is
                // currently locked or not
                var hiddenFieldValue = hiddenField.attr("value");

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
                    case 13 :
                        // in case the drop field contents is visible
                        if (dropFieldContents.is(":visible")) {
                            // retrieves the selected list item
                            var listItemSelected = jQuery(
                                    ".drop-field-contents > .selected",
                                    dropField);

                            // retrieves the value, the logic value
                            // and the value link from the selected list item
                            var value = listItemSelected.attr("data-display");
                            var valueLogic = listItemSelected.attr("data-value");
                            var valueLink = listItemSelected.attr("data-link");

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
                            hiddenField.attr("value", valueLogic);
                            textField.uxtextfield("value", {
                                        value : value
                                    });
                            dropField.data("value", value);

                            // adds the lock class to the drop field
                            // in case the hidden field is present
                            // and there is a logic field "selected"
                            hiddenField.length > 0 && valueLogic
                                    && dropField.addClass("drop-field-lock");

                            // triggers the value select event
                            dropField.triggerHandler("value_select", [value,
                                            valueLogic, item]);

                            // in case the value link is set
                            if (valueLink) {
                                // retrieves the offset and converts it
                                // into an integer
                                var duration = dropField.attr("data-duration");
                                var durationInteger = parseInt(duration);

                                // checks if the duration integer value is valid
                                // conversion successful
                                var durationValid = !isNaN(durationInteger);

                                // in case the duration is valid (the link is
                                // internal and a scroll to shall be used)
                                if (durationValid) {
                                    // retrieves the offset and converts it
                                    // into an integer
                                    var offset = dropField.attr("data-offset");
                                    var offsetInteger = parseInt(offset);

                                    // creates the settings map based on the offset
                                    var settings = {
                                        offset : isNaN(offsetInteger)
                                                ? 0
                                                : offsetInteger
                                    }

                                    // scrolls to the reference
                                    jQuery.uxscrollto(valueLink,
                                            durationInteger, settings);
                                }
                                // otherwise the link is external and
                                // no scroll to shall be used
                                else {
                                    // changes the document location to
                                    // the value link value
                                    document.location = valueLink;
                                }
                            }

                            // hides the drop field contents
                            dropFieldContents.hide();
                        }

                        // breaks the switch
                        break;

                    // in case it's the escape key
                    case 27 :
                        // hides the drop field contents
                        dropFieldContents.hide();

                        // stops the event propagation (to
                        // avoid colateral problem in text field)
                        event.stopPropagation();

                        // breaks the switch
                        break;

                    // in case it's the page up key
                    case 33 :
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
                            !hiddenFieldValue
                                    && !dropFieldContents.is(":empty")
                                    && dropFieldContents.show();
                        }

                        break;

                    // in case it's the page down key
                    case 34 :
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
                            !hiddenFieldValue
                                    && !dropFieldContents.is(":empty")
                                    && dropFieldContents.show();
                        }

                        break;

                    // in case it's the up key
                    case 38 :
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
                            !hiddenFieldValue
                                    && !dropFieldContents.is(":empty")
                                    && dropFieldContents.show();
                        }

                        // breaks the switch
                        break;

                    // in case it's the down key
                    case 40 :
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
                            !hiddenFieldValue
                                    && !dropFieldContents.is(":empty")
                                    && dropFieldContents.show();
                        }

                        // breaks the switch
                        break;

                    // in case it's any other key
                    default :
                        // checks if the drop field is of type select
                        var isSelect = dropField.hasClass("drop-field-select");

                        // updates the drop field data, only in case
                        // current drop field is not of type select
                        !isSelect && _update(dropField, options);

                        // breaks the switch
                        break;
                }
            });
        };

        var _update = function(matchedObject, options) {
            // retrieves the drop field elements
            var dropField = matchedObject;
            var dataSource = jQuery("> .data-source", dropField);
            var hiddenField = jQuery(".hidden-field", dropField);
            var hiddenTemplate = jQuery(".hidden-template", dropField);
            var textField = jQuery(".text-field", dropField);
            var dropFieldContents = jQuery(".drop-field-contents", dropField);
            var dropFieldNoResults = jQuery(".drop-field-no-results", dropField);
            var template = jQuery(".template", dropField);

            // retrieves the current drop field value
            var value = dropField.data("value");

            // retrieves the display, value and the link attributes
            var displayAttribute = matchedObject.data("display_attribute");
            var valueAttribute = matchedObject.data("value_attribute");
            var linkAttribute = matchedObject.data("link_attribute");

            // retrieves the filter attributes
            var filterAttributes = matchedObject.data("filter_attributes");

            // retrieves the number of options to display
            // and if they should be filtered
            var numberOptions = matchedObject.data("number_options");
            var filterOptions = matchedObject.data("filter_options");

            // retrieves the auto size value from the drop field
            // (in case active the drop field is positioned)
            var autoResize = dropField.attr("data-auto_size");

            // retrieves the text field value
            var textFieldValue = textField.attr("value");

            // checks if the drop field is of type select
            var isSelect = dropField.hasClass("drop-field-select");

            // in case the value did not change and the drop field
            // is not of type select (no need to show the contents)
            if (textFieldValue == value && !isSelect) {
                // returns immediately
                return;
            }

            // creates the filter string from the text
            // field value in case the select mode is not
            // enabled
            var filterString = isSelect ? "" : textFieldValue;

            // invalidates the "logical" hidden field, may
            // assume the value is in an invalid (transient state)
            // and so there is no "logical" value, avoids doing
            // this in case select field mode is selected (in this
            // mode a value is always selected)
            if (!isSelect) {
                // empties the hidden template and updates the hidden
                // field value to empty and then removes the drop field
                // lock class from the drop field
                hiddenTemplate.empty();
                hiddenField.attr("value", "");
                dropField.removeClass("drop-field-lock");
            }

            // nullifies the number of options in case it's necessary
            numberOptions = filterOptions ? numberOptions : null;

            // runs the query in the data source
            dataSource.uxdataquery({
                        filterString : filterString,
                        filterAttributes : filterAttributes,
                        startRecord : 0,
                        numberRecords : numberOptions
                    }, function(validItems, moreItems) {
                        // in case the valid items value
                        // is not valid (error occurred)
                        if (!validItems) {
                            // returns immediately
                            return;
                        }

                        // in case the drop field is locked or the containing
                        // text field does not contains focus there is no need
                        // to process the results (something occured in betweed
                        // the request and the response)
                        if ((!isSelect && dropField.hasClass("drop-field-lock"))
                                || !textField.hasClass("focus")) {
                            // returns immediately
                            return;
                        }

                        // empties (clears) the drop field contents
                        dropFieldContents.empty()

                        // in case no valid items were retrieves, must show
                        // the no results element
                        if (validItems.length == 0) {
                            // clones the drop field no results element, to create
                            // an instance to be added, then removes the hidding
                            // class from it
                            var _dropFieldNoResults = dropFieldNoResults.clone();
                            _dropFieldNoResults.removeClass("drop-field-no-results");

                            // adds the filter no results element to the
                            // drop field contents
                            dropFieldContents.append(_dropFieldNoResults);
                        }

                        // iterates over all the valid and filtered items
                        // to adds them to the drop field contents
                        for (var index = 0; index < validItems.length; index++) {
                            // retrieves the current item (from the valid items)
                            var currentItem = validItems[index];

                            // retrieves both the display and the value
                            // attributes for the current item
                            var currentDisplayAttribute = displayAttribute
                                    ? currentItem[displayAttribute]
                                    : currentItem;
                            var currentValueAttribute = valueAttribute
                                    ? currentItem[valueAttribute]
                                    : currentItem;
                            var currentLinkAttribute = valueAttribute
                                    ? currentItem[linkAttribute]
                                    : null;

                            // retrieves the default values for the display
                            // and values taking into account the type of
                            // the retrieved values (in case it's map resolves again)
                            currentDisplayAttribute = currentDisplayAttribute
                                    && typeof currentDisplayAttribute == "object"
                                    ? currentDisplayAttribute["name"]
                                    : currentDisplayAttribute;
                            currentValueAttribute = currentValueAttribute
                                    && typeof currentValueAttribute == "object"
                                    ? currentValueAttribute["value"]
                                    : currentValueAttribute;
                            currentLinkAttribute = currentLinkAttribute
                                    && typeof currentLinkAttribute == "object"
                                    ? currentLinkAttribute["link"]
                                    : currentLinkAttribute;

                            // in case the template is defined
                            if (template.length > 0) {
                                // applies the template to the template (item)
                                // retrieving the resulting template item
                                var templateItem = template.uxtemplate(currentItem);

                                // sets the data display and data value
                                // attributes in the template item
                                templateItem.attr("data-display",
                                        currentDisplayAttribute);
                                templateItem.attr("data-value",
                                        currentValueAttribute);

                                // sets the current item in the template item data
                                // so that it can be used for latter template rendering
                                templateItem.data("item", currentItem);
                            }
                            // otherwise the template is not defined and
                            // it must be constructed from base
                            else {
                                // creates the base template item from
                                // the current item
                                var templateItem = jQuery("<li data-display=\""
                                        + currentDisplayAttribute
                                        + "\" data-value=\""
                                        + currentValueAttribute + "\">"
                                        + currentDisplayAttribute + "</li>");

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
                            currentLinkAttribute
                                    && templateItem.attr("data-link",
                                            currentLinkAttribute);

                            // adds the template item item to the
                            // drop field contents
                            dropFieldContents.append(templateItem);
                        }

                        // retrieves the "current" list items
                        var listItems = jQuery(".drop-field-contents > *",
                                dropField);

                        // registers for the mouse down event in the list items
                        listItems.mousedown(function(event) {
                                    // avoids event propagation this way the focus
                                    // is not lost when clicking on a list item
                                    // (this is the desired behavior)
                                    event.stopPropagation();
                                    event.preventDefault();
                                });

                        // registers for the click event in the list items
                        listItems.click(function() {
                                    // retrieves the element
                                    var element = jQuery(this);

                                    // retrieves the value, the logic value
                                    // and the value link from the element
                                    var value = element.attr("data-display");
                                    var valueLogic = element.attr("data-value");
                                    var valueLink = element.attr("data-link");

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
                                    hiddenField.attr("value", valueLogic);
                                    textField.uxtextfield("value", {
                                                value : value
                                            });
                                    dropField.data("value", value);

                                    // adds the lock class to the drop field
                                    // in case the hidden field is present
                                    // and there is a logic field "selected"
                                    hiddenField.length > 0
                                            && valueLogic
                                            && dropField.addClass("drop-field-lock");

                                    // triggers the value select event
                                    dropField.triggerHandler("value_select", [
                                                    value, valueLogic, item]);

                                    // in case the value link is set
                                    if (valueLink) {
                                        // changes the document location to
                                        // the value link value
                                        document.location = valueLink;
                                    }

                                    // calculates the new selection index from the element
                                    // index and updates the data attribute of the drop
                                    // field accordingly, then runs the update selection
                                    // to update the graphics
                                    var selectionIndex = element.index() + 1
                                    dropField.data("selection", selectionIndex);
                                    _updateSelection(dropField, options);

                                    // hides the drop field contents
                                    dropFieldContents.hide();

                                    // avoids event propagation this way the focus
                                    // is not lost when clicking on a list item
                                    // (this is the desired behavior)
                                    event.stopPropagation();
                                    event.preventDefault();
                                });

                        // triggers the value unselect event
                        dropField.triggerHandler("value_unselect", []);

                        // retrieves the previous selection (original selection)
                        // using the value from the text field, then tries to guess
                        // the index by comparing the string value agains the
                        // display value of the list item (this is usefull for the
                        // select type drop fields)
                        var preSelection = jQuery("li[data-display='"
                                        + textFieldValue + "']",
                                dropFieldContents);
                        var preSelectionIndex = preSelection.length > 0
                                ? preSelection.index() + 1
                                : 0;

                        // updates the drop field state, note that the index is updated
                        // differenty in case it's a select drop field (uses the pre select
                        // index value)
                        isSelect ? dropField.data("selection",
                                preSelectionIndex) : dropField.data(
                                "selection", 1);
                        dropField.data("value", textFieldValue);

                        // removes the lock class to the drop field
                        dropField.removeClass("drop-field-lock");

                        // shows the drop field contents in case there
                        // are valid items pending to be show otherwise
                        // hides the drop field contents (no need to show)
                        // an empty set of items, the drop field contents
                        // are only shown in case there is still focus in
                        // the text field
                        validItems.length && textField.hasClass("focus") > 0
                                ? dropFieldContents.show()
                                : dropFieldContents.hide();

                        // in case the auto resize options is set
                        // (must position the drop field contents)
                        if (autoResize != "false") {
                            // retrieves the drop field items
                            var dropFieldContentsItems = dropFieldContents.children();

                            // calculates the drop fields contents with
                            //using the text field width and the drop field
                            // contents items width
                            var textFieldWidth = textField.outerWidth();
                            var dropFieldContentsItemsExtraWidth = dropFieldContentsItems.outerWidth()
                                    - dropFieldContentsItems.width();
                            var dropFieldContentsWidth = textFieldWidth
                                    - dropFieldContentsItemsExtraWidth;

                            // sets the drop field contents width
                            dropFieldContents.width(dropFieldContentsWidth);
                        }

                        // updates the current selection
                        _updateSelection(dropField, options);
                    });
        };

        var _value = function(matchedObject, options) {
            // retrieves the text field
            var textField = jQuery(".text-field", matchedObject);

            // retrieves the text field value
            var elementValue = textField.attr("data-value");

            // returns the retrieved value
            return elementValue;
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
            var selectedListItem = jQuery(".drop-field-contents > :nth-child("
                            + selection + ")", matchedObject);

            // adds the selected class to the selected list item
            selectedListItem.addClass("selected");
        };

        var _set = function(matchedObject, options) {
            // retrieves both the value of the item and the logic
            // value to be set in the hidden field
            var value = options["value"];
            var valueLogic = options["valueLogic"];

            // retrieves the drop field elements
            var dropField = matchedObject;
            var hiddenField = jQuery(".hidden-field", dropField);
            var hiddenTemplate = jQuery(".hidden-template", dropField);
            var textField = jQuery(".text-field", dropField);
            var dropFieldContents = jQuery(".drop-field-contents", dropField);

            // empties the drop field contents, so that no items
            // are show in the drop field contents (invalidates data)
            dropFieldContents.empty();

            // clears the hidden template elements no valid
            // element is set on it (hidden template is empty)
            hiddenTemplate.empty();

            // updates the value fields, to the values provided
            // in the options map
            hiddenField.attr("value", valueLogic);
            textField.uxtextfield("value", {
                        value : value
                    });
            dropField.data("value", value);
            dropField.data("selection", 1);

            // adds the drop field lock class from the drop field
            // adds the lock symbol to the drop field
            dropField.addClass("drop-field-lock")
        };

        var _reset = function(matchedObject, options) {
            // retrieves the drop field elements
            var dropField = matchedObject;
            var hiddenField = jQuery(".hidden-field", dropField);
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
            hiddenField.attr("value", null);
            textField.uxtextfield("value", {
                        value : ""
                    });
            dropField.data("value", "");
            dropField.data("selection", 1);

            // removes the drop field lock class from the drop field
            // no need to retain the lock symbol in the drop field
            dropField.removeClass("drop-field-lock")
        };

        // switches over the method
        switch (method) {
            case "set" :
                // sets the value in the drop field value
                _set(matchedObject, options);

                // breaks the switch
                break

            case "reset" :
                // resets the drop field value
                _reset(matchedObject, options);

                // breaks the switch
                break

            case "value" :
                // retrieves the value
                var value = _value(matchedObject, options);

                // returns the value
                return value;

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
