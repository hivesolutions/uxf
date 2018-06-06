if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

/**
 * jQuery select list plugin, this jQuery plugin provides the base
 * infra-structure for the creation of a select list component.
 *
 * @name uxf-select-list.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2018 Hive Solutions Lda.
 * @license Apache License, Version 2.0 - http://www.apache.org/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxselectlist = function(method, options) {
        // the default values for the plugin
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
         * Creates the necessary html for the component.
         */
        var _appendHtml = function() {
            // iterates over each of the matched object to arrange
            // them according to their options
            matchedObject.each(function(index, element) {
                // retrieves the current element and uses it
                // to update ths current arrange structure
                var _element = jQuery(this);
                _update(_element, options);
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the various items that exist
            // in the select list
            var listItems = jQuery("li", matchedObject);

            // registers for the items changed event on the matched
            // object to update the visuals of the new elements
            matchedObject.bind("items_changed", function(event) {
                // retrieves the current element and runs the
                // visuals update operation on them
                var element = jQuery(this);
                _update(element, options);

                // stops the event propagation to avoid
                // possible loops in the handling
                event.stopPropagation();
            });

            // registers for the click event on the list items
            // to change their selection states
            listItems.click(function(event) {
                // retrieves the current element reference and uses
                // it to retrive the current select list
                var element = jQuery(this);
                var selectList = element.parent(".select-list");

                // checks if the element is currently movinng in that
                // case the click event must be ignored (no focus)
                var isMoving = element.hasClass("moving");
                if (isMoving) {
                    return;
                }

                if (event.ctrlKey || event.metaKey) {
                    var action = "change";
                } else if (event.shiftKey) {
                    var action = "contiguous";
                } else {
                    var action = "normal";
                }

                // switches over the action to be performed
                // on the current item selection state
                switch (action) {
                    case "change":
                        // checks if the element is currently selected and
                        // adds or removes the selected class from it for
                        // each case (complementary)
                        var isSelected = element.hasClass("selected");
                        isSelected
                            ? element.removeClass("selected") : element.addClass("selected");

                        // sets the previous element in the select list
                        // useful for later referral
                        selectList.data("previous", element);

                        // breaks the switch
                        break;

                    case "contiguous":
                        // retrieves the previous selected element and checks
                        // if it contains the selected, defaulting to null
                        // in case it does not contains such class
                        var previous = selectList.data("previous");
                        previous = previous.hasClass("selected") ? previous : null;

                        // retrieves the base index from the previous element
                        // (in case it's set) and retrieves the target index
                        var baseIndex = previous ? previous.index() : 0;
                        var targetIndex = element.index();

                        // in case the target index is greater than the base index the
                        // index values must be exchanged between
                        if (targetIndex < baseIndex) {
                            var temporary = targetIndex;
                            targetIndex = baseIndex;
                            baseIndex = temporary;
                        }

                        // retrieves the currently selected list items
                        var listItems = jQuery("li.selected", selectList);
                        listItems.removeClass("selected");

                        // iterates over the range of index values (base and target)
                        // to be able to select all the elements
                        for (index = baseIndex; index < targetIndex + 1; index++) {
                            // retrieves the current element in the select list and
                            // adds the selected class to it
                            var _element = jQuery(":nth-child(" + (index + 1) + ")", selectList);
                            _element.addClass("selected");
                        }

                        // breaks the switch
                        break;

                    case "normal":
                        // retrieves the currently selected list items
                        var listItems = jQuery("li.selected", selectList);

                        // removes the selected class from all the list items
                        // and then adds then selects the current element
                        listItems.removeClass("selected");
                        element.addClass("selected");

                        // sets the previous element in the select list
                        // useful for later referral
                        selectList.data("previous", element);

                        // breaks the switch
                        break;
                }
            });

            // registers for the double click event on the list itesm
            // to trigger the select action
            listItems.dblclick(function(event) {
                // retrieves the current element and then uses
                // it to retrieve the select list
                var element = jQuery(this);
                var selectList = element.parent(".select-list");

                // triggers the select event in the element
                element.trigger("selected", [element]);
            });

            // iterates over each of the matched objects
            // to register them agains the submission of the form
            matchedObject.each(function(index, element) {
                // retrieves the current element for iteration
                var _element = jQuery(element);

                // retrieves the containing form
                var parentForm = _element.parents("form");

                // registers for the submit event
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
                    // current select list (avoid duplicated submission)
                    var inputs = jQuery("input", _element);
                    inputs.remove("input");

                    // retrieves the complete set of elements in the current
                    // select list, this values are going to be used to create
                    // the series of form input elements
                    var listItems = jQuery("li", _element);

                    // in case the're no valid list items to be sent an empty
                    // value with the same name is posted (so that an empty value
                    // is submitted), required for compliance
                    if (listItems.length === 0) {
                        _element.append("<input type=\"hidden\" name=\"" + elementName +
                            "\" />");
                    }

                    // iterates over all the element in the list items to
                    // creates the associated input values
                    for (var index = 0; index < listItems.length; index++) {
                        // retrieves the current list items in iteration
                        // and retrieves the value to be used as data value
                        // defaulting to the html value in case none is provided
                        var listItem = jQuery(listItems[index]);
                        var dataValue = listItem.attr("data-value");
                        var htmlValue = listItem.html();
                        dataValue = dataValue || htmlValue;

                        // adds the input element representing the list item
                        // to the list item itself
                        _element.append("<input type=\"hidden\" name=\"" + elementName +
                            "\" value=\"" + dataValue + "\" />");
                    }
                });
            });
        };

        var _update = function(matchedObject, options) {
            // retrieves the current element in iteration
            // to be used to add the order element
            var _element = matchedObject;

            // retrieves the value for the order attribute
            // in case no order is set returns immediately
            var order = _element.attr("data-order");
            if (!order) {
                // retrieves the complete set of list items that
                // are considered part of a order structure then
                // retrieves it order icons
                var listItems = jQuery("li.order", _element);
                var orderIcons = jQuery(".order-icon", listItems);

                // removes the order class from the list items and
                // removes the order icons elements
                listItems.removeClass("order");
                orderIcons.remove();

                // returns immediately nothing more to be done
                return;
            }

            // creates the element to be used to sort the elements
            // of the select list
            var orderIcon = jQuery("<div class=\"order-icon\"></div>");

            // retrieves the set of list items in the select
            // list and adds the order icon to them
            var listItems = jQuery("li:not(.order)", _element);
            listItems.prepend(orderIcon);

            // adds the order class to the list items to "notify"
            // of the order visuals intention
            listItems.addClass("order");

            // retrieves the complete set of order icons currently
            // listed under the list items
            var orderIcons = jQuery(".order-icon", listItems);

            // registers for the mouse down event in the order icons
            // to be used for the sorting of the elements
            orderIcons.mousedown(function() {
                // retrieves the current element reference and uses
                // it to retrive the current select list
                var orderIcon = jQuery(this);
                var element = orderIcon.parent("li");
                var selectList = element.parent(".select-list");

                // tries to retrieve the order attribute from the
                // select list in case it's not set ignore the behaviour
                var order = selectList.attr("data-order") || false;
                if (!order) {
                    return;
                }

                // retrieves the reference to the body
                // element for event registration
                var _body = jQuery("body");

                // retrieves the current with for the select
                // list to be used for the contruction of the
                // cloned element
                var selectListWidth = selectList.width();

                // clones the current element and sets it
                // up by adding the clone class then updates its
                // with to reflect the one in the element
                var cloned = element.clone(true);
                cloned.addClass("clone");
                cloned.width(selectListWidth - 12);

                // adds the cloned element to the select list
                // to make its position relative to the select list
                selectList.prepend(cloned);

                // retrieves the top an left position of the element
                // and uses them to position the cloned element
                var elementTop = element.offset().top;
                var elementLeft = element.offset().left;
                cloned.css("top", elementTop + "px");
                cloned.css("left", elementLeft + "px");

                // adds the no select and moving classes to the body
                // element to avoid the selection of any input element
                // and the moving cursor display
                _body.addClass("no-select");
                _body.addClass("do-moving");

                var move = function(event) {
                    // retrives the previous data from the select list
                    // and uses it to set the mouse position
                    var previousOffsetY = selectList.data("offset_y");
                    var previousY = selectList.data("mouse_y");
                    var previousX = selectList.data("mouse_x");
                    var mouseY = event.pageY || previousY;
                    var mouseX = event.pageX || previousX;

                    // retrieves a series of size and position information
                    // in the select list element
                    var selectListHeight = selectList.outerHeight();
                    var selectListTop = selectList.offset().top;
                    var selectListScrollTop = selectList.scrollTop();

                    // retrieves the height of the cloned element
                    var clonedHeight = cloned.outerHeight();

                    // calculates the target y (vertical) position
                    // for the currenly selected element
                    var targetY = mouseY - (clonedHeight / 2);

                    // checks if the target position is overflowing
                    // the top position of the select list
                    if (targetY < selectListTop) {
                        targetY = selectListTop;
                    }
                    // checks if the target position is overflowing
                    // the bottom position of the select list
                    else if (targetY + clonedHeight > selectListTop + selectListHeight) {
                        targetY = selectListTop + selectListHeight - clonedHeight;
                    }

                    // calculates the offset position vertically and uses
                    // it to calculate the index position for the element
                    var offsetY = targetY + selectListScrollTop - selectListTop;
                    var _index = Math.floor(offsetY / clonedHeight);

                    // retrieves the complete set of list items, excluding
                    // the cloned element (not part of the set) and then
                    // retrieves the length of that set
                    var listItems = jQuery("li:not(.clone)", selectList);
                    var numberItems = listItems.length;

                    // normalizes the index value, limiting its range
                    // to the current number of items in the set
                    _index = _index < numberItems ? _index : numberItems - 1;

                    // retrieves the currently targeted list element
                    var listElement = jQuery("li:nth-child(" + (_index + 2) + ")", selectList);

                    // checks if the current index position is
                    // valid (new position) taking into account
                    // the direction of the movement then in case
                    // it's valid executes the position change
                    var isValid = offsetY > previousOffsetY ? _index + 1 !== element.index() :
                        _index + 2 !== element.index();
                    isValid && listElement[0] !== element[0] && listElement.after(element) &&
                        selectList.trigger("order_changed");
                    offsetY === 0 && listElement[0] !== element[0] && cloned.after(element) &&
                        selectList.trigger("order_changed");

                    // updates the top position of the cloned element
                    // to position it
                    cloned.css("top", targetY + "px");

                    // updates the various data values of the select
                    // list to be used in the next iteration
                    selectList.data("offset_y", offsetY);
                    selectList.data("mouse_y", mouseY);
                    selectList.data("mouse_x", mouseX);
                };

                var remove = function() {
                    // retrieves the items that are consideres to be
                    // cloned elements and removes (no more usage)
                    var cloned = jQuery("li.clone", selectList);
                    cloned.remove();

                    // removes the moving class from the element
                    element.removeClass("moving");

                    // removes the no select from the body element
                    // allowing selection on the body
                    _body.removeClass("no-select");
                    _body.removeClass("do-moving");

                    // unbinds the existing event handlers associated
                    // with the current select list
                    _body.unbind("mouseup", remove);
                    _body.unbind("mousemove", move);
                    selectList.unbind("scroll", move);
                };

                // registers both the remove and the move operation
                // functions for the mouse up and the mouse move events
                _body.mouseup(remove);
                _body.mousemove(move);

                // registers for the scroll event in the select list so
                // that it's possible to handle the movement of the select
                // list as the movement of the mouse dragging
                selectList.scroll(move);

                // adds the moving class to the element
                element.addClass("moving");
            });
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
