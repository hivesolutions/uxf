/**
 * jQuery tag field plugin, this jQuery plugin provides the base infra-structure
 * for the creation of a tag field component.
 *
 * @name jquery-select-list.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2016 Hive Solutions Lda.
 * @license Apache License, Version 2.0 - http://www.apache.org/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxtagfield = function(method, options) {
        // the default values for the plugin
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
            // sets the ux global object representation as text
            // field, this value may be used latter for fast ux
            // object type access (hash based conditions)
            matchedObject.uxobject("tagfield");

            // adds the tag field tags to the matched object, this
            // is the container to the tag representations
            matchedObject.prepend("<div class=\"tag-field-tags\"></div>");

            // iterates over each of the matched object to load
            // its contents, as an individual operation
            matchedObject.each(function(index, element) {
                // retrieves the current element
                var _element = jQuery(this);

                // adds the drop field class to the element and
                // then initializes the drop field compoenent
                _element.addClass("drop-field");
                _element.uxdropfield();

                // retrieves the reference to the container of the
                // tag element for the current element (tag field)
                var tagsContainer = jQuery(".tag-field-tags", _element);

                // retrieves the text field element, that is going to
                // be used for some of the "simple" updates
                var textField = jQuery(".text-field", _element);

                // retrieves the original padding top of the text field
                // and "saves" it under the data structure
                var textFieldPaddingTop = textField.css("padding-top");
                textFieldPaddingTop = parseInt(textFieldPaddingTop);
                textField.data("padding_top", textFieldPaddingTop);

                // removes the name attribute from the text field to avoid
                // duplicate submission of values
                textField.removeAttr("name");

                // retrieves the reference to the list of tags to be
                // parsed as the elements of the tag field
                var tagsList = jQuery(".tags", _element);
                var tags = jQuery("li", tagsList);

                // iterates over each of the (existing) tags to create their
                // internal representation (tries to extract data value)
                tags.each(function(index, element) {
                    // retrieves the current element (tag) in
                    // iteration for interpretation
                    var __element = jQuery(this);

                    // retrieves the (possible virtual) value of the
                    // current tag element to be inserted then retrieves
                    // the html value of the tag (visual value)
                    var dataValue = __element.attr("data-value");
                    var dataHtml = __element.html();

                    // adds a new tag to the tags container, this operation
                    // will not trigger any layout change
                    _addTag(_element, options, dataHtml,
                        dataValue, true);
                });

                // removes the targs list from the tag field, this is
                // no longer required
                tagsList.remove();

                // schedules a timeout for the end of this execution loop
                // to update the current layout for the tag field this should
                // avoid problems with no visibility in the tag field
                setTimeout(function() {
                    // checks if the element is visible so that appropriate
                    // visibility operation take place for correct layout update
                    var isVisible = _element.is(":visible");

                    // updates the tag container width with the proper
                    // value, this may be required to avoid some of the
                    // problems with measures while display is hidden
                    _updateContainer(_element, options);

                    // updates (resizes) the tag field, then sets another
                    // update operation for the final part of the update
                    // lifecycle this way a new refresh happends after the
                    // complete layout is rendered
                    isVisible
                        ? _update(_element, options) : _update(_element, options, true);
                });
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the container of the tags for event
            // registration its going to simulate the "normal"
            // text field events
            var tagsContainer = jQuery(".tag-field-tags", matchedObject);

            // retrieves the text field associated with the current
            // tag field to be handler registration
            var textField = jQuery(".text-field", matchedObject);

            // iterates over each of the matched objects
            // to register them agains the submission of the form
            matchedObject.each(function(index, element) {
                // retrieves the current element for iteration
                var _element = jQuery(element);

                // retrieves the containing form
                var parentForm = _element.parents("form");

                // registers for the submit event on the parent
                // form, in order to be able to create the appropriate
                // structures for proper submission
                parentForm.bind("pre_submit", function() {
                    // retrieves the name of the element, this value is
                    // going to be used in the input element to be create
                    // in case the name does not exists no submission of
                    // values is created (returns immediately)
                    var elementName = _element.attr("name");
                    if (!elementName) {
                        return;
                    }

                    // removes all the input elements contained inside the
                    // current tag field (avoid duplicated submission)
                    var inputs = jQuery(
                        "input:not(.text-field, .tag-empty-field)",
                        _element)
                    inputs.remove("input");

                    // retrieves the complete set of tags in the current
                    // tag field this values are going to be used to create
                    // the series of form input elements
                    var tags = jQuery(".tag-field-tag", _element);

                    // iterates over all the elements in the tags to
                    // creates the associated input values
                    for (var index = 0; index < tags.length; index++) {
                        // retrieves the current list items in iteration
                        // and retrieves the value to be used as data value
                        // defaulting to the html value in case none is provided
                        var tag = jQuery(tags[index]);
                        var dataValue = tag.attr("data-value");
                        var displayValue = tag.attr("data-display");
                        dataValue = dataValue ? dataValue : displayValue;

                        // adds the input element representing the list item
                        // to the list item itself
                        _element.append("<input type=\"hidden\" name=\"" + elementName +
                            "\" value=\"" + dataValue + "\" />");
                    }

                    // retrieves the empty field used to submit a default
                    // value in case no tags are selected and then tries
                    // to retrieve the name associated with it so that it
                    // may be used in the submission manipulation
                    var tagEmptyField = jQuery(".tag-empty-field",
                        _element);
                    var name = tagEmptyField.attr("name") || tagEmptyField.attr("data-name");
                    tagEmptyField.attr("name", name);
                    tagEmptyField.attr("data-name", name);

                    // in case there there tags (considered to be valid)
                    // the empty field must be removed to avoid unwanted
                    // behaviour, this is done by removing the name attribute
                    tags.length && tagEmptyField.removeAttr("name");
                });
            });

            matchedObject.bind("value_select",
                function(event, value, valueLogic, item) {
                    // retrieves the target element clicked
                    var element = jQuery(this);

                    // in case no value is select nothing is to
                    // be done, returns immediately
                    if (!value) {
                        return;
                    }

                    // retrieves the text field assiciated with the
                    // element and resets its value no value present
                    var textField = jQuery(".text-field", element);
                    textField.val("");

                    // adds a new tag to the tags container, this operation
                    // will not trigger any layout change
                    _addTag(element, options, value, valueLogic);

                    // updates the current tag field layout to reflect
                    // the changes of adding the new tag
                    _update(element, options);
                });

            tagsContainer.mousedown(function(event) {
                // stops the event propagation and prevents the
                // default behavior to avoid possible problems
                event.stopPropagation();
                event.stopImmediatePropagation();
                event.preventDefault();
            });

            tagsContainer.click(function(event) {
                // retrieves the target element clicked
                var element = jQuery(this);

                // retrieves the parent tag field and uses
                // it to retrieve the associated text field
                var tagField = element.parent(".tag-field");
                var textField = jQuery(".text-field", tagField);

                // focus the cursor in the text field
                textField.focus();

                // stops the event propagation and prevents the
                // default behavior to avoid possible problems
                event.stopPropagation();
                event.stopImmediatePropagation();
                event.preventDefault();
            });

            tagsContainer.dblclick(function(event) {
                // retrieves the target element clicked
                var element = jQuery(this);

                // retrieves the parent tag field and uses
                // it to retrieve the associated text field
                var tagField = element.parent(".tag-field");
                var textField = jQuery(".text-field", tagField);

                // selest the text in the text field
                textField.select();

                // stops the event propagation and prevents the
                // default behavior to avoid possible problems
                event.stopPropagation();
                event.stopImmediatePropagation();
                event.preventDefault();
            });

            textField.focus(function() {
                // retrieves the current element and the associated
                // parent tag field
                var element = jQuery(this);
                var tagField = element.parents(".tag-field");

                // updates the layout structure in the current
                // tag field (focus may change contents)
                _update(tagField, options);
            });
        };

        var _addTag = function(matchedObject, options, value, valueLogic, noEvents) {
            // retrieves the reference to the container of
            // the tags (the place to insert the tags)
            var tagsContainer = jQuery(".tag-field-tags", matchedObject);

            // verifies if duplicate values are not allowed for the current
            // tag field and if that's the case and the current value is a
            // duplicated value (both visual and logical) returns the control
            // flow immediately, no changes are applied to the tag field
            var noDuplicates = matchedObject.attr("data-no_duplicates");
            var isDuplicate = _isDuplicate(matchedObject, value, valueLogic);
            if (noDuplicates && isDuplicate) {
                return;
            }

            // constructs the tag element and updates its
            // (logic) data value reference in case it exists
            var tag = jQuery("<div class=\"tag-field-tag\">" + "<div class=\"tag-field-label\">" + value +
                "</div>" + "<div class=\"tag-field-remove\"></div>" +
                "<div class=\"tag-field-clear\"></div>" + "</div>");
            value && tag.attr("data-display", value);
            valueLogic && tag.attr("data-value", valueLogic);

            // retrieves the reference to the remove element of the tag
            // and registers it for the click event to trigger the removal
            // process for it
            var tagRemove = jQuery(".tag-field-remove", tag);
            tagRemove.click(function() {
                // retrieves the element and uses it to retrieve
                // the parent tag and tag field elements, then uses
                // them to remove the tag and update the layout structures
                var element = jQuery(this);
                var tag = element.parent(".tag-field-tag");
                var tagField = element.parents(".tag-field");
                _removeTag(tagField, options, tag);
                _update(tagField, options);
            });

            // adds the tag element representation to the tags
            // container (visual append)
            tagsContainer.append(tag);

            // in case the no events flag is set, must return the control
            // flow immediately, event should not be triggered
            if (noEvents) {
                return;
            }

            // triggers the tag add event indicating that a
            // tag has just been added to the tag field, then
            // triggers the value change event to notify change
            matchedObject.triggerHandler("tag_add", [value, valueLogic, tag]);
            matchedObject.triggerHandler("value_change");
        };

        var _removeTag = function(matchedObject, options, tag, noEvents) {
            // retrieves the values for both the value of the
            // tag and the logical value (if present)
            var value = tag.attr("data-display");
            var valueLogic = tag.attr("data-value");

            // removes the tag from the logical structure, note
            // that this does not reflect an update immediately
            tag.remove();

            // in case the no events flag is set, must return the control
            // flow immediately, event should not be triggered
            if (noEvents) {
                return;
            }

            // triggers the tag remove event indicating that a
            // tag has just been removed from the tag field, then
            // triggers the value change event to notify change
            matchedObject.triggerHandler("tag_remove", [value, valueLogic, tag]);
            matchedObject.triggerHandler("value_change");
        };

        var _update = function(matchedObject, options, noWidth) {
            // retrieves the container of the tags, the text field and
            // the complete set of tags
            var tagsContainer = jQuery(".tag-field-tags", matchedObject);
            var textField = jQuery(".text-field", matchedObject);
            var tags = jQuery(".tag-field-tag", tagsContainer);

            // retrieves the tags container height and the width
            // of the text field width for future calculus
            var tagsContainerHeight = tagsContainer.outerHeight();
            var textFieldWidth = textField.outerWidth();

            // verifies if the tags contained is currently part of the
            // current document's tree (dom), this will be used to determine
            // if a timeout should be created in case of invalid height
            var isContained = jQuery.contains(document, tagsContainer[0]);

            // in case there's no height defined for the tags container,
            // happens when the current tag container is not visible, must
            // delay the update operation until the next tick, note that
            // this is only possible when the element is contained (in dom)
            if (tagsContainerHeight == 0 && tags.length > 0) {
                isContained && setTimeout(function() {
                    _update(matchedObject, options, noWidth);
                }, 100);
                return;
            }

            // verifies if the auto width mode is enabled for the tag field
            // this is usefull for situations where the width should not
            // be computed automatically (eg: percent based width)
            var autoWidth = matchedObject.attr("data-auto_width");

            // verifies if the text field is currently handled using a border
            // box based strategy as this will employ different calculus
            var isBorderBox = textField.css("box-sizing") == "border-box";

            // tries to retrieve the "original" height value for the text field
            // and updates the register to this same value (only one retrieval)
            var textFieldHeight = textField.data("height") || textField.height();
            textField.data("height", textFieldHeight);

            // retrieves the last tag in the tag sequence then uses
            // it to retrieve the reference value to the top (offset y)
            var lastTag = tags.length ? jQuery(tags[tags.length - 1]) : null;
            var referenceTop = lastTag ? lastTag.offset().top : 0;

            // starts the list of tags for the last line, this list will
            // contain the various tags of the last line
            var lineTags = [];

            // iterates over all the tags to gather the ones that are part
            // of the last line
            for (var index = tags.length - 1; index >= 0; index--) {
                // retrieves the current tag and retrieves its
                // ofsset value to the top for comparision
                var tag = jQuery(tags[index]);
                var _referenceTop = tag.offset().top;

                // in case the current reference to the top is not
                // the same the tag is not in the last line, need
                // to break the loop
                if (_referenceTop != referenceTop) {
                    break;
                }

                // adds the tag element to the list of tags in the last
                // line (this tag is present in the last line)
                lineTags.push(tag);
            }

            // converts the tags in the last line and calculates
            // the total width for them
            lineTags = jQuery(lineTags);
            var lineWidth = lineTags.uxwidth();

            // retrieves the tags container padding left and right to be used
            // in the calculus of the line width
            var tagsContainerPaddingLeft = tagsContainer.css("padding-left");
            var tagsContainerPaddingRight = tagsContainer.css("padding-right");
            tagsContainerPaddingLeft = parseInt(tagsContainerPaddingLeft);
            tagsContainerPaddingRight = parseInt(tagsContainerPaddingRight);

            // calculates the width of the line by adding the tags container
            // padding left and right
            lineWidth = lineWidth + tagsContainerPaddingLeft + tagsContainerPaddingRight;

            // calculates the size of the line using the last tag
            // height as reference and then devides the tags container
            // height with the line height to calculate the number of
            // lines in the tags container, using it to calculate the
            // "new" padding to the top
            var lineHeight = lastTag ? lastTag.height() : 0;
            var marginBottom = lastTag ? lastTag.css("margin-bottom") : 0;
            marginBottom = parseInt(marginBottom);
            var marginTop = lastTag ? lastTag.css("margin-top") : 0;
            marginTop = parseInt(marginTop);
            var lineMargin = marginBottom + marginTop;
            var lineOuterHeight = lineHeight + lineMargin;
            var numberLines = tagsContainerHeight / lineOuterHeight;
            numberLines = isNaN(numberLines) ? 1 : numberLines;
            var paddingTop = (numberLines - 1) * lineOuterHeight;

            // in case border box is enabled for the field the height
            // value must be update with to handle the new padding
            isBorderBox && textField.height(paddingTop + textFieldHeight);

            // retrieves the original padding top value to be used to
            // increment the new padding top
            var textFieldPaddingTop = textField.data("padding_top");
            paddingTop += textFieldPaddingTop;

            // retrieves the margin top of the text field
            // to be used in the calculus of the top margin
            // of the tag container
            var textFieldMarginTop = textField.css("margin-top");
            textFieldMarginTop = parseInt(textFieldMarginTop);

            // uses the text field height in the calculus of the delta
            // value to the margin top (to be able to update it)
            var borderTopWidth = textField.css("border-top-width");
            borderTopWidth = parseInt(borderTopWidth);
            var borderBottomWidth = textField.css("border-bottom-width");
            borderBottomWidth = parseInt(borderBottomWidth);
            var borderWidth = borderTopWidth + borderBottomWidth;
            var deltaMarginTop = ((textFieldHeight + (isBorderBox ? 0 : borderWidth) - lineHeight) / 2);

            // retrieves the various extra components of the text field
            // and adds them together to calculate the extra pixel values
            // of the text field component
            var textFieldPaddingRight = parseInt(textField.css("padding-right"));
            var textFieldBorderRight = parseInt(textField.css("border-right-width"));
            var textFieldBorderLeft = parseInt(textField.css("border-left-width"));
            var textFieldExtra = lineWidth + textFieldPaddingRight + textFieldBorderRight +
                textFieldBorderLeft;

            // calculates the "new" width value to be used validating it
            // to be a positive value (avoids possible problems)
            var width = textFieldWidth - textFieldExtra > 0 ? textFieldWidth - textFieldExtra : 0;

            // updates the margin top of the tag container according to the
            // margin top of the text field
            tagsContainer.css("margin-top", (textFieldMarginTop + textFieldPaddingTop + deltaMarginTop) +
                "px");

            // updates the padding top of the text field according
            // to the calculated value
            textField.css("padding-top", paddingTop + "px");

            // sets the new width and padding left in the text
            // field associated with the tag field, note that this
            // operation is only performed in case the no width flag
            // is not set (conditional execution)
            !noWidth && !autoWidth && textField.css("width", width + "px");
            !noWidth && textField.css("padding-left", lineWidth + "px");
        };

        var _updateContainer = function(matchedObject, options) {
            // retrieves the various elements that are going to be
            // used for the measure of the text field width
            var tagsContainer = jQuery(".tag-field-tags", matchedObject);
            var textField = jQuery(".text-field", matchedObject);

            // retrieves the text field element and calculates its
            // width and padding to the right to be used to set the
            // limits on the tags container
            var textFieldWidth = textField.outerWidth();
            var textFieldPaddingRight = textField.css("padding-right");
            textFieldPaddingRight = parseInt(textFieldPaddingRight);
            var textFieldPaddingLeft = textField.css("padding-left");
            textFieldPaddingLeft = parseInt(textFieldPaddingLeft);

            // updates the maximum width value for the tag container
            // according to the size values of the text field
            tagsContainer.css("max-width", (textFieldWidth - textFieldPaddingRight - textFieldPaddingLeft) +
                "px");
        };

        var _value = function(matchedObject, options) {
            // retrieves the complete set of tags in the current
            // tag field this values are going to be used to create
            // the complete "sequenced" value
            var tags = jQuery(".tag-field-tag", matchedObject);

            // starts the string that will hold the complete value
            // to represent the tag field
            var value = "";

            // iterates over all the elements in the tags to
            // creates the sequence value
            for (var index = 0; index < tags.length; index++) {
                // retrieves the current list items in iteration
                // and retrieves the value to be used as data value
                // defaulting to the html value in case none is provided
                var tag = jQuery(tags[index]);
                var dataValue = tag.attr("data-value");
                var displayValue = tag.attr("data-display");
                dataValue = dataValue ? dataValue : displayValue;

                // adds the current data value to the value and then
                // completes it with a comma
                value += dataValue + ",";
            }

            // returns the "just" computed sequence value comprising
            // the list of valus separated with comas
            return value;
        };

        var _isDuplicate = function(matchedObject, value, valueLogic) {
            var selector = ".tag-field-tag";
            selector += value ? "[data-display=\"" + value + "\"]" : "";
            selector += valueLogic ? "[data-value=\"" + valueLogic + "\"]" : "";
            var result = jQuery(selector, matchedObject);
            return result.length > 0;
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
