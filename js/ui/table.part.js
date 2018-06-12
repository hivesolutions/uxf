if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

/**
 * jQuery table plugin, this jQuery plugin provides the base infra-structure for
 * the creation of a table component.
 *
 * @name uxf-table.js
 * @author João Magalhães <joamag@hive.pt> & Luís Martinho <lmartinho@hive.pt>
 * @version 1.0
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2018 Hive Solutions Lda.
 * @license Apache License, Version 2.0 - http://www.apache.org/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxtable = function(method, options) {
        // the complete set of line ending that may be used for
        // the separation of lines in the paste values
        var ENDINGS = ["\r\n", "\r", "\n"];

        // the default values for the table
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
            // iterates over all the items in the matched object
            matchedObject.each(function(index, element) {
                // retrieves the element reference
                var elementReference = jQuery(element);

                // sets the ux global object representation as table
                // this value may be used latter for fast ux
                // object type access (hash based conditions)
                elementReference.uxobject("table", true);

                // retrieves the reference to the new line row and updates
                // its colspan so that it spans all the columns (very large
                // value is set)
                var newLineRow = jQuery(".table-new-line-row", elementReference);
                newLineRow.attr("colspan", "99");

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

            // iterates over all the items in the matched object, meaning
            // that the complete set of tables are going to be iterated
            matchedObject.each(function(index, element) {
                // retrieves the element reference (the table element)
                var elementReference = jQuery(element);

                // checks if the current table is of type edit, in such
                // case a line should be added in case the table is empty
                // also retrieves the rows for the current element table
                var isEdit = elementReference.hasClass("table-edit");
                var rows = jQuery("tbody > tr:not(.template)", elementReference);

                // retrieves the parent form in case it exits, as it's possible
                // to not have a parent (form) for a table
                var parentForm = elementReference.parents("form");

                // registers for the submit event
                parentForm.bind("pre_submit", function() {
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
                    if (rows.length === 0) {
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

                    // retries the name attribute from the table empty field
                    // from each of the name fields and then (re)-sets it in
                    // each of the name fields (so that it may be restored)
                    var name = tableEmptyField.attr("name") || tableEmptyField.attr(
                        "data-name");
                    tableEmptyField.attr("name", name);
                    tableEmptyField.attr("data-name", name);

                    // in case there is only one table field element
                    // the table empty field is removed to avoid it from
                    // being submited (this should only be submited in empty table)
                    (rows.length - tableDefaultField.length > 0) && tableEmptyField.removeAttr(
                        "name");
                });

                // in case the table is of type edit and the table is emtpy
                // a line must be added to the end of the table in
                // case the table is empty
                if (isEdit && rows.length === 0) {
                    // retrieves the table elements
                    var table = elementReference;
                    var tableBody = jQuery("tbody", table);

                    // creates a new line in the table and inserts
                    // it into the table body, and then retrieves
                    // the associated text fields from it
                    var _line = _newLine(table, tableBody, options);
                    var textFields = jQuery(".text-field", _line);

                    // adds the class default field to the line and registers
                    // for the key down (and up) event on it for the removal
                    // of the default field token
                    _line.addClass("table-default-field");
                    textFields.keydown(function() {
                        _line.removeClass("table-default-field");
                    });
                    textFields.keyup(function() {
                        _line.removeClass("table-default-field");
                    });
                    textFields.bind("value_change", function() {
                        _line.removeClass("table-default-field");
                    });

                    // adds the class untouched field to the line and registers
                    // for the key down (and up) event on it for the removal
                    // of the untouched field token
                    _line.addClass("table-untouched-field");
                    textFields.keydown(function() {
                        _line.removeClass("table-untouched-field");
                    });
                    textFields.keyup(function() {
                        _line.removeClass("table-untouched-field");
                    });
                }
            });
        };

        var _registerLineHandlers = function(row, options) {
            // retrieves the table and checks if it editable
            var table = row.parents(".table");
            var isEdit = table.hasClass("table-edit");

            // in case the table is not editable must return
            // immediately no line handlers will be created
            if (!isEdit) {
                return;
            }

            // creates the add and remove buttons html
            var addButtonHtml = "<td class=\"table-add\">" + "<div class=\"inline-add\"></div>" + "</td>";
            var removeButtonHtml = "<td class=\"table-remove\">" + "<div class=\"inline-remove\"></div>" +
                "</td>";

            // adds the add and remove button html to the row
            row.append(removeButtonHtml);
            row.append(addButtonHtml);

            // retrieves the various elements
            var addButton = jQuery(".table-add", row);
            var removeButton = jQuery(".table-remove", row);
            var textField = jQuery(".text-field", row);

            // retrieves the table width and the "extra width",
            // to calculate the add button left margin
            var tableWidth = table.outerWidth(true);
            var extraWidth = addButton.outerWidth(true);
            var addButtonMarginLeft = (tableWidth + extraWidth) * -1;

            // sets the add button left margin according to the
            // value that was "just" calculated
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

                // tries to retrieve the proper add button width,
                // this operation is not predictable and incorrect
                // results may arise, so the valid results are stored
                // in the internal width variable and re-used latter
                var extraWidth = addButton.outerWidth(false) || addButton.data("width");
                addButton.data("width", extraWidth);

                // retrieves the table width, to calculate
                // the add button left margin and then verifies if
                // the left margin of the button is a valid value
                var tableWidth = table.outerWidth(true);
                var addButtonMarginLeft = (tableWidth + extraWidth) * -1;
                var isValid = !isNaN(addButtonMarginLeft);

                // sets the add button left margin, it's important
                // to re-calculate this value because the table may
                // be invisible during the first calculus, note that
                // this valud is only set in case the value is valid
                // (not defined as not a number)
                isValid
                    && addButton.css("margin-left",
                        addButtonMarginLeft + "px");

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
                var isLastRow = elementRow.hasClass("last");

                // in case the current row is not the last one
                // no need to proceed with the last row update
                // process (adds last class to the last row)
                if (!isLastRow) {
                    // triggers the removed line event, sends the removed
                    // line as an event argument, then returns immediately
                    table.triggerHandler("removed_line", [elementRow]);
                    table.triggerHandler("value_change", [elementRow]);
                    return;
                }

                // retrieves the current last row and then add the last
                // class to it (updating it's structure)
                var lastRow = jQuery("tbody > tr:not(.template):last",
                    matchedObject);
                lastRow.addClass("last");

                // triggers the removed line event, sends the removed
                // line as an event argument, then triggers the value change
                // event to indicate the changing in the "logical" value
                table.triggerHandler("removed_line", [elementRow]);
                table.triggerHandler("value_change", [elementRow]);
            });

            // registers for the click on the text field
            textField.focus(function() {
                // rertrieves the current element (text field)
                var element = jQuery(this);

                // retrieves the cell, the row associated with
                // the text field and the complete set of cells
                // considered to be valid (not hidden)
                var cell = element.parents("td");
                var row = element.parents("tr");
                var cells = jQuery("td:not(.hidden)", row);

                // retrieves both the next cell and the next row for
                // the text field
                var nextCell = cell.next();
                var nextRow = row.next();

                // retrieves the current index for the cell and then uses
                // it to retrieve the equivalent cell in the next row
                var cellIndex = cells.index(cell);
                var nextRowCell = jQuery("td:not(.hidden):eq(" + cellIndex + ")", nextRow);

                // adds the next horizontal and next vertical classes to the
                // next cell and to the next row equivalent cell
                nextCell.addClass("next-horizontal");
                nextRowCell.addClass("next-vertical");

                // checks if the currently selected text field is associated
                // with the last cell in the table
                var isLastCell = cell.hasClass("last") && row.hasClass("last");

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

                    // retrieves the event key code
                    var eventKeyCode = event.keyCode ? event.keyCode : event.which;

                    // checks if the shift key is set
                    var shiftKey = event.shiftKey;

                    // in case the shift key is set or the currently
                    // pressed key is not the tab key, no need to
                    // create a new line
                    if (shiftKey || eventKeyCode !== 9) {
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

            // registers for the paste operation so that it's possible
            // to correctly parse it as a dynamic value
            textField.bind("paste", function(event) {
                // starts some of the more "global" values thata are going
                // to be used through the function
                var index = null;

                // retrieves the reference to the current element (text field)
                // that is going to be used in the processing operation
                var element = jQuery(this);

                // retrieves the reference to some of the elements to be used
                // in the processing of the paste event on the table
                var column = element.parents("td");
                var table = column.parents(".table");
                var target = jQuery(
                    "> [data-object]:not([disabled], .disabled)",
                    column);

                // verifies if the paste feature has been explicitly disabled for
                // the current table and if that's the case returns immedidately
                // as there's nothing left to be done
                var noPaste = table.attr("data-no_paste");
                if (noPaste) {
                    return;
                }

                // retrieves the reference to the original event (not processed)
                // and then retrieves the clipboard data from it
                var original = event.originalEvent;
                var clipboardData = original.clipboardData || window.clipboardData;
                var textData = clipboardData && clipboardData.getData("Text");

                // in case no valid data was able to be retrieved from the clipboard
                // returns the control flow immediately
                if (!textData) {
                    return;
                }

                // normalizes the text data, so that no extra (not required) operations
                // are going to be performed from the content of it (optimization)
                textData = textData.strip("\r\n");
                textData = textData.strip("\r");
                textData = textData.strip("\n");
                textData = textData.strip("\t");

                // sets the default (line) ending that is going to be used for verification
                // in case no valid one is found
                var ending = "\n";

                // iterates over the complete set of possible (line) endings trying to
                // find the one that best fits the current text data scenario
                for (index = 0; index < ENDINGS.length; index++) {
                    var _ending = ENDINGS[index];
                    var exists = textData.indexOf(_ending) !== -1;
                    if (!exists) {
                        continue;
                    }
                    ending = _ending;
                    break;
                }

                // verifies if the provided text data is valid for the structured paste
                // oepration and if that's not the case reuturns immedidately
                var isValid = textData.indexOf(ending) !== -1 || textData.indexOf("\t") !== -1;
                if (!isValid) {
                    return;
                }

                // sets the first initial value as the current target, assumes that
                // the current target should be the first to be populated
                var initial = target;

                // splits the provided text data arround the newline character to
                // retrieve the multiple line values of it
                var lines = textData.split(ending);

                // iterates over the miltiple lines contained in the text to populate
                // the associated lines in the table
                for (index = 0; index < lines.length; index++) {
                    // retrieves the current line and splits arrount its columns
                    var line = lines[index];
                    var columns = line.split("\t");

                    // in case there are no columns in the current line, simply
                    // ignores it (no applicability)
                    if (columns.length === 0) {
                        continue;
                    }

                    // iterates over the complete set of columns to set the values
                    // for the current line in iteration in the table
                    for (var _index = 0; _index < columns.length; _index++) {
                        // tries to retrieve the current element to be used in the
                        // operation that is going to populate the value
                        var current = initial || _next(
                            current,
                            "> [data-object]:not([disabled], .disabled)",
                            null, null, true);
                        initial = null;
                        if (!current) {
                            break;
                        }

                        // retrieves the current column in iteration (value) and uses
                        // it to populate the current element using the normal value
                        // setting operation (as expected)
                        var columnValue = columns[_index];
                        current.uxvalue(columnValue);
                        current.uxfocus();
                    }

                    // determines if this is the last iteration (over lines) and if that's
                    // the case breaks the current loop (avoids extra elements creation)
                    var isLast = index === lines.length - 1;
                    if (isLast) {
                        break;
                    }

                    // retrieves the current row associated with the current element
                    // in iteration and then uses it to retrieve the last column
                    var row = current.parents("tr");
                    var lastColumn = jQuery("td.last", row);
                    initial = _next(
                        null,
                        "> [data-object]:not([disabled], .disabled)",
                        lastColumn, null, true);

                    // in case the next initial is an invalid one (not possible to set it)
                    // must break the current iteration no more rows available in table
                    if (!initial) {
                        break;
                    }
                }

                // stops the propagation of the event and then prevents the default
                // set of operations from happending
                event.stopPropagation();
                event.stopImmediatePropagation();
                event.preventDefault();
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
                line_id: currentLineId
            }, {
                apply: false
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
            rows = jQuery("tbody > tr:not(.template)", matchedObject);
            rowCount = rows.length;

            // retrieves the index of the current row to check
            // it it's the last row
            var index = templateItem.index();
            var isLastRow = index === rowCount;

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
            // line as an event argument, the also triggers a value
            // changed event to indicate the changing of the "logical value"
            matchedObject.triggerHandler("created_line", [templateItem]);
            matchedObject.triggerHandler("value_change", [templateItem]);

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
                // it into the table body, and then retrieves
                // the associated text fields from it
                var _line = _newLine(table, tableBody, options);
                var textFields = jQuery(".text-field", _line);

                // adds the class default field to the line and registers
                // for the key down even on it for the removal of the
                // default field token
                _line.addClass("table-default-field");
                textFields.keydown(function() {
                    _line.removeClass("table-default-field");
                });
                textFields.keyup(function() {
                    _line.removeClass("table-default-field");
                });
                textFields.bind("value_change", function() {
                    _line.removeClass("table-default-field");
                });

                // adds the class untouched field to the line and registers
                // for the key down (and up) event on it for the removal
                // of the untouched field token
                _line.addClass("table-untouched-field");
                textFields.keydown(function() {
                    _line.removeClass("table-untouched-field");
                });
                textFields.keyup(function() {
                    _line.removeClass("table-untouched-field");
                });
            }

            // triggers the cleared event, no arguments are sent
            // for this event
            matchedObject.triggerHandler("cleared");
        };

        var _next = function(element, selector, column, row, force, noNext) {
            // starts some of the global variable to be re-used through
            // the function execution
            var columns = null;

            // tries to retrieve the reference column and row using
            // either the provided ones or the current element context
            column = column || element.parents("td");
            row = row || column.parents("tr");

            // sets the current column (for iteration) as the next column
            // in the current row, this is the starting point for row iteration,
            // notice that if the no next (column) flag is set the current
            // provided column should be used instead
            column = noNext ? column : column.next();

            // iterates continuously trying to find the next element
            // in reference to the provided one using the provided selector
            while (true) {
                // iterates continuosly over the complete set of remaining
                // columns in the curren row, trying to find any that contains
                // elements that comply with the provided selectors
                while (true) {
                    // in case the current column selector is invalid, no
                    // value in sequence, breaks the loop no more columns
                    // available for the current row
                    if (column.length === 0) {
                        break;
                    }

                    // tries to retrieve any possible valid target (according
                    // to the selector) and if there's at least one returns it
                    // as the valid next element, otherwise the next iteration
                    // tick will be made on the next column
                    var targets = jQuery(selector, column);
                    if (targets.length > 0) {
                        return jQuery(targets.get(0));
                    }

                    // retrieves the reference to the next column in the current
                    // row, this is the next element in the iteration cycle
                    column = column.next();
                }

                // verifies if this is the last row if that's the case there's
                // nothing remaing to be done and the loop must break
                var isLast = row.hasClass("last");
                if (isLast) {
                    break;
                }

                // retieves the next row and the column in set as the first one
                // so that its possible to continue the loop
                row = row.next();
                columns = jQuery("> td", row);
                column = jQuery(columns.get(0));
            }

            // in case the force flag is set a new line should be created so that
            // the table may properly handle the next element request
            if (force) {
                var table = row.parents(".table");
                var tableBody = jQuery("tbody", table);
                row = _newLine(table, tableBody);
                columns = jQuery("> td", row);
                column = jQuery(columns.get(0));
                return _next(element, selector, column, row, false, true);
            }

            // reurns the default invalid value meaning that no valid next element
            // was found according to the provided criterea
            return null;
        };

        // switches over the method
        switch (method) {
            case "clear":
                // clears the table contents
                _clear(matchedObject, options);
                break;

            case "reset":
                // clears the table contents
                _clear(matchedObject, options);
                return true;

            case "default":
                // initializes the plugin
                initialize();
                break;
        }

        // returns the object
        return this;
    };
})(jQuery);
