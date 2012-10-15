/**
 * jQuery table plugin, this jQuery plugin provides the base infra-structure for
 * the creation of a table component.
 *
 * @name jquery-table.js
 * @author João Magalhães <joamag@hive.pt> & Luís Martinho <lmartinho@hive.pt>
 * @version 1.0
 * @date March 10, 2010
 * @category jQuery plugin
 * @copyright Copyright (c) 2010-2012 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxtable = function(method, options) {
        // the default values for the table
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
            // iterates over all the items in the matched object
            matchedObject.each(function(index, element) {
                // retrieves the element reference
                var elementReference = jQuery(element);

                // retrieves all the rows from the element reference
                // and all the text fields associated with the element reference
                var rows = jQuery("tbody > tr:not(.template)", elementReference);
                var textFields = jQuery(
                        "tbody > tr:not(.template) .text-field",
                        elementReference);

                // iterates over all the items in the matched object
                rows.each(function(index, element) {
                            // retrieves the element reference
                            var elementReference = jQuery(element);

                            // retrieves the last row and adds the last class
                            // to it to signal the last element
                            var lastRow = jQuery(":last-child",
                                    elementReference);
                            lastRow.addClass("last");

                            // sets the line id in the element reference
                            elementReference.attr("data-line_id", index + 1);
                        });

                // iterates over all the text fields to update their invalid
                // state in case it's necessary
                textFields.each(function(index, element) {
                            // retrieves the current iteration element
                            // reference for reference
                            var elementReference = jQuery(element);

                            // in case the current element does not containts
                            // the invalid class no need to update the invalid
                            // stat of it
                            if (!elementReference.hasClass("invalid")) {
                                // no need to update the invalid state, returns
                                // immediately
                                return;
                            }

                            // sets the current text field as invalid, updating
                            // all the associated (frontier text fields)
                            _setInvalid(elementReference, options);
                        });

                // retrieves the last row of the table and then
                // adds the last class to it
                var lastRow = jQuery(rows.get(rows.length - 1));
                lastRow.addClass("last");

                // resets the cell padding and the cell spacing properties
                // of the table structure (not required)
                elementReference.attr("cellpadding", "0");
                elementReference.attr("cellspacing", "0");

                // sets the initial the current line id in the
                // element reference
                elementReference.data("current_line_id", rows.length + 1);
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the new line element
            var newLine = jQuery(".table-new-line", matchedObject);

            // retrieves the row elements (without the table header, footer and templates)
            var rows = jQuery("tr", matchedObject).not("thead tr").not("tfoot tr").not(".template");

            // registers for the click event in the newline element
            newLine.click(function() {
                        // retrieves the element
                        var element = jQuery(this);

                        // retrieves the table elements
                        var table = element.parents(".table");
                        var tableBody = jQuery("tbody", table);

                        // creates a new line in the table and inserts
                        // it into the table body
                        _newLine(table, tableBody, options);
                    });

            // iterates over all the rows to register their
            // respective line handlers
            rows.each(function(index, element) {
                        // retrieves the current row (element) reference
                        var row = jQuery(element);

                        // registers the handlers for the row (line)
                        _registerLineHandlers(row, options);
                    });

            // iterates over all the items in the matched object
            matchedObject.each(function(index, element) {
                // retrieves the element reference
                var elementReference = jQuery(element);

                // checks if the current table is of type edit, in such
                // case a line should be added in case the table is empty
                // also retrieves the rows for the current element table
                var isEdit = elementReference.hasClass("table-edit");
                var rows = jQuery("tbody > tr:not(.template)", elementReference);

                // retrieves the containing form
                var parentForm = elementReference.parents("form");

                // registers for the submit event
                parentForm.submit(function() {
                    // checks if the flag that disables the auto removal
                    // of the empty field (line) is set
                    var noAutoRemove = elementReference.hasClass("no-auto-remove");

                    // in case the no auto remove flag is set no removal of the
                    // empty line is done
                    if (noAutoRemove) {
                        // returns immediately (no need to proceed
                        // with the row removal)
                        return;
                    }

                    // retrieves the rows from the element reference
                    var rows = jQuery("tbody > tr:not(.template)",
                            elementReference);

                    // in case there are no rows available
                    if (rows.length == 0) {
                        // returns immediately (no need to proceed
                        // with the row removal)
                        return;
                    }

                    // retrieves the table empty field to remove and then
                    // and retrieve the table default field to disable it
                    var tableEmptyField = jQuery(".table-empty-field",
                            elementReference);
                    var tableDefaultField = jQuery(".table-default-field",
                            elementReference);

                    // retrieves the default input (text field) to be disabled
                    // and then removes the name attribute from it disables
                    // the submission of the value through the form
                    var defaultInput = jQuery("input", tableDefaultField);
                    defaultInput.removeAttr("name");

                    // in case there is only one table field element
                    // the table empty filed is removed to avoid it from
                    // being submited (this should only be submited in empty table)
                    (rows.length - tableDefaultField.length > 0)
                            && tableEmptyField.remove();
                });

                // in case the table is of type edit and the table is emtpy
                // a line must be added to the end of the table in
                // case the table is empty
                if (isEdit && rows.length == 0) {
                    // retrieves the table elements
                    var table = elementReference;
                    var tableBody = jQuery("tbody", table);

                    // creates a new line in the table and inserts
                    // it into the table body
                    var _line = _newLine(table, tableBody, options);

                    // adds the class default field to the line and register
                    // for the key down (and up) event on it for the removal
                    // of the default field token
                    _line.addClass("table-default-field");
                    jQuery(".text-field", _line).keydown(function() {
                                _line.removeClass("table-default-field");
                            });
                    jQuery(".text-field", _line).keyup(function() {
                                _line.removeClass("table-default-field");
                            });
                }
            });
        };

        var _registerLineHandlers = function(row, options) {
            // retrieves the table and checks if it editable
            var table = row.parents(".table");
            var isEdit = table.hasClass("table-edit");

            // in case the table is not editable
            if (!isEdit) {
                // returns immediately
                return;
            }

            // creates the add and remove buttons html
            var addButtonHtml = "<td class=\"table-add\">"
                    + "<div class=\"inline-add\"></div>" + "</td>";
            var removeButtonHtml = "<td class=\"table-remove\">"
                    + "<div class=\"inline-remove\"></div>" + "</td>";

            // adds the add and remove button html to the row
            row.append(removeButtonHtml);
            row.append(addButtonHtml);

            // retrieves the various elements
            var addButton = jQuery(".table-add", row);
            var removeButton = jQuery(".table-remove", row);
            var textField = jQuery(".text-field", row);

            // retrieves the table width, to calculate
            // the add button left margin
            var tableWidth = table.outerWidth();
            var addButtonWidth = addButton.width();
            var addButtonMarginLeft = tableWidth * -1;

            // sets the add button left margin
            addButton.css("margin-left", addButtonMarginLeft + "px");

            // registers for the mouse over event in the row
            row.mouseover(function() {
                        // retrieves the element and sets it as the
                        // the table element
                        var element = jQuery(this);
                        var table = element;

                        // retrieves the add and remove buttons
                        var addButton = jQuery(".table-add", element);
                        var removeButton = jQuery(".table-remove", element);

                        // retrieves the table width, to calculate
                        // the add button left margin
                        var tableWidth = table.outerWidth();
                        var addButtonWidth = addButton.width();
                        var addButtonMarginLeft = tableWidth * -1;

                        // sets the add button left margin, it's important
                        // to re-calculate this value because the table may
                        // be invisible during the first calculus
                        addButton.css("margin-left", addButtonMarginLeft + "px");

                        // updates the buttons visibility
                        addButton.addClass("visible");
                        removeButton.addClass("visible");
                    });

            // registers for the mouse out event in the row
            row.mouseout(function() {
                        // retrieves the element
                        var element = jQuery(this);

                        // retrieves the add and remove buttons
                        var addButton = jQuery(".table-add", element);
                        var removeButton = jQuery(".table-remove", element);

                        // updates the buttons visibility
                        addButton.removeClass("visible");
                        removeButton.removeClass("visible");
                    });

            // registers for the click event in the add button
            addButton.click(function() {
                        // retrieves the element
                        var element = jQuery(this);

                        // retrieves the various elements
                        var table = element.parents(".table");
                        var elementRow = element.parents("tr");

                        // creates a new line in the table
                        _newLine(table, elementRow, options);
                    });

            // registers for the click event in the remove button
            removeButton.click(function() {
                        // retrieves the element
                        var element = jQuery(this);

                        // retrieves the element row (adn table) and
                        // removes it from the table
                        var table = element.parents(".table");
                        var elementRow = element.parents("tr");
                        elementRow.remove();

                        // updates the invalid values on the current
                        // matched object (global reset)
                        _updateInvalid(matchedObject, options);

                        // checks if the current row for which the
                        // line will be added is the last one in such // case the var
                        isLastRow = elementRow.hasClass("last");

                        // in case the current row is not the last one
                        // no need to proceed with the last row update
                        // process (adds last class to the last row)
                        if (!isLastRow) {
                            // triggers the removed line event, sends the removed
                            // line as an event argument, then returns immediately
                            table.triggerHandler("removed_line", [elementRow]);
                            return;
                        }

                        // retrieves the current last row and then add the last
                        // class to it (updating it's structure)
                        var lastRow = jQuery("tbody > tr:not(.template):last",
                                matchedObject);
                        lastRow.addClass("last");

                        // triggers the removed line event, sends the removed
                        // line as an event argument
                        table.triggerHandler("removed_line", [elementRow]);
                    });

            // registers for the click on the text field
            textField.focus(function() {
                        // rertrieves the current element (text field)
                        var element = jQuery(this);

                        // retrieves the cell and the row associated
                        // with the text field
                        var cell = element.parents("td");
                        var row = element.parents("tr");

                        // retrieves both the next cell and the next row for
                        // the text field
                        var nextCell = cell.next();
                        var nextRow = row.next();

                        // retrieves the current index for the cell and then uses
                        // it to retrieve the equivalent cell in the next row
                        var cellIndex = cell.index();
                        var nextRowCell = jQuery("td:eq(" + cellIndex + ")",
                                nextRow);

                        // adds the next horizontal and next vertical classes to the
                        // next cell and to the next row equivalent cell
                        nextCell.addClass("next-horizontal");
                        nextRowCell.addClass("next-vertical");

                        // checks if the currently selected text field is associated
                        // with the last cell in the table
                        var isLastCell = cell.hasClass("last")
                                && row.hasClass("last");

                        // in case the current cell is not the last one, no
                        // need register for the creation of the newline on
                        // the end of line
                        if (!isLastCell) {
                            // returns immediately no need to register for the
                            // line creation
                            return;
                        }

                        // creates the binder function that handles the
                        // creation of the new line at the end of the
                        // line (on scroll)
                        var binder = function(event) {
                            // retrieves the element
                            var element = jQuery(this);

                            // retrieves the filter
                            var filter = element.parents(".filter");

                            // retrieves the event key code
                            var eventKeyCode = event.keyCode
                                    ? event.keyCode
                                    : event.which;

                            // checks if the shift key is set
                            var shiftKey = event.shiftKey;

                            // in case the shift key is set or the currently
                            // pressed key is not the tab key, no need to
                            // create a new line
                            if (shiftKey || eventKeyCode != 9) {
                                // returns immediately, no need to create
                                // a new line
                                return;
                            }

                            // retrieves the table elements
                            var table = element.parents(".table");
                            var tableBody = jQuery("tbody", table);

                            // creates a new line in the table and inserts
                            // it into the table body
                            _newLine(table, tableBody, options);
                        };

                        // registers for the key up event in the text field
                        // so that is possible to create line on the tab
                        // key pressing (automatic creation of lines at the end
                        // of line)
                        element.keydown(binder);

                        // registers for the blue event so that when the user
                        // steps out of the text field no more line are created
                        // on tab pressing
                        element.blur(function() {
                                    // unbinds the text field from the creation of the new
                                    // lines
                                    element.unbind("keydown", binder);
                                });
                    });

            // registers for the blur event on the text field
            textField.blur(function() {
                        // retrieves the element
                        var element = jQuery(this);

                        // retrieves the table associated with the
                        // element (text field) and then uses it to
                        // retrieve the associated cells
                        var table = element.parents("table");
                        var cells = jQuery("td", table);

                        // removes the next classes from all of the table
                        // cells (no more association)
                        cells.removeClass("next-horizontal");
                        cells.removeClass("next-vertical");
                    });

            // registers for the invalid set event on the text field
            textField.bind("invalid_set", function() {
                        // rertrieves the current element (text field)
                        var element = jQuery(this);

                        // sets the current text field as invalid, updating
                        // all the associated (frontier text fields)
                        _setInvalid(element, options);
                    });

            // registers for the invalid unset event on the text field
            textField.bind("invalid_unset", function() {
                        // rertrieves the current element (text field)
                        var element = jQuery(this);

                        // unsets the current text field as invalid, updating
                        // all the associated (frontier text fields)
                        _unsetInvalid(element, options);
                    });
        };

        var _newLine = function(matchedObject, elementRow, options) {
            // retrieves all the rows from the element reference
            // so that it's possible to check for overlfows
            var rows = jQuery("tbody > tr:not(.template)", matchedObject);
            var rowCount = rows.length;

            // retrieves the value for the maximum number of rows and tries
            // to convert it into an integer representation, then in case it
            // is a valid integere validates it agains the row count value
            // (only in case the maximum number of rows is available)
            var maximumRows = matchedObject.attr("data-maximum_rows");
            var maximumRowsInteger = parseInt(maximumRows);
            if (maximumRows && rowCount >= maximumRowsInteger) {
                return;
            }

            // retrieves the template element
            var template = jQuery(".template", matchedObject);

            // retrieves the current line id from the matched object
            // to set it as the current line in the new template item
            var currentLineId = matchedObject.data("current_line_id");

            // applies no attributes to the template (item)
            // retrieving the resulting template item, avoids
            // the auto apply (avoids problem requesting the form)
            var templateItem = template.uxtemplate({
                        line_id : currentLineId
                    }, {
                        apply : false
                    });

            // chekc if the current table is in edit mode
            var isEdit = matchedObject.hasClass("table-edit");

            // in case the table is editable, must update the
            // associated last element
            if (isEdit) {
                // retrieves the number of children available
                // (number of cells) and then uses it to add the
                // last class to the last cell
                var children = templateItem.children();
                var childrenLength = children.length;
                var lastChild = jQuery(children.get(childrenLength - 1));
                lastChild.addClass("last");
            }

            // sets the line id in the template item (for
            // selector line references)
            templateItem.attr("data-line_id", currentLineId);

            // updates the current line id in the matched object
            matchedObject.data("current_line_id", currentLineId + 1);

            // checks if the element row is in fact a row
            // or it it's something else
            var isRow = elementRow.is("tr");

            // in case the element row is a row the template
            // item must be inserted before the given row
            if (isRow) {
                // inserts the template item before the
                // element's row
                templateItem.insertBefore(elementRow);
            }
            // otherwise the element row is not a row and
            // the template item must be appended to the
            // element row
            else {
                // adds the template item to the element
                // row element
                elementRow.append(templateItem);
            }

            // updates the invalid values on the current
            // matched object (global reset)
            _updateInvalid(matchedObject, options);

            // retrieves all the rows from the element reference
            // so that it's possible to check id the current element
            // is the last in the list
            var rows = jQuery("tbody > tr:not(.template)", matchedObject);
            var rowCount = rows.length;

            // retrieves the index of the current row to check
            // it it's the last row
            var index = templateItem.index();
            var isLastRow = index == rowCount

            // in case the current row is the last one the last
            // classes must be updated to reflect that
            if (isLastRow) {
                // removes the last class from all of the rows
                // and then adds the last class to the tempate item
                // (the newly created row)
                rows.removeClass("last");
                templateItem.addClass("last");
            }

            // runs the apply in the template item
            templateItem.uxapply();

            // registers the handlers for the template item (line)
            _registerLineHandlers(templateItem, options);

            // triggers the added line event, sends the created
            // line as an event argument
            matchedObject.triggerHandler("created_line", [templateItem]);

            // returns the created line
            return templateItem;
        };

        var _setInvalid = function(element, options) {
            // retrieves the cell and the row associated
            // with the text field
            var cell = element.parents("td");
            var row = element.parents("tr");

            // retrieves both the next cell and the next row for
            // the text field
            var nextCell = cell.next();
            var nextRow = row.next();

            // retrieves the current index for the cell and then uses
            // it to retrieve the equivalent cell in the next row
            var cellIndex = cell.index();
            var nextRowCell = jQuery("td:eq(" + cellIndex + ")", nextRow);

            // adds the next horizontal and next vertical classes to the
            // next cell and to the next row equivalent cell
            nextCell.addClass("next-horizontal-invalid");
            nextRowCell.addClass("next-vertical-invalid");
        };

        var _unsetInvalid = function(element, options) {
            // retrieves the cell and the row associated
            // with the text field
            var cell = element.parents("td");
            var row = element.parents("tr");

            // retrieves both the next cell and the next row for
            // the text field
            var nextCell = cell.next();
            var nextRow = row.next();

            // retrieves the current index for the cell and then uses
            // it to retrieve the equivalent cell in the next row
            var cellIndex = cell.index();
            var nextRowCell = jQuery("td:eq(" + cellIndex + ")", nextRow);

            // removes the next horizontal and next vertical classes to the
            // next cell and to the next row equivalent cell
            nextCell.removeClass("next-horizontal-invalid");
            nextRowCell.removeClass("next-vertical-invalid");
        };

        var _updateInvalid = function(matchedObject, options) {
            // retrieves the current set of next horizontal and
            // next vertical invalid values and then remvoes their
            // repsective classes (restores the original next invalid values)
            var allHorizontalInvalid = jQuery(".next-horizontal-invalid",
                    matchedObject);
            var allVerticalInvalid = jQuery(".next-vertical-invalid",
                    matchedObject);
            allHorizontalInvalid.removeClass("next-horizontal-invalid");
            allVerticalInvalid.removeClass("next-vertical-invalid");

            // retrieves all the text fields from the matched object that are valid
            // and then iterates over them to set the proper invalid values
            var textFields = jQuery("tbody > tr:not(.template) .text-field",
                    matchedObject);
            textFields.each(function(index, element) {
                        // retrieves the current iteration element
                        // reference for reference
                        var elementReference = jQuery(element);

                        // in case the current element does not containts
                        // the invalid class no need to update the invalid
                        // stat of it
                        if (!elementReference.hasClass("invalid")) {
                            // no need to update the invalid state, returns
                            // immediately
                            return;
                        }

                        // sets the current text field as invalid, updating
                        // all the associated (frontier text fields)
                        _setInvalid(elementReference, options);
                    });
        };

        var _clear = function(matchedObject, options) {
            // checks if the current table is of type edit, in such
            // case a line should be added in case the table is empty
            // also retrieves the rows for the current element table
            var isEdit = matchedObject.hasClass("table-edit");
            var rows = jQuery("tbody > tr:not(.template)", matchedObject);

            // removes the current set of rows (empties the table)
            // this should be able to set no ui items in the table
            rows.remove();

            // in case the table is of type edit a line must be added
            // to the end of the table in case the table is empty
            if (isEdit) {
                // retrieves the table elements
                var table = matchedObject;
                var tableBody = jQuery("tbody", table);

                // creates a new line in the table and inserts
                // it into the table body
                var _line = _newLine(table, tableBody, options);

                // adds the class default field to the line and register
                // for the key down even on it for the removal of the
                // default field token
                _line.addClass("table-default-field");
                jQuery(".text-field", _line).keydown(function() {
                            _line.removeClass("table-default-field");
                        });
            }

            // triggers the cleared event, no arguments are sent
            // for this event
            matchedObject.triggerHandler("cleared");
        };

        // switches over the method
        switch (method) {
            case "clear" :
                // clears the table contents
                _clear(matchedObject, options);

                // breaks the switch
                break;

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
