/**
 * jQuery filter plugin, this jQuery plugin provides the base infra-structure
 * for the creation of a filter component.
 *
 * @name jquery-filter.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @date March 10, 2010
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2014 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxfilter = function(options) {
        // the default values for the filter
        var defaults = {
            numberRecords : 9
        };

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
            // retrieves the base options
            var numberRecords = options["numberRecords"];

            // retrieves the filter input
            var filterInput = jQuery(".filter-input", matchedObject);

            // disables the auto complete in the filter input element
            filterInput.attr("autocomplete", "off");

            // sets the matched object base data
            matchedObject.data("filter_string", "");
            matchedObject.data("start_record", 0);
            matchedObject.data("selection", [0]);
            matchedObject.data("pivot", 0);
            matchedObject.data("number_records", numberRecords);
            matchedObject.data("complete", false);
            matchedObject.data("pending", false);

            // iterates over all the matched objects
            matchedObject.each(function(index, element) {
                // retrieves the element reference
                var _element = jQuery(element);

                // retrieves the value for the advanced attribute of the filter
                // (in case it's set the advanced panel should be displayed)
                var advanced = _element.attr("data-advanced");

                // retrieves the value of the no unput value that controls if
                // an input should be created if none is found
                var noInput = _element.attr("data-no_input");

                // retrieves the number of records attribute and then tries to
                // parse it as an integer value in case it fails falls back to
                // the original value otherwise used the newly processed one
                var numberRecordsS = _element.attr("data-number_records");
                var numberRecordsI = parseInt(numberRecordsS);
                numberRecordsI = isNaN(numberRecordsI)
                        ? numberRecords
                        : numberRecordsI;

                // retrieves the filter contents and
                // the filter more (if present)
                var filterContents = jQuery("> .filter-contents", _element);
                var filterMore = jQuery("> .filter-more", _element);

                // retrieves the text field (element) assicated with the
                // curernt filter for the main filtering
                var textField = jQuery("> .text-field", _element);

                // in case there is no text field defined for the
                // current element one must be created, only in case
                // the no input flag is not set
                if (textField.length == 0 && !noInput) {
                    // retrieves the various attributes from the element
                    // to be propagated to the text field
                    var name = _element.attr("name");
                    var value = _element.attr("value");
                    var originalValue = _element.attr("data-original_value");
                    var error = _element.attr("data-error");

                    // creates the text field element and sets the various
                    // attributes in it
                    var textField = jQuery("<input type=\"text\" class=\"text-field filter-input\" />");
                    textField.val(value);
                    textField.attr("name", name);
                    textField.attr("data-original_value", originalValue);
                    textField.attr("data-error", error);

                    // preppends the text field to the element and runs
                    // the text field initializer
                    _element.prepend(textField);
                    textField.uxtextfield();
                }

                // creates the element representing the buttons for the filter
                // fild (the more oprtions and the view changer) and adds it
                // to the filter in case the advanced flag is set
                var filterButtons = jQuery("<div class=\"filter-input-buttons\">"
                        + "<div class=\"button filter-input-button filter-input-toggle-advanced filter-input-more\"></div>"
                        + "<div class=\"button filter-input-button filter-input-toggle-views\"></div>"
                        + "<div class=\"clear\"></div>" + "</div>");
                advanced && filterButtons.insertAfter(textField);

                // creates the advanced part of the filter (more options) and adds
                // it to the filter in case the advanced flag is set
                var filterAdvanced = jQuery("<div class=\"filter-advanced\">"
                        + "<div class=\"filter-input-add filter-input-first\"></div>"
                        + "<div class=\"filter-sort\">"
                        + "<div class=\"filter-clear\"></div>"
                        + "</div>"
                        + "<div class=\"filter-advanced-filters\"></div>"
                        + "<div class=\"filter-advanced-buttons\">"
                        + "<div class=\"button small button-grey filter-advanced-select\">Select All</div>"
                        + "<div class=\"button small button-grey disabled filter-advanced-save\">Save</div>"
                        + "<div class=\"filter-clear\"></div>" + "</div>"
                        + "</div>");
                advanced && filterAdvanced.insertAfter(filterButtons);

                // checks for the presence of the proper list class from
                // the element
                var isList = _element.hasClass("list-list");
                var isTable = _element.hasClass("table-list");
                var isGallery = _element.hasClass("gallery-list");

                // retrieves the element button that was just created to
                // add the apropriate class
                var toggleViews = jQuery(".filter-input-toggle-views", _element);

                // adds the appropriate filter input class to the toggle
                // views button accorging to the current mode
                isList && toggleViews.addClass("filter-input-list");
                isTable && toggleViews.addClass("filter-input-table");
                isGallery && toggleViews.addClass("filter-input-gallery");

                // retrieves the data source associated with the element
                // and then uses it to retrieve the various order items
                var dataSource = jQuery("> .data-source", _element);
                var dataOrder = jQuery(".order > li", dataSource);

                // retrieves the sort section of the filter to be used
                // to add more filter sort options and retrieves the
                // associated clear element to be as anchor point
                var filterSort = jQuery(".filter-sort", _element);
                var filterClear = jQuery("> .filter-clear", filterSort);

                // retrieves the filtering section of the filter and then
                // retrieves its items to check for valid filtering
                var filterFiltering = jQuery(".filtering > li", dataSource);

                // iterates over each of the data source order elements
                // to create the associated (visual) sort options
                dataOrder.each(function(index, element) {
                    // retrieves the current element in
                    // iteration to be added
                    var _element = jQuery(this);

                    // retrieves the html (text) value of the current element
                    // in iteration and uses it to create the filter sort option
                    // element and then adds it to the filter sort (from clear)
                    var valueHtml = _element.html();
                    var valueName = _element.attr("data-name");
                    var valueOrder = _element.attr("data-order")
                            || "descending";
                    var filterOption = jQuery("<div class=\"filter-sort-option\">"
                            + valueHtml + "</div>");
                    filterOption.attr("data-name", valueName);
                    filterOption.attr("data-order", valueOrder);
                    filterOption.insertBefore(filterClear);
                });

                // adds the devault sort option to the filter, this value exists for
                // every search and indicates that no sort will occur (default is used)
                filterSort.prepend("<div class=\"filter-sort-option selected equals\" data-order=\"equals\">default</div>");

                // checks if the filtering is enabled and valid for the
                // current context of execution
                var hasFiltering = filterFiltering.length > 0 ? true : false;

                // in case the advanced mode is active adds the initial filter
                // line to the filters area, but only in case there are valid
                // filters and so the filtering is enabled
                advanced && hasFiltering && _addFilter(_element);

                // in case there is currenlty no valid filtering in the data
                // source must disabled the filtering part in the advanced area
                !hasFiltering && _disableFiltering();

                // retrieves the text value from the filter more
                // and then encapsulates it arround the text divisor
                // then adds it in conjuction to the spinner to the
                // filter more component, as the new filter more contents
                var filterMoreText = filterMore.html();
                filterMore.html("<div class=\"text\">" + filterMoreText
                        + "</div>" + "<div class=\"spinner\"></div>");

                // retrieves the filter more length
                var filterMoreLength = filterMore.length;

                // adds the "extra" html to the matched object,
                // in case no filter contents is found
                if (filterContents.length == 0) {
                    // creates the filter contents element and adds it to the
                    // filter according to the filter more status
                    var filterContents = jQuery("<div class=\"filter-contents\"></div>");
                    var filterClear = jQuery("<div class=\"filter-clear\"></div>");
                    filterMoreLength > 0
                            ? filterContents.insertBefore(filterMore)
                                    && filterClear.insertBefore(filterMore)
                            : _element.append(filterContents);
                }

                // updates the element's number of records with
                // the newly updated value for it (as processed)
                _element.data("number_records", numberRecordsI);

                // sets the various initial data objects in the
                // currently selected filter element
                _element.data("cache", {});

                // updates the element (matched object) state
                // for the initial contents
                _update(_element, options);
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the window element reference
            var _window = jQuery(window);

            // retrieves the document element reference
            var _document = jQuery(document);

            // retrieves the body element reference
            var _body = jQuery("body");

            // retrieves the filter input
            var filterInput = jQuery("> .filter-input", matchedObject);

            // retrieves the filter more
            var filterMore = jQuery("> .filter-more", matchedObject);

            // retrieves the text field
            var textField = jQuery("> .text-field", matchedObject);

            // retrieves the references to the various sort
            // buttons to be used in the advanced panel
            var filterOptions = jQuery(".filter-sort-option", matchedObject);

            // retrieves both the toggle advanced and the
            // toggle views buttons
            var toggleAdvanced = jQuery(".filter-input-toggle-advanced",
                    matchedObject);
            var toggleViews = jQuery(".filter-input-toggle-views",
                    matchedObject);

            // retrieves the filter add button to be used to add
            // a new line of filtering to the filter advanced panel
            var filterAdd = jQuery(".filter-advanced > .filter-input-add",
                    matchedObject);

            // retrieves the filter select (all) button used
            // to select the complete set of items in the filter
            var filterSelect = jQuery(".filter-advanced-select", matchedObject);

            // checks if the filter click event is already
            // registerd in the body and set the variable as
            // true to avoid further registrations
            var isRegistered = _body.data("filter_click");
            matchedObject.length > 0 && _body.data("filter_click", true);

            // tries to retrieve the value for the infinite loading
            // support in the matched object (by default it's disabled)
            var infinite = matchedObject.attr("data-infinite") || false;

            // registers for the update event so that the data is reloaded
            // once this event is raises, this is expected to be done using
            // the trigger handler method so that no buble occurs
            matchedObject.bind("update", function() {
                        // retrieves the current element (filter) and triggers an
                        // update operation that is considered to be forced
                        var element = jQuery(this);
                        _update(element, options, true);
                    });

            // registers for the new element event that triggers the
            // request for the insertion of a new element of data to
            // the top of the filter contents
            matchedObject.bind("new_element", function(event, element) {
                        // retrieves the current element as the filter and then retrievs
                        // the internal reference to the contents and the template
                        var filter = jQuery(this);
                        var filterContents = jQuery(".filter-contents", filter);
                        var template = jQuery(".template", filter);

                        // creates the map with the options for the
                        // rendering of the template to changed the
                        // default value to be used
                        var options = {
                            apply : true,
                            nullify : true,
                            localize : true,
                            defaultValue : "-"
                        };

                        // tries to retrieve the object identifier from the
                        // current item to be used as identifier of the element
                        var objectId = element["object_id"] || element["oid"];

                        // tries to retrieve the unique identifier from the
                        // current item to be used as the cache key
                        var uniqueId = element["unique_id"] || element["uid"];

                        // applies the template to the template (item)
                        // retrieving the resulting template item and
                        // setting it the cache map for the unique id
                        // only in case the unique id is valid (set)
                        var templateItem = template.uxtemplate(element, options);
                        if (uniqueId) {
                            cache[uniqueId] = {
                                item : templateItem,
                                data : element
                            }
                        }

                        // sets the object identifier information in the template
                        // item (considered the main identifier for it)
                        templateItem.data("object_id", objectId);

                        // removes the filter element class from the template item,
                        // then initializes its structures (event handling registration)
                        templateItem.addClass("filter-element");
                        _initTemplateItem(filter, templateItem);

                        // adds the new template item to the initial part
                        // of the filter contents section
                        filterContents.prepend(templateItem);
                    });

            // registers for the focus event on the text field
            // to change the visibility of the filter buttons
            textField.focus(function() {
                        // retrieves the current element and uses it to retrieve
                        // the parent filter element
                        var element = jQuery(this);
                        var filter = element.parent(".filter");

                        // retrieves the filter buttons part of the filter
                        // and adds the lower class to them
                        var filterButtons = jQuery(".filter-input-buttons",
                                filter);
                        filterButtons.addClass("lower");
                    });

            // registers for the blur event on the text field
            // to change the visibility of the filter buttons
            textField.blur(function() {
                        // retrieves the current element and uses it to retrieve
                        // the parent filter element
                        var element = jQuery(this);
                        var filter = element.parent(".filter");

                        // retrieves the filter buttons part of the filter
                        // and removes the lower class from them
                        var filterButtons = jQuery(".filter-input-buttons",
                                filter);
                        filterButtons.removeClass("lower");
                    });

            // registers for the key down event in the text field
            textField.keydown(function(event) {
                        // retrieves the element
                        var element = jQuery(this);

                        // retrieves the event key code
                        var eventKeyCode = event.keyCode
                                ? event.keyCode
                                : event.which;

                        // switches over the event key code
                        switch (eventKeyCode) {
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

                        // retrieves the filter
                        var filter = element.parents(".filter");

                        // retrieves the event key code
                        var eventKeyCode = event.keyCode
                                ? event.keyCode
                                : event.which;

                        // switches over the event key code
                        switch (eventKeyCode) {
                            // in case it's the page up key
                            case 33 :
                                // in case the shift key is pressed range mode
                                // must be "activated"
                                if (event.shiftKey) {
                                    // "ups" the "current" range (selection)
                                    _upRange(filter, options);
                                }
                                // otherwise the "normal" up operation
                                // must be used
                                else {
                                    // sets the "current" selection to the up
                                    _upSelection(filter, options);
                                }

                                break;

                            // in case it's the page down key
                            case 34 :
                                // in case the shift key is pressed range mode
                                // must be "activated"
                                if (event.shiftKey) {
                                    // "downs" the "current" range (selection)
                                    _downRange(filter, options);
                                }
                                // otherwise the "normal" up operation
                                // must be used
                                else {
                                    // sets the "current" selection to the bottom
                                    _downSelection(filter, options);
                                }

                                break;

                            // in case it's the up key
                            case 38 :
                                // in case the shift key is pressed range mode
                                // must be "activated"
                                if (event.shiftKey) {
                                    // increments the "current" range (selection)
                                    _incrementRange(filter, options);
                                }
                                // otherwise the "normal" incrementing operation
                                // must be used
                                else {
                                    // increments the "current" selection
                                    _incrementSelection(filter, options);
                                }

                                // stops event propagation (avoids cursor
                                // movement in the text field)
                                event.stopPropagation();

                                // breaks the switch
                                break;

                            // in case it's the down key
                            case 40 :
                                // in case the shift key is pressed range mode
                                // must be "activated"
                                if (event.shiftKey) {
                                    // decrements the "current" range (selection)
                                    _decrementRange(filter, options);
                                }
                                // otherwise the "normal" decrementing operation
                                // must be used
                                else {
                                    // decrements the "current" selection
                                    _decrementSelection(filter, options);
                                }

                                // stops event propagation (avoids cursor
                                // movement in the text field)
                                event.stopPropagation();

                                // breaks the switch
                                break;
                        }
                    });

            // registers for the click event on the filter option
            // buttons to toggle their state
            filterOptions.click(function() {
                        // retrieves the current element and the associated
                        // filter element
                        var element = jQuery(this);
                        var filter = element.parents(".filter");

                        // retrieves the currently selected sort option
                        // to check if it's the sames as the one that
                        // has just been clicked
                        var selectedOption = jQuery(
                                ".filter-sort-option.selected", filter);
                        var isSame = element[0] == selectedOption[0];

                        // retrieves the value for the order attribute of
                        // the element to be used in case new element is selected
                        var order = element.attr("data-order");

                        // checks if the currently selected option is of
                        // type equals in such case returns immediately, nothing
                        // is meant to be done (no change)
                        var isEquals = element.hasClass("equals");
                        if (isEquals) {
                            return;
                        }

                        // in case the clicked option is the same the sorting
                        // order must be changed
                        if (isSame) {
                            // checks if the current sort order is descending and
                            // changes the sort order accordingly
                            var isDescending = selectedOption.hasClass("descending");
                            isDescending
                                    ? selectedOption.removeClass("descending")
                                    : selectedOption.removeClass("ascending");
                            isDescending
                                    ? selectedOption.addClass("ascending")
                                    : selectedOption.addClass("descending");
                        }
                        // otherwise the the element is not the same and the
                        // previous element must be unselected and the new one
                        // selected in descending order
                        else {
                            // removes the selected classes from the selected
                            // option, to unselect the selected option
                            selectedOption.removeClass("selected");
                            selectedOption.removeClass("ascending");
                            selectedOption.removeClass("descending");
                            selectedOption.removeClass("equals");

                            // selects the clicked element by adding the selected
                            // class and the descending class (sort order)
                            element.addClass("selected");
                            element.addClass(order);
                        }

                        // updates the filter state to reflect the changed
                        // in the order for the filter
                        _update(filter, options, true);
                    });

            // registers for the click event in the toggle advanced
            // button to change the state of the advanced panel
            toggleAdvanced.click(function() {
                        // retrieves the current element and the associated
                        // filter element
                        var element = jQuery(this);
                        var filter = element.parents(".filter");

                        // retrieves the advanced panel for the filter component
                        // in order to toggle its visibility
                        var filterAdvanced = jQuery(".filter-advanced", filter);

                        // checks if the advanced button is currently in the
                        // "more" state to toggle the visility of the advanced
                        // panel according to the state
                        var isMore = element.hasClass("filter-input-more");

                        // in case the button is currently in the more state
                        // the advanced panel must be shown
                        if (isMore) {
                            // changes the current filter input states
                            // and shows the filter advanced panel
                            element.removeClass("filter-input-more");
                            element.addClass("filter-input-less");
                            filterAdvanced.show();
                        } else {
                            // changes the current filter input states
                            // and hides the filter advanced panel
                            element.removeClass("filter-input-less");
                            element.addClass("filter-input-more");
                            filterAdvanced.hide();
                        }
                    });

            // registers for the click event in the toggle views
            // button to change the current view visibility
            toggleViews.click(function() {
                        // retrieves the current element and the associated
                        // filter element
                        var element = jQuery(this);
                        var filter = element.parents(".filter");

                        // checks the type of filter currently displayed
                        // in the target filter associated with the toggle button
                        var isList = element.hasClass("filter-input-list");
                        var isTable = element.hasClass("filter-input-table");

                        // checks the type of views possible to be displayed
                        // for the current filter component
                        var hasListView = jQuery(".list-view", filter).length;
                        var hasTableView = jQuery(".table-view", filter).length;
                        var hasGalleryView = jQuery(".gallery-view", filter).length;

                        // in case the current state is list
                        if (isList) {
                            // in case there is no table and gallery views
                            // it's not possible to move "forward", returns
                            // immediately from the function
                            if (!hasTableView && !hasGalleryView) {
                                return;
                            }

                            // removes the list associated classes from both
                            // the element and filter
                            element.removeClass("filter-input-list");
                            filter.removeClass("list-list");

                            // adds the appropriate classes based on the
                            // existence of the table view
                            hasTableView
                                    ? element.addClass("filter-input-table")
                                    : element.addClass("filter-input-gallery");
                            hasTableView
                                    ? filter.addClass("table-list")
                                    : filter.addClass("gallery-list");
                        } else if (isTable) {
                            // in case there is no gallery and list views
                            // it's not possible to move "forward", returns
                            // immediately from the function
                            if (!hasGalleryView && !hasListView) {
                                return;
                            }

                            // removes the table associated classes from both
                            // the element and filter
                            element.removeClass("filter-input-table");
                            filter.removeClass("table-list");

                            // adds the appropriate classes based on the
                            // existence of the gallery view
                            hasGalleryView
                                    ? element.addClass("filter-input-gallery")
                                    : element.addClass("filter-input-list");
                            hasGalleryView
                                    ? filter.addClass("gallery-list")
                                    : filter.addClass("list-list");
                        } else {
                            // in case there is no list and table views
                            // it's not possible to move "forward", returns
                            // immediately from the function
                            if (!hasListView && !hasTableView) {
                                return;
                            }

                            // removes the gallery associated classes from both
                            // the element and filter
                            element.removeClass("filter-input-gallery");
                            filter.removeClass("gallery-list");

                            // adds the appropriate classes based on the
                            // existence of the list view
                            hasListView
                                    ? element.addClass("filter-input-list")
                                    : element.addClass("filter-input-table");
                            hasListView
                                    ? filter.addClass("list-list")
                                    : filter.addClass("table-list");
                        }
                    });

            // registers for the click event on the filter add button
            // to add a new filtering line to the filter
            filterAdd.click(function() {
                        // retrieves the current element and the associated
                        // filter element
                        var element = jQuery(this);
                        var filter = element.parents(".filter");

                        // adds a "new" filter line to the current filter
                        // element (component) and updates the filter
                        _addFilter(filter);
                        _update(filter, options, true);
                    });

            // registers for the click event on the filter select
            // to select all the filter element currently shown
            filterSelect.click(function() {
                        // retrieves the current element and the associated
                        // filter element
                        var element = jQuery(this);
                        var filter = element.parents(".filter");

                        // retrieves the currently (visible) filer elements
                        // to count them for the selection range
                        var filterElements = jQuery(".filter-element", filter);
                        var numberElements = filterElements.length;

                        // creates the list for the elements to be selected
                        // to be part of the selection
                        var selection = []

                        // iterates over the number of elements to insert the
                        // index into the selection list
                        for (var index = 1; index < numberElements + 1; index++) {
                            selection.push(index);
                        }

                        // resets the current selection to be the
                        // currently selected element
                        filter.data("selection", selection);
                        filter.data("pivot", 1);

                        // updates the current selection
                        _updateSelection(filter, options);
                    });

            // registers for the key up in the filter input
            filterInput.keyup(function() {
                        // retrieves the element
                        var element = jQuery(this);

                        // retrieves the (parent) filter
                        var filter = element.parents(".filter");

                        // retrieves the filter string and the filter
                        // input value (to check for string value changes)
                        var filterString = filter.data("filter_string");
                        var filterInputValue = filterInput.attr("data-value");

                        // in case no string value changes occured
                        if (filterString == filterInputValue) {
                            // returns immediately
                            return;
                        }

                        // updates the filter state
                        _update(filter, options);
                    });

            // registers for the click in the filter input
            filterMore.click(function() {
                        // retrieves the element
                        var element = jQuery(this);

                        // retrieves the (parent) filter
                        var filter = element.parents(".filter");

                        // updates the filter state
                        _update(filter, options);
                    });

            // registers for the key down in the document
            // element in case the matched object is valid and then
            // sets the on destroy handler to avoid duplicated
            // handlers in a multiple filter environment
            matchedObject.length > 0
                    && _document.keydown(onKeyDown = function(event) {
                        // sets the filter as the matched object
                        var filter = matchedObject;

                        // retrieves the key value
                        var keyValue = event.keyCode
                                ? event.keyCode
                                : event.charCode ? event.charCode : event.which;

                        // switches over the key value
                        switch (keyValue) {
                            // in case it's the enter key
                            case 13 :
                                // retrieves the selected list item
                                var listItemSelected = jQuery(
                                        ".filter-contents > .selected", filter);

                                // updates the current selection, runs the
                                // appropriate (default) actions
                                _select(listItemSelected, filter, options);

                                // breaks the switch
                                break;

                            // in case it's the j key
                            case 74 :
                                // in case the shift key is pressed range mode
                                // must be "activated"
                                if (event.shiftKey) {
                                    // decrements the "current" range (selection)
                                    _decrementRange(filter, options);
                                }
                                // otherwise the "normal" decrementing operation
                                // must be used
                                else {
                                    // decrements the "current" selection
                                    _decrementSelection(filter, options);
                                }

                                // breaks the switch
                                break;

                            // in case it's the k key
                            case 75 :
                                // in case the shift key is pressed range mode
                                // must be "activated"
                                if (event.shiftKey) {
                                    // increments the "current" range (selection)
                                    _incrementRange(filter, options);
                                }
                                // otherwise the "normal" incrementing operation
                                // must be used
                                else {
                                    // increments the "current" selection
                                    _incrementSelection(filter, options);
                                }

                                // breaks the switch
                                break;

                            // in case it's default
                            default :
                                // breaks the switch
                                break;
                        }
                    });
            matchedObject.bind("destroyed", function() {
                        _document.unbind("keydown", onKeyDown);
                    });

            // registers for the click event in order
            // to avoid problems with deselection
            matchedObject.length > 0 && matchedObject.click(function(event) {
                        // sets the avoid next flag to avoid deselection
                        matchedObject.data("avoid_next", true);
                    });

            // registers for the click event in the body element
            // to deselect the element only in case no previous
            // registration was made (avoids duplicates)
            matchedObject.length > 0 && !isRegistered
                    && _body.click(function(event) {
                                // retrieves the value of the avoid next flag and
                                // then unsets the avoid next flag
                                var avoidNext = matchedObject.data("avoid_next");
                                matchedObject.data("avoid_next", false);

                                // in case the avoid next flag is set
                                if (avoidNext) {
                                    // returns immediately
                                    return;
                                }

                                // resets both the selection and the pivot values
                                matchedObject.data("selection", [0]);
                                matchedObject.data("pivot", 0);

                                // updates the current selection
                                _updateSelection(matchedObject, options);
                            });

            // registers for the scroll event in the window in case
            // the infinite scroll support is enabled
            matchedObject.length > 0 && infinite && _window.scroll(function() {
                        // sets the filter as the matched object, this
                        // considered to be a global singleton handler
                        var filter = matchedObject;

                        // retrieves the top offset of the page, using
                        // the margin element (from the margin top)
                        var margin = jQuery(".margin");
                        var pageOffset = margin.outerHeight(true);

                        // retrieves the filter more element height as the
                        // delta value for the visibility testing this way
                        // the visibility test is done agains the top
                        var delta = filterMore.outerHeight() * -1;

                        // checks if the element is visible
                        var isVisible = filterMore.length ? jQuery.uxvisible(
                                filterMore, pageOffset, delta) : false;

                        // updates the filter state
                        isVisible && _update(filter, options);
                    });
        };

        var _update = function(matchedObject, options, force) {
            // retrieves the (parent) filter and the
            // associated template
            var filter = matchedObject;
            var filterInput = jQuery(".filter-input", filter);
            var filterContents = jQuery(".filter-contents", filter);
            var filterNoResults = jQuery(".filter-no-results", filter);
            var filterMore = jQuery(".filter-more", filter);
            var dataSource = jQuery("> .data-source", filter);
            var template = jQuery(".template", filter);

            // retrieves the filter options
            var filterString = filter.data("filter_string");
            var startRecord = filter.data("start_record");
            var numberRecords = filter.data("number_records");
            var complete = filter.data("complete");
            var pending = filter.data("pending");

            // retrieves the current list of defined filters, this value
            // will be used as the starting point for the gathering of
            // the various filters from the main filter element
            var _filters = filter.data("filters");
            _filters = _filters ? _filters.slice(0) : [];

            // retrieves the proper (default) sorting information for the
            // filters this is only going to be used in case no sorting
            // information is retrieved from the filter elements
            var _sort = filter.data("sort") || null;

            // "forces" the number of records to the table list this is
            // done so that the proper value is defined
            numberRecords = filter.hasClass("table-list") ? 14 : numberRecords;

            // retrieves the filter input value, defaulting to empty
            // string in case no valid value is retrieved
            var filterInputValue = filterInput.attr("data-value") || "";

            // sets the initial vaalue for the reset flag
            var reset = false;

            // in case the value in the filter input
            // has changed (reset required)
            if (filterString != filterInputValue || force) {
                // resets the (current) selection value
                filter.data("selection", [0]);
                filter.data("pivot", 0);

                // resets the start record, including
                // the current "local" value
                filter.data("start_record", 0);
                startRecord = 0;

                // sets the reset flag
                reset = true;
            }
            // in case other reason triggers the update (additional
            // care must be taken)
            else {
                // in case the filter is already complete or
                // it has data pending to be retrieved
                if (complete || pending) {
                    // returns immeidately (can not retrieve
                    // any more data for now)
                    return;
                }
            }

            // retrieves the selected sort options and then uses it
            // to retrieve the value to be used for the sorting
            var sortSelected = jQuery(".filter-sort-option.selected", filter);
            var sortValue = sortSelected.attr("data-name")
                    || sortSelected.html();

            // checks if the sort option is currently in the ascending mode
            // and "calculates" the sort order string based on it, then created
            // the sorting list (tuple) to be used in the query
            var isAscending = sortSelected.hasClass("ascending");
            var sortOrder = isAscending ? "ascending" : "descending";
            var sort = sortValue ? [sortValue, sortOrder] : _sort;

            // retrieves the complete set of (graphical) filter lines to be
            // parser in search for the valid filters
            var filters = jQuery(".filter-advanced-filter", filter);

            // iterates over all the filters (lines) in order to create the
            // various filter tuples and then add them to the base filters
            // list that will be used for the query in the data source
            filters.each(function() {
                        // retrieves the current element in iteration
                        var element = jQuery(this);

                        // retrieves the various components of the filter line
                        // (drop field, operation field and value field)
                        var dropField = jQuery(
                                "> .drop-field:not(.operation-field)", element);
                        var operationField = jQuery("> .operation-field",
                                element);
                        var valueField = jQuery("> .value-field", element);

                        // retrieves the data source of the operation field to be
                        // used for the retrieval of the items and operations lists
                        var operationSource = jQuery("> .data-source",
                                operationField);

                        // checks if the current value field is of type drop field
                        // and retrieves the value accordingly
                        var isDropField = valueField.hasClass("drop-field");
                        if (isDropField) {
                            // retrieves the hidden field associated with the value
                            // field and uses its value as the value
                            var hiddenField = jQuery(".hidden-field",
                                    valueField);
                            var value = hiddenField.val();
                        } else {
                            // retrieves the value of the value field using the text
                            // field based approach
                            var value = valueField.uxtextfield("value");
                        }

                        // in case no value is present this filter is ignored
                        // not possible to filter value
                        if (!value) {
                            return;
                        }

                        // retrieves the attribute for the filter line and the currently
                        // selected operation value
                        var attribute = element.data("name")
                                || dropField.uxdropfield("value");
                        var operation = operationField.uxdropfield("value");

                        // retrieves the lists for the items and for the operations
                        var items = operationSource.data("items");
                        var operations = operationSource.data("operations");

                        // retrieves the operation (logical) associated with the current
                        // (graphical) operation value
                        var itemIndex = items.indexOf(operation);
                        var _operation = operations[itemIndex];

                        // creates the filter tuple containing the atrtibutem, the operation
                        // and the value and then adds the filter tuple to the filters list
                        var filter = [attribute, _operation, value];
                        _filters.push(filter);
                    });

            // sets the (query) pending flag in the filter
            filter.data("pending", true);

            // adds the loading class so thath the loading information
            // is presented to the user
            filterMore.addClass("loading");

            // runs the query in the data source, this is a non blocking
            // operation that may take some time to be executed the proper
            // callback will be called at the end of the execution
            dataSource.uxdataquery({
                        filterString : filterInputValue,
                        sort : sort,
                        filters : _filters,
                        startRecord : startRecord,
                        numberRecords : numberRecords
                    }, function(validItems, moreItems) {
                        // removes the loading class from the filter more
                        // button so that the loading information is hidden
                        filterMore.removeClass("loading");

                        // in case the valid items value
                        // is not valid (error occurred)
                        if (!validItems) {
                            // unsets the (query) pending flag in the filter
                            filter.data("pending", false);

                            // returns immediately
                            return;
                        }

                        // in case the reset flag is set
                        if (reset) {
                            // retrieves the current filter elements to remove
                            // them (refresh of the list)
                            var filterElements = jQuery(".filter-element",
                                    filter);
                            filterElements.remove();
                        }

                        // retrieves the cache map to be used to determine if the
                        // various elements should be contructed from scratch or
                        // if an already existing element should be used instead
                        var cache = filter.data("cache");

                        // retrieves the valid items reference
                        var _validItems = jQuery(validItems);

                        // retrieves the valid items length
                        var validItemsLength = validItems.length;

                        // creates the list that will hold the complete set of elements
                        // resulting from the apply of the template
                        var templateItems = [];

                        // iterates over all the valid items to create
                        // proper elements
                        _validItems.each(function(index, element) {
                                    // creates the map with the options for the
                                    // rendering of the template to changed the
                                    // default value to be used
                                    var options = {
                                        apply : true,
                                        nullify : true,
                                        localize : true,
                                        defaultValue : "-"
                                    };

                                    // tries to retrieve the object identifier from the
                                    // current item to be used as identifier of the element
                                    var objectId = element["object_id"]
                                            || element["oid"];

                                    // tries to retrieve the unique identifier from the
                                    // current item to be used as the cache key
                                    var uniqueId = element["unique_id"]
                                            || element["uid"];

                                    // retrieves the cache map from the filter and
                                    // tries to find the cache item for the unique identifier
                                    // validates it so that the data contained in it matches
                                    // the one cached in such case sets the template item as
                                    // the cached item (cache match usage)
                                    var cacheItem = cache[uniqueId];
                                    var cachedData = cacheItem
                                            ? cacheItem.data
                                            : null;
                                    var cacheValid = cachedData
                                            ? jQuery.uxequals(cachedData,
                                                    element)
                                            : false;
                                    if (cacheItem && cacheValid) {
                                        // sets the item contained in the cache item as
                                        // the current cache item (layout item reference)
                                        cacheItem = cacheItem.item;

                                        // sets the template item as the currently cached
                                        // item so that no construction occurs then removes
                                        // the selection classes from it (avoiding possible
                                        // layout problems)
                                        var templateItem = cacheItem;
                                        templateItem.removeClass("selected");
                                        templateItem.removeClass("first");
                                        templateItem.removeClass("last");

                                        // re-runs the apply operation on the cached item so
                                        // that its configuration is re-loaded as defined in
                                        // the specification (correct behaviour)
                                        templateItem.uxapply();
                                    }
                                    // otherwise must re-create the template item by runing
                                    // the template engine again
                                    else {
                                        // applies the template to the template (item)
                                        // retrieving the resulting template item and
                                        // setting it the cache map for the unique id
                                        // only in case the unique id is valid (set)
                                        var templateItem = template.uxtemplate(
                                                element, options);
                                        if (uniqueId) {
                                            cache[uniqueId] = {
                                                item : templateItem,
                                                data : element
                                            }
                                        }
                                    }

                                    // sets the object identifier information in the template
                                    // item (considered the main identifier for it)
                                    templateItem.data("object_id", objectId);

                                    // removes the filter element class from the template item,
                                    // then adds it to the filter contents, then initializes its
                                    // structures (event handling registration)
                                    templateItem.addClass("filter-element");
                                    templateItems.push(templateItem[0]);
                                    _initTemplateItem(filter, templateItem);
                                });

                        // adds the complete set of generated template items to the
                        // contents of the current filter
                        filterContents.append(templateItems);

                        // in case there are no items to be shown
                        if (validItemsLength > 0) {
                            // hides the filter no results panel
                            filterNoResults.hide();
                        }
                        // otherwise there are no item to be shown
                        else {
                            // shows the filter no results panel
                            filterNoResults.show();
                        }

                        // in case there are more items available
                        // to be retrieved
                        if (moreItems) {
                            // shows the filter more item
                            filterMore.show();
                        }
                        // otherwise the are no more items to be shown
                        else {
                            // hides the filter more item
                            filterMore.hide();
                        }

                        // retrieves the current list items
                        var listItems = jQuery(".filter-contents > *",
                                matchedObject);

                        // unregisters from the right click in the list
                        // items (avoids duplicates) and then registers
                        // the handler for the context menu
                        listItems.unbind("contextmenu rightclick",
                                _handleContext);
                        listItems.bind("contextmenu rightclick", _handleContext);

                        // retrieves the complete set of menus from the
                        // list items and then initializes them with the
                        // the current filter
                        var menus = jQuery(".menu", listItems);
                        menus.each(function(index, element) {
                                    // retrieves the element reference
                                    // and initializes it as a menu
                                    var _element = jQuery(element);
                                    _initMenu(_element, filter, true);
                                });

                        // registers for the show event in the various menus
                        // to update the visual in such case
                        menus.bind("show", function() {
                                    // retrieves the reference to the current element
                                    // (menu) in iteration
                                    var _element = jQuery(this);

                                    // retrieves ther complete set of buttons currently present
                                    // in the menu and removes the selected class from them
                                    // (avoiding any possible visual problems)
                                    var buttons = jQuery(
                                            ".button:not(.menu-link)", _element);
                                    buttons.removeClass("selected");
                                });

                        // triggers the update complete event
                        filter.triggerHandler("update_complete");

                        // updates the filter data
                        filter.data("filter_string", filterInputValue);
                        filter.data("start_record", startRecord + numberRecords);
                        filter.data("complete", !moreItems);
                        filter.data("pending", false);
                    });
        };

        var _handleContext = function(event) {
            // retrieves the current element
            var element = jQuery(this);

            // retrieves the reference to the window, document,
            // body and the reference to the current context menu
            var _window = jQuery(window);
            var _document = jQuery(document);
            var _body = jQuery("body")
            var contextMenus = jQuery("> .context-menu", _body);
            var menu = jQuery(".context-menu", element);
            var menuContents = jQuery(".context-menu .menu-contents", element);

            // in case there's no context menu for the
            // current element no need to continue
            if (menu.length == 0) {
                // returns immediately no context menu
                // for the current element
                return;
            }

            // retrieves the current set of visible menus and menu
            // contents to be able to control them
            var _menu = jQuery(".menu.active");
            var _menuContents = jQuery(".menu-contents:visible");

            // removes the active class from the visible menus
            // and hides the menu contents
            _menu.removeClass("active");
            _menuContents.hide();

            // clones the menu so that a new instance
            // is used for the context
            menu = menu.clone();
            menu.uxapply();

            // adds the drop menu class to indicate that this is
            // a menu of type drop (provisory)
            menu.addClass("drop-menu");

            // retrieves ther complete set of buttons currently present
            // in the menu and removes the selected class from them
            // (avoiding any possible visual problems)
            var buttons = jQuery(".button:not(.menu-link)", menu);
            buttons.removeClass("selected");

            // retrieves the menu contents reference for the menu
            // to be used for the positioning
            var menuContents = jQuery(".menu-contents:not(.sub-menu)", menu);

            // removes the currently create context menus
            // to avoid duplicates (garbage collection) then
            // appends the new context menu to the body
            contextMenus.remove();
            _body.append(menu);

            // triggers the selected event on the current element
            // so that it changes the selected value (action event)
            element.triggerHandler("selected");

            // retrieves the correct scroll position coordinates
            // according to the current browser implementation
            var scrollY = window.scrollY
                    ? window.scrollY
                    : document.body.scrollTop;
            var scrollX = window.scrollX
                    ? window.scrollX
                    : document.body.scrollLeft;

            // updates the menu contents attributes to reflect
            // the proper attributes (position)
            menuContents.css("position", "fixed")
            menuContents.css("margin-left", 0 + "px");
            menuContents.css("margin-top", 0 + "px");
            menuContents.css("top", event.pageY - scrollY + "px");
            menuContents.css("left", event.pageX - scrollX + "px");

            // adds the active class to the menu
            menu.addClass("active");

            // shows the menu contents by fading in
            menuContents.fadeIn(150);

            // prevents the default behavior (avoids
            // possible problems)
            event.stopPropagation();
            event.preventDefault();

            // retrieves the filter associated with the currently
            // selected element
            var filter = element.parents(".filter");

            // initializes the menu structure and event handlers so that
            // the menu becoomes able to respond to the user interactions
            _initMenu(menu, filter);
        };

        var _initMenu = function(menu, filter, stay) {
            // retrieves the complete set of contents for the
            // current menu, to be used further ahead
            var menuContents = jQuery("> .menu-contents", menu);

            // retrieves ther complete set of buttons currently present
            // in the menu to register for their appropriate events and
            // remove the default buton behavior
            var buttons = jQuery(".button:not(.menu-link)", menu);

            // retrieves the target buttons and then retrieves also the non
            // target buttons (these button need to be registered for the
            // varios mouse event to control the sub menu behavior)
            var targetButtons = jQuery(".button[data-target]", menu);
            var nonTargetButtons = jQuery(
                    ":not(.sub-menu) .button:not([data-target])", menu);

            // registers for the mouse enter event so that the
            // menu may be shown
            targetButtons.mouseenter(function() {
                        // retrieves the current element and add the hover
                        // class to it
                        var element = jQuery(this);
                        element.addClass("hover");

                        // creates the timeout to handle the proper show of
                        // the sub menu (but only in case the element is still
                        // correctly slected)
                        setTimeout(function() {
                                    // in case the element is not selected anymore
                                    // need to avoid showing the sub menu
                                    if (!element.hasClass("hover")) {
                                        // returns immediately, avoiding
                                        // the show of the sub menu
                                        return;
                                    }

                                    // show the sub menu for the currently selected
                                    // button element and menu
                                    _showSubMenu(element, menu);
                                }, 500);
                    });

            // registers for the mouse leave event in the target buttons
            // to be able to remove the hover class reference
            targetButtons.mouseleave(function() {
                        // retrieves the current element and removes the
                        // hover class reference
                        var element = jQuery(this);
                        element.removeClass("hover");
                    });

            // registers for the mouse enter event in the
            // non target button to be able to hide the sub menus
            nonTargetButtons.mouseenter(function() {
                        // retrieves the reference to the current element
                        // (the hovered button)
                        var element = jQuery(this);

                        // removes the selected class from the target buttons
                        // so that no target button remains selected
                        targetButtons.removeClass("selected");

                        // creates a timeout to handle the proper hide of the
                        // visible sub menus (selected non target elements)
                        setTimeout(function() {
                                    // retrieves the complete set of visible sub menus
                                    // to be hidden in case of validation passing
                                    var subMenu = jQuery(".sub-menu:visible",
                                            menu);

                                    // checks if the current element (button)
                                    // is still in the ohover state in case it's
                                    // not returns immediately, not meat to hide
                                    // the other sub menus, otherwise hides the complete
                                    // set of sub menus
                                    var isHovered = element.is(":hover");
                                    if (!isHovered) {
                                        return;
                                    }
                                    _hideSubMenu(subMenu);
                                }, 300);
                    });

            // iterates over all the buttons to update their actions
            // and remove the current default button behavior
            buttons.each(function(index, element) {
                // retrieves the current element
                var _element = jQuery(element);

                // removes the link attribute from the element
                // to avoid the button default behavior
                _element.data("link", null);

                // retrieves the index of the element so that is
                // possible to retrieve the equivalent button in
                // the other selected elements
                var elementIndex = _element.index();

                // registers for the click event on the element so
                // that it's possible to "raise" the actions
                _element.click(function(event) {
                            // retrieves the current element
                            var element = jQuery(this);

                            // checks if the currently clicked element is
                            // of type sub element (must open sub menu)
                            var isSubElement = element.hasClass("sub-element");

                            // in case the current element is of type sub element
                            // (special case) must open the submenu
                            if (isSubElement) {
                                // shows the sub menu associated with the element
                                // for the current menu and then returns immediately
                                _showSubMenu(element, menu);
                                return;
                            }

                            // retrieves the complete set of selected list items
                            // to apply the global characteristics to them
                            var selectedListItem = jQuery(
                                    ".filter-contents > .selected", filter);

                            // retrieves the menu contents associated with the
                            // current element and then retrieves the identifier
                            // of that menu contents
                            var _menuContents = element.parents(".menu-contents");
                            var menuId = _menuContents.attr("data-menu_id");

                            // removes the active class from the menu
                            // (should disable the layout)
                            menu.removeClass("active");

                            // hides the menu and removes it from the current
                            // context (it's not going to be used anymore) but
                            // only in case the stay flag is not set
                            menuContents.hide();
                            !stay && menu.remove();

                            // iterates over each of the selected list items
                            // to execute the proper "sequential" action
                            selectedListItem.each(function(index, element) {
                                        // retrieves the current element
                                        var __element = jQuery(element);

                                        // retrieves the buttons associated with the equivalent
                                        // button in its context menu
                                        var button = jQuery(
                                                ".context-menu > .menu-contents[data-menu_id="
                                                        + menuId
                                                        + "] > :nth-child("
                                                        + String(elementIndex
                                                                + 1) + ")",
                                                __element);

                                        // checks if the button is of type document
                                        // (open in same window) and then retrieves the
                                        // value of the link attribute
                                        var isDocument = button.attr("data-document");
                                        var link = button.attr("data-link");

                                        // in cas no link is defined, not possible
                                        // to open the link (must return)
                                        if (!link) {
                                            // returns immediately no need to open
                                            // the link
                                            return;
                                        }

                                        // in case the current button refers a link that
                                        // must be opened as a document and this is the first
                                        // element to be parsed opens the link in the current
                                        // document otherwise creates a new window and opend
                                        // the link in it (external opening)
                                        isDocument && index == 0
                                                ? jQuery.uxlocation(link)
                                                : window.open(link, "_blank");
                                    });

                            // tries to retrieve the bulk (to many link)
                            // from the element
                            var linkBulk = _element.attr("data-link_bulk");

                            // in case the bulk link exists a recursive operation
                            // call must be made
                            if (linkBulk) {
                                // initializes the string that will hold the various
                                // string identifier values to be sent for the bulk operation
                                var identifiersList = "";

                                // iterates over each of the selected items to update the
                                // list of items accordingly
                                selectedListItem.each(function(index, element) {
                                            // retrieves the current element reference
                                            var __element = jQuery(element);

                                            // retrieves the object id from the current
                                            // element (this is the element identifier)
                                            var objectId = __element.data("object_id");

                                            // in case the index is greater than zero a comma
                                            // must be appended to the identifiers list
                                            if (index > 0) {
                                                // adds the comma to the identifiers list
                                                identifiersList += ",";
                                            }

                                            // adds the identifier to the identifiers list
                                            identifiersList += objectId
                                        });

                                // updates the current documents location to the bulk
                                // link, so that the bulk operation takes place
                                jQuery.uxlocation(linkBulk + "?object_id="
                                        + identifiersList);
                            }

                            // stops the event propagation and prevents
                            // the default bahavior (avoids propagation problems)
                            event.stopPropagation();
                            event.preventDefault();
                        });

                // registers for the double click event on the button
                // to avoid unwanted propagation
                _element.dblclick(function(event) {
                            // stops the event propagation and prevents
                            // the default bahavior (avoids propagation problems)
                            event.stopPropagation();
                            event.preventDefault();
                        });
            });
        };

        var _incrementSelection = function(matchedObject, options) {
            // retrieves the current selection value and
            // obtains the first value as the reference value
            var selection = matchedObject.data("selection");
            var _selection = selection[0];

            // in case the selection row not "overlfows"
            if (_selection > 0) {
                // decrements the current selection
                matchedObject.data("selection", [_selection - 1]);
                matchedObject.data("pivot", _selection - 1);
            }

            // updates the current selection
            _updateSelection(matchedObject, options);
        };

        var _decrementSelection = function(matchedObject, options) {
            // retrieves the current selection value and
            // obtains the last value as the reference value
            var selection = matchedObject.data("selection");
            var _selection = selection[selection.length - 1];

            // retrieves the "current" list items
            var listItems = jQuery(".filter-contents > *", matchedObject);

            // in case the selection row not "overlfows"
            if (_selection < listItems.length) {
                // increments the current selection
                matchedObject.data("selection", [_selection + 1]);
                matchedObject.data("pivot", _selection + 1);
            } else {
                // updates the matched object (runs the loading
                // of additional values)
                _update(matchedObject, options);
            }

            // updates the current selection
            _updateSelection(matchedObject, options);
        };

        var _upSelection = function(matchedObject, options) {
            // retrieves the current selection value and
            // obtains the first value as the reference value
            var selection = matchedObject.data("selection");
            var _selection = selection[0];

            // in case the selection row is not the first
            // one (goes to the top)
            if (_selection > 1) {
                // resets the current selection to be top
                // selection value
                matchedObject.data("selection", [1]);
                matchedObject.data("pivot", 1);
            }
            // otherwise goes to the "invisible" value
            else {
                // resets the current selection to be base
                // selection value
                matchedObject.data("selection", [0]);
                matchedObject.data("pivot", 0);
            }

            // updates the current selection
            _updateSelection(matchedObject, options);
        };

        var _downSelection = function(matchedObject, options) {
            // retrieves the current selection value and
            // obtains the last value as the reference value
            var selection = matchedObject.data("selection");
            var _selection = selection[selection.length - 1];

            // retrieves the "current" list items
            var listItems = jQuery(".filter-contents > *", matchedObject);

            // in case the selection row is the last
            // need to load more elements
            if (_selection == listItems.length) {
                // updates the matched object (runs the loading
                // of additional values)
                _update(matchedObject, options);
            }
            // in case the selection row is not the base
            // one (goes to the bottom)
            else if (_selection > 0) {
                // resets the current selection to be bottom
                // selection value
                matchedObject.data("selection", [listItems.length]);
                matchedObject.data("pivot", listItems.length);
            }
            // otherwise it's the base selection and the filter
            // must be scrolled to the top
            else {
                // resets the current selection to be top
                // selection value
                matchedObject.data("selection", [1]);
                matchedObject.data("pivot", 1);
            }

            // updates the current selection
            _updateSelection(matchedObject, options);
        };

        var _updateSelection = function(matchedObject, options) {
            // retrieves the current selection value
            var selection = matchedObject.data("selection");

            // retrieves the current list items
            var listItems = jQuery(".filter-contents > *", matchedObject);

            // removes the selected class from the current list
            // items (unselection) also removes the first and
            // last "control" classes
            listItems.removeClass("selected");
            listItems.removeClass("first");
            listItems.removeClass("last");

            // orders the selection according
            // to the typical arithmetic function
            selection.sort(function(first, second) {
                        // returns the diference between the first
                        // adn the second elements
                        return first - second;
                    });

            // iterates over all the items in the selection
            // to correclty update their control classes
            for (var index = 0; index < selection.length; index++) {
                // retrieves the current the previous and the next
                // selections (for processing)
                var _selection = selection[index];
                var _previous_selection = selection[index - 1];
                var _next_selection = selection[index + 1];

                // retrieves the list item to be selected
                var _selectedListItem = jQuery(".filter-contents > :nth-child("
                                + _selection + ")", matchedObject);

                // adds the selected class to the selected list item
                _selectedListItem.addClass("selected");

                // in case the current index is the first or in case the
                // current selection is not preceded by a contiguous value
                if (index == 0 || _previous_selection != _selection - 1) {
                    // adds the first class to the current selected
                    // list item (indicates that it is the first of
                    // a contiguous selection)
                    _selectedListItem.addClass("first");
                }

                // in case the current index if the last or in case the
                // the current selection is not succeeded by a contiguous value
                if (index == selection.length - 1
                        || _next_selection != _selection + 1) {
                    // adds the last class to the current selected
                    // list item (indicates that it is the last of
                    // a contiguous selection)
                    _selectedListItem.addClass("last");
                }
            }

            // retrieves the complete set of selected list items
            // to apply the global characteristics to them
            var selectedListItem = jQuery(".filter-contents > .selected",
                    matchedObject);

            // retrieves the top offset of the page, using
            // the margin element (from the margin top)
            var margin = jQuery(".margin");
            var pageOffset = margin.outerHeight(true);

            // tries to retrieve the dom element, as the first
            // reference to the selected list item
            var _element = selectedListItem.get(0);

            // cheks if the element is visible using
            // the appropriate visibility extension
            var isVisible = _element ? jQuery.uxvisible(selectedListItem,
                    pageOffset) : true;

            // scrolls to the reference in case the element
            // is not visible, this is required so that the
            // end user is able to interact with the element
            !isVisible && selectedListItem.length == 1
                    && selectedListItem.uxscroll({
                                offset : pageOffset,
                                padding : 10
                            });

            // triggers the selected event indicating that the list
            // of selected items has changed
            matchedObject.triggerHandler("selected", [selectedListItem]);
        };

        var _incrementRange = function(matchedObject, options) {
            // sets the matched object as the filter reference
            // for further usage
            var filter = matchedObject;

            // retrieves the pivot value and the current selection
            // for the filter reference
            var pivot = filter.data("pivot");
            var selection = filter.data("selection");

            // checks if the pivot is zero and in case it is consider
            // it to be one (first element)
            pivot = pivot == 0 ? 1 : pivot;

            // retrieves the first and last element from the current
            // selection for reference
            var first = selection[0];
            var last = selection[selection.length - 1];

            // in case the current first element is the pivot
            // need to use the last value as reference
            if (first == pivot) {
                // increments the last value and sets it as
                // the proper value
                var value = last - 1;
            }
            // otherwise uses the first value as reference
            else {
                // decrement the first value and sets it as
                // the proper value
                var value = first - 1;
            }

            // in case the current index value is zero
            // it's considered to be invalid, returns immediately
            if (value == 0) {
                // returns immediately, invalid index
                return;
            }

            // runs the range selection process for the currently
            // selected value and then updates the selection
            _rangeSelection(value, filter, options);
            _updateSelection(filter, options);

            // retrieves the complete set of selected list items
            // to apply the global characteristics to them
            var selectedListItem = jQuery(".filter-contents > .selected",
                    matchedObject);

            // retrieves the top offset of the page, using
            // the margin element (from the margin top)
            var margin = jQuery(".margin");
            var pageOffset = margin.outerHeight(true);

            // in case the current first element is the pivot
            // need to use the last value as reference
            if (first == pivot) {
                // retrieves the last item as the reference one
                var item = jQuery(selectedListItem[selectedListItem.length - 1]);
            }
            // otherwise must use the first one
            else {
                // retrieves the first item as the reference one
                var item = jQuery(selectedListItem[0]);
            }

            // checks if the item is visible and in case it's
            // not scroll the current viewport into the item
            var isVisible = item ? jQuery.uxvisible(item, pageOffset) : true;
            !isVisible && item.uxscroll({
                        offset : pageOffset,
                        padding : 10
                    });
        };

        var _decrementRange = function(matchedObject, options) {
            // sets the matched object as the filter reference
            // for further usage
            var filter = matchedObject;

            // retrieves the pivot value and the current selection
            // for the filter reference
            var pivot = filter.data("pivot");
            var selection = filter.data("selection");

            // checks if the pivot is zero and in case it is consider
            // it to be one (first element)
            pivot = pivot == 0 ? 1 : pivot;

            // retrieves the first and last element from the current
            // selection for reference
            var first = selection[0];
            var last = selection[selection.length - 1];

            // in case the current last element is the pivot
            // need to use the first value as reference
            if (last == pivot) {
                // increments the first value and sets it as
                // the proper value
                var value = first + 1;
            }
            // otherwise uses the last value as reference
            else {
                // increments the last value and sets it as
                // the proper value
                var value = last + 1;
            }

            // retrieves the "current" list items
            var listItems = jQuery(".filter-contents > *", matchedObject);

            // in case the selection row not "overlfows"
            if (value > listItems.length) {
                // updates the matched object (runs the loading
                // of additional values) and returns immediately
                // to avoid further updates
                _update(matchedObject, options);
                return;
            }

            // runs the range selection process for the currently
            // selected value and then updates the selection
            _rangeSelection(value, filter, options);
            _updateSelection(filter, options);

            // retrieves the complete set of selected list items
            // to apply the global characteristics to them
            var selectedListItem = jQuery(".filter-contents > .selected",
                    matchedObject);

            // retrieves the top offset of the page, using
            // the margin element (from the margin top)
            var margin = jQuery(".margin");
            var pageOffset = margin.outerHeight(true);

            // in case the current last element is the pivot
            // need to use the first value as reference
            if (last == pivot) {
                // retrieves the first item as the reference one
                var item = jQuery(selectedListItem[0]);
            }
            // otherwise must use the last one
            else {
                // retrieves the last item as the reference one
                var item = jQuery(selectedListItem[selectedListItem.length - 1]);
            }

            // checks if the item is visible and in case it's
            // not scroll the current viewport into the item
            var isVisible = item ? jQuery.uxvisible(item, pageOffset) : true;
            !isVisible && item.uxscroll({
                        offset : pageOffset,
                        padding : 10
                    });
        };

        var _upRange = function(matchedObject, options) {
            // sets the matched object as the filter reference
            // for further usage
            var filter = matchedObject;

            // retrieves the pivot value and the current selection
            // for the filter reference
            var pivot = filter.data("pivot");
            var selection = filter.data("selection");

            // runs the range selection process for the currently
            // selected value and then updates the selection
            _rangeSelection(1, filter, options);
            _updateSelection(filter, options);

            // retrieves the complete set of selected list items
            // to apply the global characteristics to them
            var selectedListItem = jQuery(".filter-contents > .selected",
                    matchedObject);

            // retrieves the top offset of the page, using
            // the margin element (from the margin top)
            var margin = jQuery(".margin");
            var pageOffset = margin.outerHeight(true);

            // retrieves the first item as the reference one
            var item = jQuery(selectedListItem[0]);

            // checks if the item is visible and in case it's
            // not scroll the current viewport into the item
            var isVisible = item ? jQuery.uxvisible(item, pageOffset) : true;
            !isVisible && item.uxscroll({
                        offset : pageOffset,
                        padding : 10
                    });
        };

        var _downRange = function(matchedObject, options) {
            // sets the matched object as the filter reference
            // for further usage
            var filter = matchedObject;

            // retrieves the pivot value and the current selection
            // for the filter reference, then retrieves the current
            // selection reference element
            var pivot = filter.data("pivot");
            var selection = filter.data("selection");
            var _selection = selection[selection.length - 1];

            // retrieves the "current" list items
            var listItems = jQuery(".filter-contents > *", matchedObject);

            // in case the selection row is the last
            // need to load more elements
            if (_selection == listItems.length) {
                // updates the matched object (runs the loading
                // of additional values) and returns immediately
                // to avoid further updates
                _update(matchedObject, options);
                return;
            }

            // runs the range selection process for the currently
            // selected value and then updates the selection
            _rangeSelection(listItems.length, filter, options);
            _updateSelection(filter, options);

            // retrieves the complete set of selected list items
            // to apply the global characteristics to them
            var selectedListItem = jQuery(".filter-contents > .selected",
                    matchedObject);

            // retrieves the top offset of the page, using
            // the margin element (from the margin top)
            var margin = jQuery(".margin");
            var pageOffset = margin.outerHeight(true);

            // retrieves the last item as the reference one
            var item = jQuery(selectedListItem[selectedListItem.length - 1]);

            // checks if the item is visible and in case it's
            // not scroll the current viewport into the item
            var isVisible = item ? jQuery.uxvisible(item, pageOffset) : true;
            !isVisible && item.uxscroll({
                        offset : pageOffset,
                        padding : 10
                    });
        };

        var _rangeSelection = function(index, matchedObject, options) {
            // sets the matched object as the filter reference
            // for further usage
            var filter = matchedObject;

            // retrieves the current selection and the current
            // pivot item index
            var selection = filter.data("selection");
            var pivot = filter.data("pivot");

            // checks if the pivot is zero and in case it is consider
            // it to be one (first element)
            pivot = pivot == 0 ? 1 : pivot;

            // checks if the current selection is the initial
            // empty selection, in case it's "pops" it from the
            // current selection set (avoids problems in selection)
            var isInitial = selection.length == 1 && selection[0] == 0;
            isInitial && selection.pop();

            // in case the index value is greater than the pivot index
            // it's a range for the down
            if (index >= pivot) {
                // sets the proper initial and final values
                // for the "down" range
                var _initial = pivot;
                var _final = index + 1;
            }
            // otherwise in case the index value is lesser than the pivot
            // index it's a range for the up
            else if (index <= pivot) {
                // sets the proper initial and final values
                // for the "upper" range
                var _initial = index;
                var _final = pivot + 1;
            }

            // creates a new list to hold the new selection values resulting
            // from the range selection
            var _selection = []

            // iterates over the range values to add the selected indexes to
            // the selection list
            for (var index = _initial; index < _final; index++) {
                // adds the index to the list of the selections
                _selection.push(index);
            }

            // updates the selection list in the filter
            filter.data("selection", _selection);
        };

        var _select = function(listItem, matchedObject, options) {
            // sets the filter as the current matched
            // object (back reference)
            var filter = matchedObject;

            // iterates over each of the selected list items
            // to execute their default selection action
            listItem.each(function(index, element) {
                // retrieves the element reference and
                // sets it as the current list item
                var _element = jQuery(element);
                var _listItem = _element;

                // tries to retrieve the value link from the
                // data link attribute in the selected list item
                var valueLink = _listItem.attr("data-link");

                // retrieves the first link element available in the
                // selected list item, then uses it to retrieve
                // its hyperlink reference (in case it's necessary)
                var linkElement = jQuery("a", _listItem);
                var valueLink = valueLink
                        ? valueLink
                        : linkElement.attr("href");

                // in case the value link is set
                if (valueLink) {
                    // retrieves the offset and converts it
                    // into an integer
                    var duration = filter.attr("data-duration");
                    var durationInteger = parseInt(duration);

                    // checks if the duration integer value is valid
                    // conversion successful
                    var durationValid = !isNaN(durationInteger);

                    // in case the duration is valid (the link is
                    // internal and a scroll to shall be used)
                    if (durationValid) {
                        // retrieves the offset and converts it
                        // into an integer
                        var offset = filter.attr("data-offset");
                        var offsetInteger = parseInt(offset);

                        // creates the settings map based on the offset
                        var settings = {
                            offset : isNaN(offsetInteger) ? 0 : offsetInteger
                        }

                        // scrolls to the reference
                        jQuery.uxscrollto(valueLink, durationInteger, settings);
                    }
                    // otherwise the link is external and
                    // no scroll to shall be used
                    else {
                        // in case the current list of item is single
                        // (only one element present) changes the current
                        // document location, otherwise opens a new window
                        // with the value link location (popup)
                        listItem.length <= 1
                                ? jQuery.uxlocation(valueLink)
                                : window.open(valueLink, "_blank");
                    }
                }
            });
        };

        var _showSubMenu = function(element, menu) {
            // retrieves the target value for the element
            // and then uses it as the selector for the sub menu
            var target = element.attr("data-target");
            var subMenu = jQuery(target, menu);

            // retrieves ther complete set of buttons currently present
            // in the sub menu to register for their appropriate events
            var subButtons = jQuery(".button:not(.menu-link)", subMenu);

            // in case the submenu is currently visible
            // must return immediately not going to show it
            var isVisible = subMenu.is(":visible");
            if (isVisible) {
                return;
            }

            // checks if the sub menu element is already being shown
            // in such case returns immediately to avoid problems
            var showing = subMenu.data("showing");
            if (showing) {
                return;
            }

            // sets the "locking" flag indicating that the sub menu
            // is already being shown
            subMenu.data("showing", true);

            // retrieves the top and left offset positions
            // for the current element (these are the offset
            // position of it)
            var offset = element.offset();
            var top = offset["top"];
            var left = offset["left"];

            // retrieves the element with and then uses
            // it to calculate the margin left for the
            // sub menu element
            var elementWidth = element.outerWidth();
            var marginLeft = elementWidth - 3;

            // retrieves the correct scroll position coordinates
            // according to the current browser implementation
            var scrollY = window.scrollY
                    ? window.scrollY
                    : document.body.scrollTop;
            var scrollX = window.scrollX
                    ? window.scrollX
                    : document.body.scrollLeft;

            // sets the proper postion attributes for the
            // submenu so that it's positioned to the right
            // of the action element
            subMenu.css("position", "fixed")
            subMenu.css("margin-left", marginLeft + "px");
            subMenu.css("margin-top", 0 + "px");
            subMenu.css("top", (top - scrollY) + "px");
            subMenu.css("left", (left - scrollX) + "px");

            // adds the selected class to the element (button)
            // so that it's highlighted
            element.addClass("selected");

            // tries to retrieve the currently registered mouse enter
            // event from the sub buttons in case the event does not exists
            // registers a new function for the handling and sets it in
            // the data for the sub buttons
            var mouseenter = subButtons.data("mouseenter");
            mouseenter = mouseenter || subButtons.mouseenter(function() {
                        element.addClass("selected");
                    });
            subButtons.data("mouseenter", mouseenter);

            // shows the sub menu with a fade effect
            subMenu.fadeIn(150, function() {
                        // unsets the flag that controlls the
                        // showing state of the sub menu
                        subMenu.data("showing", false);
                    });
        };

        var _hideSubMenu = function(subMenu) {
            subMenu.hide();
        };

        var _selectFilter = function(filter, value, select) {
            // retrieves the parent filter object
            var _filter = filter.parents(".filter");

            // retrieves the reference to the value field using
            // the filter to do so
            var valueField = jQuery(".value-field", filter);

            // retrieves both the drop field (value selection) and the
            // operation field from the fielter
            var dropField = jQuery(".drop-field:not(.operation-field)", filter);
            var operationField = jQuery(".drop-field.operation-field", filter);

            // retrieves the data sources associated with the drop field
            // and the operation field (to be manipulated)
            var dropSource = jQuery("> .data-source", dropField);
            var operationSource = jQuery("> .data-source", operationField);

            // retrieves the items, types and names sequences associated with
            // the drop (field) data source
            var items = dropSource.data("items");
            var types = dropSource.data("types");
            var names = dropSource.data("names");
            var elements = dropSource.data("elements");

            // retrieves the current index for the value in the items
            // sequence then uses it to retrieve the associated type
            // and the associated indirect name
            var index = items.indexOf(value);
            var type = types[index];
            var name = names[index];
            var element = elements[index];

            // sets the operation field disabled flag as unset by default
            // (operations allowed by default)
            var disabled = false;

            // sets the (data name) in the filter line to be latter used
            // to perform the query
            filter.data("name", name);

            // removes the currently selected value field (a new one will
            // be set in)
            valueField.remove();

            // switched over the type of the value that was selected
            // (different type will have different operation and different
            // value fields)
            switch (type) {
                case "string" :
                    // creates the list of items and then creates the list
                    // of equivalent operations (index based association)
                    var _items = ["contains", "matches", "begins with",
                            "ends with"];
                    var _operations = ["like", "equals", "rlike", "llike"];

                    // creates the value field as a text field, inserts it
                    // after the operation field and initializes it
                    var valueField = jQuery("<input type=\"text\" class=\"text-field small value-field\" />");
                    valueField.insertAfter(operationField);
                    valueField.uxtextfield();

                    // breaks the switch
                    break;

                case "number" :
                    // creates the list of items and then creates the list
                    // of equivalent operations (index based association)
                    var _items = ["equals", "greater than", "less than"];
                    var _operations = ["equals", "greater", "lesser"];

                    // creates the value field as a text field, inserts it
                    // after the operation field and initializes it
                    var valueField = jQuery("<input type=\"text\" class=\"text-field small value-field\" />");
                    valueField.insertAfter(operationField);
                    valueField.uxtextfield();

                    // breaks the switch
                    break;

                case "date" :
                    // creates the list of items and then creates the list
                    // of equivalent operations (index based association)
                    var _items = ["in", "after", "before"];
                    var _operations = ["in_day", "greater", "lesser"];

                    // creates the value field as a text field (calendar field),
                    // inserts it after the operation field and initializes it
                    var valueField = jQuery("<input type=\"text\" class=\"text-field small value-field\" data-type=\"date\" data-original_value=\"yyyy/mm/dd\" />");
                    valueField.insertAfter(operationField);
                    valueField.uxtextfield();

                    // breaks the switch
                    break;

                case "reference" :
                    // creates the list of items and then creates the list
                    // of equivalent operations (index based association)
                    var _items = ["search"];
                    var _operations = ["equals"];

                    // sets the disabled flag so that no operation changing
                    // action is possible
                    disabled = true

                    // retrieves the url and the type (data source) from
                    // the associated element
                    var url = element.attr("data-surl");
                    var _type = element.attr("data-stype");

                    // retrieves the display and the value attributes from the
                    // element to the propagated to the value field
                    var displayAttribute = element.attr("data-sdisplay_attribute")
                            || "name";
                    var valueAttribute = element.attr("data-svalue_attribute")
                            || "value";

                    // creates the value field as a drop field (reference field),
                    // inserts it after the operation field and initializes it
                    var valueField = jQuery("<div class=\"drop-field small value-field\">"
                            + "<input type=\"hidden\" class=\"hidden-field\" />"
                            + "<ul class=\"data-source\"></ul>" + "</div>");

                    // retrieves the data source associated with the value
                    // field an then updates the url and the type of the
                    // data source to point to the "reference" elements
                    var valueSource = jQuery("> .data-source", valueField);
                    valueSource.attr("data-url", url);
                    valueSource.attr("data-type", _type);
                    valueSource.uxdatasource();

                    // updates the value field attributes in the value field and then
                    // inserts it after the operation field and initializes it as a
                    // drop field component
                    valueField.attr("data-display_attribute", displayAttribute);
                    valueField.attr("data-value_attribute", valueAttribute);
                    valueField.insertAfter(operationField);
                    valueField.uxdropfield();

                    // breaks the switch
                    break;

                default :
                    // creates the list of items and then creates the list
                    // of equivalent operations (index based association)
                    var _items = ["undefined"];
                    var _operations = [""];

                    // breaks the switch
                    break;
            }

            // localizes the various items to the currently defined
            // locale to adapt the experience to the user
            _items = jQuery.uxlocale(_items);

            // updates the various items (operation values) in the
            // operation (data) source
            operationSource.data("items", _items);
            operationSource.data("operations", _operations);

            // unsets the update flag from the operation field (to
            // force a reload of items in the operation field) and
            // then "runs" a reset operation to cleanup the operation
            // field (reset to original state)
            operationField.data("updated", null);
            operationField.uxdropfield("reset");

            // in case the select flag is set a value must be set in
            // the (field) drop field set the value as that field
            select && dropField.uxdropfield("set", {
                        value : value
                    });

            // updates the operation field to be set to the
            // first item in the items sequence
            operationField.uxdropfield("set", {
                        value : _items[0]
                    });

            // in case the disabled flag is set disables the operation
            // field otherwise enables it
            disabled ? operationField.uxdisable() : operationField.uxenable();

            // registers for the value select event in the
            // operation field to update the filter results
            operationField.bind("value_select",
                    function(event, value, valueLogic, item) {
                        // updates the current filter to reflect the
                        // changes in the operation field
                        _update(_filter, options, true);
                    });

            // registers for the value change event in the
            // value field to update the filter results
            valueField.bind("value_change",
                    function(event, value, valueLogic, item) {
                        // updates the current filter to reflect the
                        // changes in the value field
                        _update(_filter, options, true);
                    });

            // registers for the value select event in the
            // value field to update the filter results
            valueField.bind("value_select",
                    function(event, value, valueLogic, item) {
                        // updates the current filter to reflect the
                        // changes in the value field
                        _update(_filter, options, true);
                    });

            // registers for the value unselect event in the
            // value field to update the filter results
            valueField.bind("value_unselect", function(event) {
                        // updates the current filter to reflect the
                        // changes in the value field
                        _update(_filter, options, true);
                    });
        };

        var _addFilter = function(matchedObject, target) {
            // retrieves the data source for the current filter object
            // and retrieves the associated filtering objects
            var dataSource = jQuery("> .data-source", matchedObject);
            var dataFiltering = jQuery(".filtering > li", dataSource);

            // retrieves the advanced filters section of the filter, this
            // area is going to be used to add the "new" filter
            var advancedFilters = jQuery(".filter-advanced-filters",
                    matchedObject);

            // creates the new filter element and the associated drop field
            // operation field (drop field) and the text field
            var filter = jQuery("<div class=\"filter-advanced-filter\"></div>");
            var dropField = jQuery("<div class=\"drop-field drop-field-select small\">"
                    + "<ul class=\"data-source\" data-type=\"local\"></ul>"
                    + "</div>");
            var operationField = jQuery("<div class=\"drop-field drop-field-select small operation-field\">"
                    + "<ul class=\"data-source\" data-type=\"local\"></ul>"
                    + "</div>");

            // creates the remove and add buttons for the filter line
            // and creates the clear element to clear eht float layout strucure
            // (in case it's necessary)
            var remove = jQuery("<div class=\"filter-input-remove\"></div>");
            var add = jQuery("<div class=\"filter-input-add\"></div>");
            var clear = jQuery("<div class=\"filter-clear\"></div>");

            // retrieves the data source element associated with the drop field
            // to be used to select that value of filtering
            var dropSource = jQuery("> .data-source", dropField);

            // creates the initial list to hold the items, types and names associated
            // with them, the index should be associative between them
            var items = []
            var types = []
            var names = []
            var elements = []

            // iterates over each of the data filtering elements to
            // be able to "parse" the items and insert them into the
            // the items and types lists
            dataFiltering.each(function(index, element) {
                        // retrives the current element in iteration
                        var _element = jQuery(this);

                        // retrieves the html value of the element and
                        // retrieves the data type attribute of it to
                        // be used both as the item and the type
                        var dataHtml = _element.html();
                        var dataType = _element.attr("data-type");
                        var dataName = _element.attr("data-name");

                        // adds the data html (item) and the data type
                        // to the corresponding lists
                        items.push(dataHtml);
                        types.push(dataType);
                        names.push(dataName);
                        elements.push(_element);
                    });

            // updates the items, types and names lists in the drop
            // field data source data references
            dropSource.data("items", items);
            dropSource.data("types", types);
            dropSource.data("names", names);
            dropSource.data("elements", elements);

            // registers for the value selection event in the drop field
            // so that the other components are changed according to the
            // value to be used for filtering (data type change)
            dropField.bind("value_select",
                    function(event, value, valueLogic, item) {
                        _selectFilter(filter, value);
                        _update(matchedObject, options, true);
                    });

            // registers for the click event in the remove button to
            // remove the filter line from the list of filters
            remove.click(function() {
                        // retrieves the current button element and uses it
                        // to retrieve the parent filter and remove it
                        var element = jQuery(this);
                        var _filter = element.parents(".filter-advanced-filter");
                        _filter.remove();
                        _update(matchedObject, options, true);
                    });

            // regiters for the click event in the add button to
            // add a new filter line next to the current filter
            add.click(function() {
                        // retrieves the current button element and uses it
                        // to retrieve the parent filter and add a new filter
                        // in the next position
                        var element = jQuery(this);
                        var _filter = element.parents(".filter-advanced-filter");
                        _addFilter(matchedObject, _filter);
                        _update(matchedObject, options, true);
                    });

            // initializes the drop field components both in the
            // drop field and n the operation field
            dropField.uxdropfield("default", {
                        numberOptions : 10,
                        filterOptions : true
                    });
            operationField.uxdropfield("default", {
                        numberOptions : 10,
                        filterOptions : true
                    });

            // adds the various "partial" components to the filter
            // (line) component, there should be a visual impact
            filter.append(dropField);
            filter.append(operationField);
            filter.append(remove);
            filter.append(add);
            filter.append(clear);

            // check if the target element is defined, in such case
            // the filter is inserted after the target, otherwise the
            // filter (line) is prepended to the advanced filters
            target
                    ? filter.insertAfter(target)
                    : advancedFilters.prepend(filter);

            // selects the initial element of the "newly" created filter
            // this is the first value to be viewed by the end user
            _selectFilter(filter, items[0], true);
        };

        var _disableFiltering = function(matchedObject, options) {
            // retrieves the filter add element (in the advanced panel)
            // and disables it to avoid insertion of filters
            var filterAdd = jQuery(".filter-advanced > .filter-input-add",
                    matchedObject);
            filterAdd.hide();
        };

        var _initTemplateItem = function(filter, templateItem) {
            // retrieves the complete set of links from the
            // the current item in order to avoid the click
            // event propagation on each of them, as it would
            // cause duplicated behaviour
            var links = jQuery(".link", templateItem);

            // registers the template item for the click event
            // to select the template item in case a click happens
            templateItem.click(function(event) {
                // retrieves the template item index
                var templateItemIndex = templateItem.index();

                // in case the control key is set must add new
                // selection to the selection set
                if (event.ctrlKey) {
                    // retrieves the current selection for reference
                    var selection = filter.data("selection");

                    // checks if the current selection is the initial
                    // empty selection, in case it's "pops" it from the
                    // current selection set (avoids problems in selection)
                    var isInitial = selection.length == 1 && selection[0] == 0;
                    isInitial && selection.pop();

                    // in case the current selection is empty it's time to update
                    // the pivot value (it's the first element of the selection)
                    selection.length == 0
                            && filter.data("pivot", templateItemIndex + 1);

                    // retrieves the index of the element in the selection
                    // index, this is going to be used to check if the element
                    // is present in the selection set
                    var elementIndex = selection.indexOf(templateItemIndex + 1);

                    // in case the element index is invalid (it's not present
                    // in the selection set) must be added to set (selection)
                    if (elementIndex == -1) {
                        // adds the index to the selection set (selection)
                        selection.push(templateItemIndex + 1);
                    }
                    // otherwise the element is already present in the set
                    // and must be removed from it (de-selection)
                    else {
                        // removes the index from the selection set (selection)
                        selection.splice(elementIndex, 1);
                    }
                }
                // otherwise in case the shift key is pressed a range selection
                // must be processed
                else if (event.shiftKey) {
                    // retrieves the current index for the selection to check
                    // it agains the pivot index value
                    var index = templateItemIndex + 1;

                    // actions a range selection over the current pivot
                    // value and the currently defined index
                    _rangeSelection(index, filter, options);
                } else {
                    // sets the current selection to the current
                    // template item index and updates the pivot
                    // value accordingly
                    filter.data("selection", [templateItemIndex + 1]);
                    filter.data("pivot", templateItemIndex + 1);
                }

                // updates the current selection
                _updateSelection(filter, options);
            });

            // binds the template item to the selected event
            templateItem.bind("selected", function() {
                        // retrieves the template item index
                        var templateItemIndex = templateItem.index();

                        // retrieves the current selection and the index of
                        // the selected template index from the filter
                        // to be able check if the element is currently selected
                        var selection = filter.data("selection");
                        var elementIndex = selection.indexOf(templateItemIndex
                                + 1);

                        // in case the element is currently selected
                        // nothing is to be done
                        if (elementIndex != -1) {
                            // returns immediately, avoids selection
                            return;
                        }

                        // resets the current selection to be the
                        // currently selected element
                        filter.data("selection", [templateItemIndex + 1]);
                        filter.data("pivot", templateItemIndex + 1);

                        // updates the current selection
                        _updateSelection(filter, options);
                    });

            // binds the template item to the double click event
            // so that the item becomes select on such operation
            templateItem.dblclick(function() {
                        // updates the current selection, runs the
                        // appropriate (default) actions
                        _select(templateItem, filter, options);
                    });

            // registers for the click event on the links in order
            // to avoid the propagation of the event to the
            // upper layers (would trigger focus on item)
            links.click(function(event) {
                        event.stopPropagation();
                    });
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
