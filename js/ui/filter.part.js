if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

/**
 * jQuery filter plugin, this jQuery plugin provides the base infra-structure
 * for the creation of a filter component.
 *
 * @name uxf-filter.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2024 Hive Solutions Lda.
 * @license Apache License, Version 2.0 - http://www.apache.org/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxfilter = function(options) {
        // the array of views of the filter, each of them is associated
        // with a class of the filter (eg: list-list for the list view)
        var VIEWS = ["list", "table", "gallery"];

        // the array of names of the URL parameters that hold the
        // state of the filter (search, filters, sort and view)
        var STATE_PARAMETERS = ["filter_string", "filters[]", "filters", "sort", "view"];

        // the map of regular expressions that validate the values of
        // the filter lines restored from the state, according to the
        // type of the field (no validation for the remaining types)
        var VALUE_REGEX = {
            number: /^-?\d+$/,
            float: /^-?\d+(\.\d+)?$/,
            date: /^-?\d+$/
        };

        // the default values for the filter
        var defaults = {
            numberRecords: 9
        };

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
            // retrieves the base options
            var numberRecords = options.numberRecords;

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

                // tries to retrieve the (default and initial) sort attribute for
                // the filter and in case it exits sets it in the filter state
                var sort = _element.attr("data-sort");
                sort && _element.data("sort", sort.split(":"));

                // retrieves the number of records attribute and then tries to
                // parse it as an integer value in case it fails falls back to
                // the original value otherwise used the newly processed one
                var numberRecordsS = _element.attr("data-number_records");
                var numberRecordsI = parseInt(numberRecordsS);
                numberRecordsI = isNaN(numberRecordsI) ? numberRecords : numberRecordsI;

                // retrieves the filter contents and
                // the filter more (if present)
                var filterContents = jQuery("> .filter-contents", _element);
                var filterMore = jQuery("> .filter-more", _element);

                // retrieves the text field (element) associated with the
                // current filter for the main filtering
                var textField = jQuery("> .text-field", _element);

                // retrieves the value of the no state attribute and determines if
                // the state of the filter (search, filters, sort and view) is bound
                // to the URL of the page, only the filters with the advanced panel
                // (that requires the text field) are, in such case reads the
                // (initial) state from the URL
                var noState = _element.attr("data-no_state");
                var hasInput = textField.length > 0 || !noInput;
                var stateful = Boolean(advanced && hasInput && !noState);
                var state = stateful ? _readState() : {};
                _element.data("stateful", stateful);

                // in case there is no text field defined for the
                // current element one must be created, only in case
                // the no input flag is not set
                if (textField.length === 0 && !noInput) {
                    // retrieves the various attributes from the element
                    // to be propagated to the text field, the search value
                    // of the state (if any) overrides the value attribute
                    var name = _element.attr("name");
                    var value = state.filterString || _element.attr("value");
                    var originalValue = _element.attr("data-original_value");
                    var error = _element.attr("data-error");

                    // creates the text field element and sets the various
                    // attributes in it
                    textField = jQuery('<input type="text" class="text-field filter-input" />');
                    textField.val(value);
                    textField.attr("name", name);
                    textField.attr("data-original_value", originalValue);
                    textField.attr("data-error", error);

                    // preppends the text field to the element and runs
                    // the text field initializer
                    _element.prepend(textField);
                    textField.uxtextfield();
                }
                // otherwise the text field already exists and the search
                // value of the state (if any) must be set in it
                else if (state.filterString) {
                    textField.uxtextfield("value", {
                        value: state.filterString
                    });
                }

                // in case the text field is still not found the extra no input
                // class is added to the currently selected filter element
                textField.length === 0 && _element.addClass("no-input");

                // creates the element representing the buttons for the filter
                // fild (the more oprtions and the view changer) and adds it
                // to the filter in case the advanced flag is set
                var filterButtons = jQuery(
                    '<div class="filter-input-buttons">' +
                        '<div class="button filter-input-button filter-input-toggle-advanced filter-input-more"></div>' +
                        '<div class="button filter-input-button filter-input-toggle-views"></div>' +
                        '<div class="clear"></div>' +
                        "</div>"
                );
                advanced && filterButtons.insertAfter(textField);

                // creates the advanced part of the filter (more options) and adds
                // it to the filter in case the advanced flag is set
                var filterAdvanced = jQuery(
                    '<div class="filter-advanced">' +
                        '<div class="filter-input-add filter-input-first"></div>' +
                        '<div class="filter-sort">' +
                        '<div class="filter-clear"></div>' +
                        "</div>" +
                        '<div class="filter-advanced-filters"></div>' +
                        '<div class="filter-advanced-buttons">' +
                        '<div class="button small button-grey filter-advanced-select">Select All</div>' +
                        '<div class="button small button-grey disabled filter-advanced-save">Save</div>' +
                        '<div class="filter-clear"></div>' +
                        "</div>" +
                        "</div>"
                );
                advanced && filterAdvanced.insertAfter(filterButtons);

                // stores the (default) view of the filter, the one defined by
                // its classes, and then selects the view of the state (if any)
                // so that the classes of the filter reflect the requested view
                _element.data("default_view", _getView(_element));
                state.view && _selectView(_element, state.view);

                // checks for the presence of the proper list class from
                // the element
                var isList = _element.hasClass("list-list");
                var isTable = _element.hasClass("table-list");
                var isGallery = _element.hasClass("gallery-list");

                // retrieves the element button that was just created to
                // add the appropriate class
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

                    // retrieves the HTML (text) value of the current element
                    // in iteration and uses it to create the filter sort option
                    // element and then adds it to the filter sort (from clear)
                    var valueHtml = _element.html();
                    var valueName = _element.attr("data-name");
                    var valueOrder = _element.attr("data-order") || "descending";
                    var filterOption = jQuery(
                        '<div class="filter-sort-option">' + valueHtml + "</div>"
                    );
                    filterOption.attr("data-name", valueName);
                    filterOption.attr("data-order", valueOrder);
                    filterOption.insertBefore(filterClear);
                });

                // adds the default sort option to the filter, this value exists for
                // every search and indicates that no sort will occur (default is used),
                // note that the name is set so that it's used even if the contents
                // of the option are changed (eg: translated by the browser)
                filterSort.prepend(
                    '<div class="filter-sort-option selected equals" data-name="default" data-order="equals">default</div>'
                );

                // selects the sort option of the (default) sort attribute so
                // that the sort control reflects it and stores the name of the
                // resulting option as the default sort of the filter, only then
                // selects the sort option of the state (if any)
                sort && _selectSort(_element, sort.split(":"));
                _element.data("default_sort", _getSort(_element));
                var sortRestored = Boolean(state.sort && _selectSort(_element, state.sort));

                // checks if the filtering is enabled and valid for the
                // current context of execution
                var hasFiltering = Boolean(filterFiltering.length > 0);

                // in case the advanced mode is active adds the filter lines of
                // the state to the filters area, falling back to the initial
                // filter line in case there are none, but only in case there
                // are valid filters and so the filtering is enabled
                var filtersRestored =
                    stateful && hasFiltering ? _restoreFilters(_element, state.filters) : 0;
                advanced && hasFiltering && filtersRestored === 0 && _addFilter(_element);

                // in case the state of the filter contains filter lines or a
                // sort option the advanced panel is shown, as these are only
                // visible in it, changing the state of the toggle button, note
                // that the display is set explicitly as the style that hides
                // the panel may only be applied after the start of the filter
                if (filtersRestored > 0 || sortRestored) {
                    var toggleAdvanced = jQuery(".filter-input-toggle-advanced", _element);
                    toggleAdvanced.removeClass("filter-input-more");
                    toggleAdvanced.addClass("filter-input-less");
                    filterAdvanced.css("display", "block");
                }

                // in case there is currently no valid filtering in the data
                // source must disabled the filtering part in the advanced area
                !hasFiltering && _disableFiltering();

                // retrieves the text value from the filter more
                // and then encapsulates it around the text divisor
                // then adds it in conjunction to the spinner to the
                // filter more component, as the new filter more contents
                var filterMoreText = filterMore.html();
                filterMore.html(
                    '<div class="text">' + filterMoreText + "</div>" + '<div class="spinner"></div>'
                );

                // retrieves the filter more length
                var filterMoreLength = filterMore.length;

                // adds the "extra" HTML to the matched object,
                // in case no filter contents is found
                if (filterContents.length === 0) {
                    // creates the filter contents element and adds it to the
                    // filter according to the filter more status
                    filterContents = jQuery('<div class="filter-contents"></div>');
                    filterClear = jQuery('<div class="filter-clear"></div>');
                    filterMoreLength > 0
                        ? filterContents.insertBefore(filterMore) &&
                          filterClear.insertBefore(filterMore)
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

                // marks the state of the filter as ready, from this moment
                // on the changes in the filter are reflected in the URL
                _element.data("state_ready", true);
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
            var toggleAdvanced = jQuery(".filter-input-toggle-advanced", matchedObject);
            var toggleViews = jQuery(".filter-input-toggle-views", matchedObject);

            // retrieves the filter add button to be used to add
            // a new line of filtering to the filter advanced panel
            var filterAdd = jQuery(".filter-advanced > .filter-input-add", matchedObject);

            // retrieves the filter select (all) button used
            // to select the complete set of items in the filter
            var filterSelect = jQuery(".filter-advanced-select", matchedObject);

            // checks if the filter click event is already
            // registered in the body and set the variable as
            // true to avoid further registrations
            var isRegistered = _body.data("filter_click");
            matchedObject.length > 0 && _body.data("filter_click", true);

            // starts a series of variables that would store the multiple
            // event handlers to be used in a global context
            var onKeyDown = null;
            var onClick = null;
            var onScroll = null;

            // registers for the update event so that the data is reloaded
            // once this event is raises, this is expected to be done using
            // the trigger handler method so that no buble occurs
            matchedObject.bind("update", function(event, filterValue) {
                // retrieves the current element (filter) and triggers an
                // update operation that is considered to be forced
                var element = jQuery(this);
                _update(element, options, true, filterValue);
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

                // retrieves the cache map to be used to determine if the
                // various elements should be constructed from scratch or
                // if an already existing element should be used instead
                var cache = filter.data("cache") || {};

                // creates the map with the options for the
                // rendering of the template to changed the
                // default value to be used
                var options = {
                    apply: true,
                    nullify: true,
                    localize: true,
                    defaultValue: "-"
                };

                // tries to retrieve the object identifier from the
                // current item to be used as identifier of the element
                var objectId = element.object_id || element.oid;

                // tries to retrieve the unique identifier from the
                // current item to be used as the cache key
                var uniqueId = element.unique_id || element.uid;

                // applies the template to the template (item)
                // retrieving the resulting template item and
                // setting it the cache map for the unique id
                // only in case the unique id is valid (set)
                var templateItem = template.uxtemplate(element, options);
                if (uniqueId) {
                    cache[uniqueId] = {
                        item: templateItem,
                        data: element
                    };
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
                var filterButtons = jQuery(".filter-input-buttons", filter);
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
                var filterButtons = jQuery(".filter-input-buttons", filter);
                filterButtons.removeClass("lower");
            });

            // registers for the key down event in the text field
            textField.keydown(function(event) {
                // retrieves the event key code
                var eventKeyCode = event.keyCode ? event.keyCode : event.which;

                // switches over the event key code
                switch (eventKeyCode) {
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

                // retrieves the filter
                var filter = element.parents(".filter");

                // retrieves the event key code
                var eventKeyCode = event.keyCode ? event.keyCode : event.which;

                // switches over the event key code
                switch (eventKeyCode) {
                    // in case it's the page up key
                    case 33:
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
                    case 34:
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
                    case 38:
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
                    case 40:
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
                var selectedOption = jQuery(".filter-sort-option.selected", filter);
                var isSame = element[0] === selectedOption[0];

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
                    hasTableView ? filter.addClass("table-list") : filter.addClass("gallery-list");
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
                    hasGalleryView ? filter.addClass("gallery-list") : filter.addClass("list-list");
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
                    hasListView ? filter.addClass("list-list") : filter.addClass("table-list");
                }

                // reflects the new view of the filter in the URL, as
                // the view is part of the state of the filter
                _writeState(filter);
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
                var selection = [];

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
                var filterInputValue = element.attr("data-value");

                // in case no string value changes occurred
                if (filterString === filterInputValue) {
                    // returns immediately
                    return;
                }

                // updates the filter state
                _update(filter, options);
            });

            // registers for the paste event on the filter input
            // so that if there's a "pasted" value the
            filterInput.bind("paste", function() {
                // retrieves the reference to the target element
                // of the paster operation and uses it to retrieve
                // the "parent" filter element to be updated
                var element = jQuery(this);
                var filter = element.parents(".filter");

                // creates a timeout so that the update operation
                // only occurs in the next execution cycle after
                // the text field value has been proper updated
                setTimeout(function() {
                    // runs the update operation in the filter so that
                    // new values are retrieved if required
                    _update(filter, options);
                });
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
            matchedObject.length > 0 &&
                _document.keydown(
                    (onKeyDown = function(event) {
                        // sets the filter as the matched object
                        var filter = matchedObject;

                        // retrieves the key value
                        var keyValue = event.keyCode
                            ? event.keyCode
                            : event.charCode
                            ? event.charCode
                            : event.which;

                        // switches over the key value
                        switch (keyValue) {
                            // in case it's the enter key
                            case 13:
                                // retrieves the selected list item
                                var listItemSelected = jQuery(
                                    ".filter-contents > .selected",
                                    filter
                                );

                                // updates the current selection, runs the
                                // appropriate (default) actions
                                _select(listItemSelected, filter, options);

                                // breaks the switch
                                break;

                            // in case it's the j key
                            case 74:
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
                            case 75:
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
                            default:
                                // breaks the switch
                                break;
                        }
                    })
                );
            matchedObject.bind("destroyed", function() {
                _document.unbind("keydown", onKeyDown);
            });

            // registers for the click event in order
            // to avoid problems with deselection
            matchedObject.length > 0 &&
                matchedObject.click(function(event) {
                    // sets the avoid next flag to avoid deselection
                    matchedObject.data("avoid_next", true);
                });

            // registers for the click event in the body element
            // to deselect the element only in case no previous
            // registration was made (avoids duplicates)
            matchedObject.length > 0 &&
                !isRegistered &&
                _body.click(
                    (onClick = function(event) {
                        // retrieves the value of the avoid next flag and
                        // then unsets the avoid next flag
                        var avoidNext = matchedObject.data("avoid_next");
                        matchedObject.data("avoid_next", false);

                        // in case the avoid next flag is set
                        // returns the control flow immediately
                        if (avoidNext) {
                            return;
                        }

                        // resets both the selection and the pivot values
                        matchedObject.data("selection", [0]);
                        matchedObject.data("pivot", 0);

                        // updates the current selection
                        _updateSelection(matchedObject, options);
                    })
                );
            matchedObject.length > 0 &&
                !isRegistered &&
                matchedObject.bind("destroyed", function() {
                    _body.unbind("click", onClick);
                });

            // iterates over the complete set of objects to run the context
            // enabled registration of event handlers
            matchedObject.each(function() {
                // retrieves the reference to the current element in iteration
                // to be used for proper instance registration
                var element = jQuery(this);

                // tries to retrieve the value for the infinite loading
                // support in the matched object (by default it's disabled)
                // in case the value is not enabled returns immediately, as
                // there's nothing to be done for it
                var infinite = element.attr("data-infinite") || false;
                if (!infinite) {
                    return;
                }

                // registers for the scroll event in the window in case
                // the infinite scroll support is enabled
                _window.scroll(
                    (onScroll = function() {
                        // sets the filter as the matched object, this
                        // considered to be a global singleton handler
                        var filter = element;

                        // retrieves the top offset of the page, using
                        // the margin element (from the margin top)
                        var margin = jQuery(".margin");
                        var pageOffset = margin.outerHeight(true);

                        // retrieves the filter more element height as the
                        // delta value for the visibility testing this way
                        // the visibility test is done against the top
                        var delta = filterMore.outerHeight() * -1;

                        // checks if the element is currently visible, so that
                        // proper decisions may be taken
                        var isVisible = filterMore.length
                            ? jQuery.uxvisible(filterMore, pageOffset, delta)
                            : false;
                        var isInvalid = filterMore.hasClass("invalid");
                        isVisible &= !isInvalid;

                        // updates the filter state, so that more information
                        // is going to be loaded from data source
                        isVisible && _update(filter, options);
                    })
                );

                // stores the on scroll event handler in the current context
                // so that it may be used altter on for unregistration
                element.data("on_scroll", onScroll);

                // registers for the destroyed event on the element and
                // for that runs the unbind operation on the scroll
                element.bind("destroyed", function() {
                    var onScroll = element.data("on_scroll");
                    element.removeData("on_scroll");
                    _window.unbind("scroll", onScroll);
                });
            });
        };

        var _update = function(matchedObject, options, force, filterValue) {
            // retrieves the (parent) filter and the various inner
            // elements that are going to be used in the update
            var filter = matchedObject;
            var filterInput = jQuery(".filter-input", filter);
            var filterContents = jQuery(".filter-contents", filter);
            var filterNoResults = jQuery(".filter-no-results", filter);
            var filterMore = jQuery(".filter-more", filter);
            var dataSource = jQuery("> .data-source", filter);
            var template = jQuery(".template", filter);

            // retrieves the amount of times in between multiple requests
            // for the loading (and reloading) of values triggered by the
            // load more operation, notice that this invalid value is only
            // going to be respected by the infinite loading mode
            var sickTime = parseInt(filter.attr("data-sick") || "100");

            // retrieves the filter options, to be used to evaluate
            // the current state of the filter element
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

            // determines if the provided filter value (parameter) is defined
            // (different from undefined) if that's the case updates the filter
            // value data state for the filter
            var setValue = filterValue !== null && filterValue !== undefined;
            setValue && filter.data("filter_value", filterValue || "");

            // retrieves the filter input value, defaulting to empty
            // string in case no valid value is retrieved, notice that
            // the provided filter value is used as the latest fallback
            // for the filter value (as expected)
            var filterInputValue =
                filterInput.attr("data-value") || filter.data("filter_value") || "";

            // determines if there are no valid contents currently set in the
            // filter to be able to change the classes of it accordingly
            var noContents = filterContents.children().length === 0;

            // sets the initial value for the reset flag
            var reset = false;

            // in case the filter lines of the state are being restored
            // returns immediately, the update operation is going to be
            // performed only once after all of them are restored
            if (filter.data("restoring")) {
                return;
            }

            // verifies if at least one data source is available for the
            // update operation and if that's not the case returns immediately
            // as it's not possible to run the update operation without
            // any valid/enabled data source element
            if (dataSource.length === 0) {
                return;
            }

            // in case the value in the filter input
            // has changed (reset required)
            if (filterString !== filterInputValue || force) {
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
                    // returns immediately (can not retrieve
                    // any more data for now)
                    return;
                }
            }

            // retrieves the sorting list (tuple) of the selected sort option
            // to be used in the query, falling back to the (default) sorting
            // information in case there's no sort option selected
            var sort = _getSort(filter) || _sort;

            // creates the list that is going to hold the filter tuples of
            // the (graphical) filter lines, the ones that are part of the
            // state of the filter (the base filters are not part of it)
            var _state = [];

            // retrieves the complete set of (graphical) filter lines to be
            // parser in search for the valid filters
            var filters = jQuery(".filter-advanced-filter", filter);

            // iterates over all the filters (lines) in order to create the
            // various filter tuples and then add them to the base filters
            // list that will be used for the query in the data source
            filters.each(function() {
                // starts some of the values that are going to be re-used
                // over the function execution
                var value = null;

                // retrieves the current element in iteration
                var element = jQuery(this);

                // retrieves the various components of the filter line
                // (drop field, operation field and value field)
                var dropField = jQuery("> .drop-field:not(.operation-field)", element);
                var operationField = jQuery("> .operation-field", element);
                var valueField = jQuery("> .value-field", element);

                // retrieves the data source of the operation field to be
                // used for the retrieval of the items and operations lists
                var operationSource = jQuery("> .data-source", operationField);

                // checks if the current value field is of type drop field
                // and retrieves the value accordingly
                var isDropField = valueField.hasClass("drop-field");
                if (isDropField) {
                    // retrieves the hidden field associated with the value
                    // field and uses its value as the value
                    var hiddenField = jQuery(".hidden-field", valueField);
                    value = hiddenField.val();
                } else {
                    // retrieves the value of the value field using the text
                    // field based approach
                    value = valueField.uxtextfield("value");
                }

                // in case no value is present this filter is ignored
                // not possible to filter value
                if (!value) {
                    return;
                }

                // retrieves the attribute for the filter line and the currently
                // selected operation value
                var attribute = element.data("name") || dropField.uxdropfield("value");
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
                _state.push(filter);
            });

            // stores the state of the filter (search, sort and filter lines)
            // and in case this is a "new" query (reset) reflects it in the URL
            filter.data("state", {
                filterString: filterInputValue,
                sort: sort,
                filters: _state
            });
            reset && _writeState(filter);

            // sets the (query) pending flag in the filter
            filter.data("pending", true);

            // adds the loading class so that the loading information
            // is presented to the user, note that both the button more
            // and the filter itself have the class added to them
            filter.addClass("loading");
            filterMore.addClass("loading");

            // in case the no contents flag is set the extra no contents
            // class is also added to both the filter and the filter more
            noContents && filter.addClass("no-contents");
            noContents && filterMore.addClass("no-contents");

            // triggers the update start event so that any listener is notified
            // about the intent so start a new (possible) remote query
            filter.triggerHandler("update_start");

            // runs the query in the data source, this is a non blocking
            // operation that may take some time to be executed the proper
            // callback will be called at the end of the execution
            dataSource.uxdataquery(
                {
                    filterString: filterInputValue,
                    sort: sort,
                    filters: _filters,
                    startRecord: startRecord,
                    numberRecords: numberRecords
                },
                function(validItems, moreItems) {
                    // triggers the (on) data event, that is going to notify
                    // any listener about the results that have been received
                    // by the current filter component
                    filter.triggerHandler("data", [validItems, moreItems]);

                    // removes the loading class from the filter (and the
                    // filter more bytton), so that the loading information
                    // is hidden and the proper style "notified"
                    filter.removeClass("loading");
                    filterMore.removeClass("loading");
                    filter.removeClass("no-contents");
                    filterMore.removeClass("no-contents");

                    // in case the valid items value
                    // is not valid (error occurred)
                    if (!validItems) {
                        // unsets the (query) pending flag in the filter, and then
                        // returns immediately, nothing more to be done
                        filter.data("pending", false);
                        return;
                    }

                    // in case the reset flag is set, all of the currently defined
                    // filter element should be removed from structure
                    if (reset) {
                        // retrieves the current filter elements to remove
                        // them (refresh of the list)
                        var filterElements = jQuery(".filter-element", filter);
                        filterElements.remove();
                    }

                    // retrieves the cache map to be used to determine if the
                    // various elements should be constructed from scratch or
                    // if an already existing element should be used instead
                    var cache = filter.data("cache") || {};

                    // retrieves the valid items reference
                    var _validItems = jQuery(validItems);

                    // retrieves the valid items length
                    var validItemsLength = validItems.length;

                    // creates the list that will hold the complete set of elements
                    // resulting from the apply of the template
                    var templateItems = [];

                    // iterates over all the valid items to create
                    // proper visual/layout elements
                    _validItems.each(function(index, element) {
                        // creates the map with the options for the
                        // rendering of the template to changed the
                        // default value to be used
                        var options = {
                            apply: true,
                            nullify: true,
                            localize: true,
                            defaultValue: "-"
                        };

                        // tries to retrieve the object identifier from the
                        // current item to be used as identifier of the element
                        var objectId = element.object_id || element.oid;

                        // tries to retrieve the unique identifier from the
                        // current item to be used as the cache key
                        var uniqueId = element.unique_id || element.uid;

                        // starts the template item to an invalid value, the
                        // concrete value is going to be set after condition
                        var templateItem = null;

                        // retrieves the cache map from the filter and
                        // tries to find the cache item for the unique identifier
                        // validates it so that the data contained in it matches
                        // the one cached in such case sets the template item as
                        // the cached item (cache match usage)
                        var cacheItem = cache[uniqueId];
                        var cachedData = cacheItem ? cacheItem.data : null;
                        var cacheValid = cachedData ? jQuery.uxequals(cachedData, element) : false;
                        if (cacheItem && cacheValid) {
                            // sets the item contained in the cache item as
                            // the current cache item (layout item reference)
                            cacheItem = cacheItem.item;

                            // sets the template item as the currently cached
                            // item so that no construction occurs then removes
                            // the selection classes from it (avoiding possible
                            // layout problems)
                            templateItem = cacheItem;
                            templateItem.removeClass("selected");
                            templateItem.removeClass("first");
                            templateItem.removeClass("last");

                            // re-runs the apply operation on the cached item so
                            // that its configuration is re-loaded as defined in
                            // the specification (correct behaviour)
                            templateItem.uxapply();
                        }
                        // otherwise must re-create the template item by running
                        // the template engine again
                        else {
                            // applies the template to the template (item)
                            // retrieving the resulting template item and
                            // setting it the cache map for the unique id
                            // only in case the unique id is valid (set)
                            templateItem = template.uxtemplate(element, options);
                            if (uniqueId) {
                                cache[uniqueId] = {
                                    item: templateItem,
                                    data: element
                                };
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
                        // hides the filter no results panel and
                        // removes the no results class from the
                        // currently defined filter element
                        filterNoResults.hide();
                        filter.removeClass("no-results");
                    }
                    // otherwise there are no item to be shown
                    else {
                        // shows the filter no results panel
                        // and adds the no results class to
                        // the main filter element (as expected)
                        filterNoResults.show();
                        filter.addClass("no-results");
                    }

                    // in case there are more items available
                    // to be retrieved, shows the filter more item
                    if (moreItems) {
                        filterMore.show();
                        filterMore.addClass("invalid");
                        setTimeout(function() {
                            filterMore.removeClass("invalid");
                        }, sickTime);
                    }
                    // otherwise the are no more items to be shown
                    // and the more items element should be hidden
                    else {
                        filterMore.hide();
                    }

                    // retrieves the current list items
                    var listItems = jQuery(".filter-contents > *", matchedObject);

                    // unregisters from the right click in the list
                    // items (avoids duplicates) and then registers
                    // the handler for the context menu
                    listItems.unbind("contextmenu rightclick", _handleContext);
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

                        // retrieves the complete set of buttons currently present
                        // in the menu and removes the selected class from them
                        // (avoiding any possible visual problems)
                        var buttons = jQuery(".button:not(.menu-link)", _element);
                        buttons.removeClass("selected");
                    });

                    // triggers the update complete event, notice that the
                    // reset flat value is passed so that the listener is
                    // able to determine if this is a full replace operation
                    filter.triggerHandler("update_complete", [reset, templateItems]);

                    // updates the filter data, so that the it's possible
                    // to determine the "internal" and logical state of it
                    filter.data("filter_string", filterInputValue);
                    filter.data("start_record", startRecord + numberRecords);
                    filter.data("complete", !moreItems);
                    filter.data("pending", false);
                }
            );
        };

        var _handleContext = function(event) {
            // retrieves the current element
            var element = jQuery(this);

            // retrieves the reference to the window, document,
            // body and the reference to the current context menu
            var _body = jQuery("body");
            var contextMenus = jQuery("> .context-menu", _body);
            var menu = jQuery(".context-menu", element);

            // in case there's no context menu for the
            // current element no need to continue
            if (menu.length === 0) {
                // returns immediately no context menu
                // for the current element
                return;
            }

            // retrieves the current set of visible menus and menu
            // contents to be able to control them
            var _menu = jQuery(".menu.active");
            var _menuContents = jQuery(".menu-contents:visible");

            // triggers the hide event for all the menu and menu contents
            // so that their contents are properly disabled/hidden
            _menu.trigger("hide");
            _menuContents.trigger("hide");

            // clones the menu so that a new instance
            // is used for the context
            menu = menu.clone();
            menu.uxapply();

            // adds the drop menu class to indicate that this is
            // a menu of type drop (provisory)
            menu.addClass("drop-menu");

            // retrieves the complete set of buttons currently present
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
            var scrollY = window.scrollY ? window.scrollY : document.body.scrollTop;
            var scrollX = window.scrollX ? window.scrollX : document.body.scrollLeft;

            // updates the menu contents attributes to reflect
            // the proper attributes (position)
            menuContents.css("position", "fixed");
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

            // retrieves the complete set of buttons currently present
            // in the menu to register for their appropriate events and
            // remove the default button behavior
            var buttons = jQuery(".button:not(.menu-link)", menu);

            // retrieves the target buttons and then retrieves also the non
            // target buttons (these button need to be registered for the
            // various mouse event to control the sub menu behavior)
            var targetButtons = jQuery(".button[data-target]", menu);
            var nonTargetButtons = jQuery(":not(.sub-menu) .button:not([data-target])", menu);

            // registers for the mouse enter event so that the
            // menu may be shown
            targetButtons.mouseenter(function() {
                // retrieves the current element and add the hover
                // class to it
                var element = jQuery(this);
                element.addClass("hover");

                // creates the timeout to handle the proper show of
                // the sub menu (but only in case the element is still
                // correctly selected)
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
                    var subMenu = jQuery(".sub-menu:visible", menu);

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
                    var selectedListItem = jQuery(".filter-contents > .selected", filter);

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
                            ".context-menu > .menu-contents[data-menu_id=" +
                                menuId +
                                "] > :nth-child(" +
                                String(elementIndex + 1) +
                                ")",
                            __element
                        );

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
                        // document otherwise creates a new window and opened
                        // the link in it (external opening)
                        isDocument && index === 0
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
                            identifiersList += objectId;
                        });

                        // updates the current documents location to the bulk
                        // link, so that the bulk operation takes place
                        jQuery.uxlocation(linkBulk + "?object_id=" + identifiersList);
                    }

                    // stops the event propagation and prevents
                    // the default behavior (avoids propagation problems)
                    event.stopPropagation();
                    event.preventDefault();
                });

                // registers for the double click event on the button
                // to avoid unwanted propagation
                _element.dblclick(function(event) {
                    // stops the event propagation and prevents
                    // the default behavior (avoids propagation problems)
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

            // in case the selection row not "overflows"
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

            // in case the selection row not "overflows"
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
            if (_selection === listItems.length) {
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
                // returns the difference between the first
                // and the second elements
                return first - second;
            });

            // iterates over all the items in the selection
            // to correctly update their control classes
            for (var index = 0; index < selection.length; index++) {
                // retrieves the current the previous and the next
                // selections (for processing)
                var _selection = selection[index];
                var _previousSelection = selection[index - 1];
                var _nextSelection = selection[index + 1];

                // retrieves the list item to be selected
                var _selectedListItem = jQuery(
                    ".filter-contents > :nth-child(" + _selection + ")",
                    matchedObject
                );

                // adds the selected class to the selected list item
                _selectedListItem.addClass("selected");

                // in case the current index is the first or in case the
                // current selection is not preceded by a contiguous value
                if (index === 0 || _previousSelection !== _selection - 1) {
                    // adds the first class to the current selected
                    // list item (indicates that it is the first of
                    // a contiguous selection)
                    _selectedListItem.addClass("first");
                }

                // in case the current index if the last or in case the
                // the current selection is not succeeded by a contiguous value
                if (index === selection.length - 1 || _nextSelection !== _selection + 1) {
                    // adds the last class to the current selected
                    // list item (indicates that it is the last of
                    // a contiguous selection)
                    _selectedListItem.addClass("last");
                }
            }

            // retrieves the complete set of selected list items
            // to apply the global characteristics to them
            var selectedListItem = jQuery(".filter-contents > .selected", matchedObject);

            // retrieves the top offset of the page, using
            // the margin element (from the margin top)
            var margin = jQuery(".margin");
            var pageOffset = margin.outerHeight(true);

            // tries to retrieve the dom element, as the first
            // reference to the selected list item
            var _element = selectedListItem.get(0);

            // checks if the element is visible using
            // the appropriate visibility extension
            var isVisible = _element ? jQuery.uxvisible(selectedListItem, pageOffset) : true;

            // scrolls to the reference in case the element
            // is not visible, this is required so that the
            // end user is able to interact with the element
            !isVisible &&
                selectedListItem.length === 1 &&
                selectedListItem.uxscroll({
                    offset: pageOffset,
                    padding: 10
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
            pivot = pivot === 0 ? 1 : pivot;

            // retrieves the first and last element from the current
            // selection for reference
            var first = selection[0];
            var last = selection[selection.length - 1];

            // initializes the variable ahead of the conditional as
            // it is going to be used by both results
            var value = null;

            // in case the current first element is the pivot
            // need to use the last value as reference
            if (first === pivot) {
                // increments the last value and sets it as
                // the proper value
                value = last - 1;
            }
            // otherwise uses the first value as reference
            else {
                // decrement the first value and sets it as
                // the proper value
                value = first - 1;
            }

            // in case the current index value is zero
            // it's considered to be invalid, returns immediately
            if (value === 0) {
                // returns immediately, invalid index
                return;
            }

            // runs the range selection process for the currently
            // selected value and then updates the selection
            _rangeSelection(value, filter, options);
            _updateSelection(filter, options);

            // retrieves the complete set of selected list items
            // to apply the global characteristics to them
            var selectedListItem = jQuery(".filter-contents > .selected", matchedObject);

            // retrieves the top offset of the page, using
            // the margin element (from the margin top)
            var margin = jQuery(".margin");
            var pageOffset = margin.outerHeight(true);

            var item = null;

            // in case the current first element is the pivot
            // need to use the last value as reference
            if (first === pivot) {
                // retrieves the last item as the reference one
                item = jQuery(selectedListItem[selectedListItem.length - 1]);
            }
            // otherwise must use the first one
            else {
                // retrieves the first item as the reference one
                item = jQuery(selectedListItem[0]);
            }

            // checks if the item is visible and in case it's
            // not scroll the current viewport into the item
            var isVisible = item ? jQuery.uxvisible(item, pageOffset) : true;
            !isVisible &&
                item.uxscroll({
                    offset: pageOffset,
                    padding: 10
                });
        };

        var _decrementRange = function(matchedObject, options) {
            // creates some variables that are going to be re-used
            // through the function execution
            var value = null;
            var item = null;

            // sets the matched object as the filter reference
            // for further usage
            var filter = matchedObject;

            // retrieves the pivot value and the current selection
            // for the filter reference
            var pivot = filter.data("pivot");
            var selection = filter.data("selection");

            // checks if the pivot is zero and in case it is consider
            // it to be one (first element)
            pivot = pivot === 0 ? 1 : pivot;

            // retrieves the first and last element from the current
            // selection for reference
            var first = selection[0];
            var last = selection[selection.length - 1];

            // in case the current last element is the pivot
            // need to use the first value as reference
            if (last === pivot) {
                // increments the first value and sets it as
                // the proper value
                value = first + 1;
            }
            // otherwise uses the last value as reference
            else {
                // increments the last value and sets it as
                // the proper value
                value = last + 1;
            }

            // retrieves the "current" list items
            var listItems = jQuery(".filter-contents > *", matchedObject);

            // in case the selection row not "overflows"
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
            var selectedListItem = jQuery(".filter-contents > .selected", matchedObject);

            // retrieves the top offset of the page, using
            // the margin element (from the margin top)
            var margin = jQuery(".margin");
            var pageOffset = margin.outerHeight(true);

            // in case the current last element is the pivot
            // need to use the first value as reference
            if (last === pivot) {
                // retrieves the first item as the reference one
                item = jQuery(selectedListItem[0]);
            }
            // otherwise must use the last one
            else {
                // retrieves the last item as the reference one
                item = jQuery(selectedListItem[selectedListItem.length - 1]);
            }

            // checks if the item is visible and in case it's
            // not scroll the current viewport into the item
            var isVisible = item ? jQuery.uxvisible(item, pageOffset) : true;
            !isVisible &&
                item.uxscroll({
                    offset: pageOffset,
                    padding: 10
                });
        };

        var _upRange = function(matchedObject, options) {
            // sets the matched object as the filter reference
            // for further usage
            var filter = matchedObject;

            // runs the range selection process for the currently
            // selected value and then updates the selection
            _rangeSelection(1, filter, options);
            _updateSelection(filter, options);

            // retrieves the complete set of selected list items
            // to apply the global characteristics to them
            var selectedListItem = jQuery(".filter-contents > .selected", matchedObject);

            // retrieves the top offset of the page, using
            // the margin element (from the margin top)
            var margin = jQuery(".margin");
            var pageOffset = margin.outerHeight(true);

            // retrieves the first item as the reference one
            var item = jQuery(selectedListItem[0]);

            // checks if the item is visible and in case it's
            // not scroll the current viewport into the item
            var isVisible = item ? jQuery.uxvisible(item, pageOffset) : true;
            !isVisible &&
                item.uxscroll({
                    offset: pageOffset,
                    padding: 10
                });
        };

        var _downRange = function(matchedObject, options) {
            // sets the matched object as the filter reference
            // for further usage
            var filter = matchedObject;

            // retrieves the pivot value and the current selection
            // for the filter reference, then retrieves the current
            // selection reference element
            var selection = filter.data("selection");
            var _selection = selection[selection.length - 1];

            // retrieves the "current" list items
            var listItems = jQuery(".filter-contents > *", matchedObject);

            // in case the selection row is the last
            // need to load more elements
            if (_selection === listItems.length) {
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
            var selectedListItem = jQuery(".filter-contents > .selected", matchedObject);

            // retrieves the top offset of the page, using
            // the margin element (from the margin top)
            var margin = jQuery(".margin");
            var pageOffset = margin.outerHeight(true);

            // retrieves the last item as the reference one
            var item = jQuery(selectedListItem[selectedListItem.length - 1]);

            // checks if the item is visible and in case it's
            // not scroll the current viewport into the item
            var isVisible = item ? jQuery.uxvisible(item, pageOffset) : true;
            !isVisible &&
                item.uxscroll({
                    offset: pageOffset,
                    padding: 10
                });
        };

        var _rangeSelection = function(index, matchedObject, options) {
            // starts some more global variables that are going
            // to be re-used through the function
            var _initial = null;
            var _final = null;

            // sets the matched object as the filter reference
            // for further usage
            var filter = matchedObject;

            // retrieves the current selection and the current
            // pivot item index
            var selection = filter.data("selection");
            var pivot = filter.data("pivot");

            // checks if the pivot is zero and in case it is consider
            // it to be one (first element)
            pivot = pivot === 0 ? 1 : pivot;

            // checks if the current selection is the initial
            // empty selection, in case it's "pops" it from the
            // current selection set (avoids problems in selection)
            var isInitial = selection.length === 1 && selection[0] === 0;
            isInitial && selection.pop();

            // in case the index value is greater than the pivot index
            // it's a range for the down
            if (index >= pivot) {
                // sets the proper initial and final values
                // for the "down" range
                _initial = pivot;
                _final = index + 1;
            }
            // otherwise in case the index value is lesser than the pivot
            // index it's a range for the up
            else if (index <= pivot) {
                // sets the proper initial and final values
                // for the "upper" range
                _initial = index;
                _final = pivot + 1;
            }

            // creates a new list to hold the new selection values resulting
            // from the range selection
            var _selection = [];

            // iterates over the range values to add the selected indexes to
            // the selection list
            for (var _index = _initial; _index < _final; _index++) {
                // adds the index to the list of the selections
                _selection.push(_index);
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
                valueLink = valueLink || linkElement.attr("href");

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
                            offset: isNaN(offsetInteger) ? 0 : offsetInteger
                        };

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

            // retrieves the complete set of buttons currently present
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
            var top = offset.top;
            var left = offset.left;

            // retrieves the element with and then uses
            // it to calculate the margin left for the
            // sub menu element
            var elementWidth = element.outerWidth();
            var marginLeft = elementWidth - 3;

            // retrieves the correct scroll position coordinates
            // according to the current browser implementation
            var scrollY = window.scrollY ? window.scrollY : document.body.scrollTop;
            var scrollX = window.scrollX ? window.scrollX : document.body.scrollLeft;

            // sets the proper position attributes for the
            // submenu so that it's positioned to the right
            // of the action element
            subMenu.css("position", "fixed");
            subMenu.css("margin-left", marginLeft + "px");
            subMenu.css("margin-top", 0 + "px");
            subMenu.css("top", top - scrollY + "px");
            subMenu.css("left", left - scrollX + "px");

            // adds the selected class to the element (button)
            // so that it's highlighted
            element.addClass("selected");

            // tries to retrieve the currently registered mouse enter
            // event from the sub buttons in case the event does not exists
            // registers a new function for the handling and sets it in
            // the data for the sub buttons
            var mouseenter = subButtons.data("mouseenter");
            mouseenter =
                mouseenter ||
                subButtons.mouseenter(function() {
                    element.addClass("selected");
                });
            subButtons.data("mouseenter", mouseenter);

            // shows the sub menu with a fade effect
            subMenu.fadeIn(150, function() {
                // unsets the flag that controls the
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

            // defaults some of the internal values to be set during the
            // switch conditional execution
            var _items = [];
            var _operations = [];

            // switched over the type of the value that was selected
            // (different type will have different operation and different
            // value fields)
            switch (type) {
                case "string":
                    // creates the list of items and then creates the list
                    // of equivalent operations (index based association)
                    _items = ["contains", "matches", "begins with", "ends with"];
                    _operations = ["like", "equals", "rlike", "llike"];

                    // creates the value field as a text field, inserts it
                    // after the operation field and initializes it
                    valueField = jQuery(
                        '<input type="text" class="text-field small value-field" />'
                    );
                    valueField.insertAfter(operationField);
                    valueField.uxtextfield();

                    // breaks the switch
                    break;

                case "number":
                    // creates the list of items and then creates the list
                    // of equivalent operations (index based association)
                    _items = ["equals", "greater than", "less than"];
                    _operations = ["equals", "greater", "lesser"];

                    // creates the value field as a text field, inserts it
                    // after the operation field and initializes it
                    valueField = jQuery(
                        '<input type="text" class="text-field small value-field" data-type="integer" />'
                    );
                    valueField.insertAfter(operationField);
                    valueField.uxtextfield();

                    // breaks the switch
                    break;

                case "float":
                    // creates the list of items and then creates the list
                    // of equivalent operations (index based association)
                    _items = ["equals", "greater than", "less than"];
                    _operations = ["equals", "greater", "lesser"];

                    // creates the value field as a text field, inserts it
                    // after the operation field and initializes it
                    valueField = jQuery(
                        '<input type="text" class="text-field small value-field" data-type="float" />'
                    );
                    valueField.insertAfter(operationField);
                    valueField.uxtextfield();

                    // breaks the switch
                    break;

                case "date":
                    // creates the list of items and then creates the list
                    // of equivalent operations (index based association)
                    _items = ["in", "after", "before"];
                    _operations = ["in_day", "greater", "lesser"];

                    // creates the value field as a text field (calendar field),
                    // inserts it after the operation field and initializes it
                    valueField = jQuery(
                        '<input type="text" class="text-field small value-field" data-type="date" data-original_value="yyyy/mm/dd" />'
                    );
                    valueField.insertAfter(operationField);
                    valueField.uxtextfield();

                    // breaks the switch
                    break;

                case "reference":
                    // creates the list of items and then creates the list
                    // of equivalent operations (index based association)
                    _items = ["search"];
                    _operations = ["equals"];

                    // sets the disabled flag so that no operation changing
                    // action is possible
                    disabled = true;

                    // retrieves the URL and the type (data source) from
                    // the associated element
                    var url = element.attr("data-surl");
                    var _type = element.attr("data-stype");

                    // retrieves the display and the value attributes from the
                    // element to the propagated to the value field
                    var displayAttribute = element.attr("data-sdisplay_attribute") || "name";
                    var valueAttribute = element.attr("data-svalue_attribute") || "value";

                    // creates the value field as a drop field (reference field),
                    // inserts it after the operation field and initializes it
                    valueField = jQuery(
                        '<div class="drop-field small value-field">' +
                            '<input type="hidden" class="hidden-field" />' +
                            '<ul class="data-source"></ul>' +
                            "</div>"
                    );

                    // retrieves the data source associated with the value
                    // field an then updates the URL and the type of the
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

                default:
                    // creates the list of items and then creates the list
                    // of equivalent operations (index based association)
                    _items = ["undefined"];
                    _operations = [""];

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
            select &&
                dropField.uxdropfield("set", {
                    value: value
                });

            // updates the operation field to be set to the
            // first item in the items sequence
            operationField.uxdropfield("set", {
                value: _items[0]
            });

            // in case the disabled flag is set disables the operation
            // field otherwise enables it
            disabled ? operationField.uxdisable() : operationField.uxenable();

            // registers for the value select event in the
            // operation field to update the filter results
            operationField.bind("value_select", function(event, value, valueLogic, item) {
                // updates the current filter to reflect the
                // changes in the operation field
                _update(_filter, options, true);
            });

            // registers for the value change event in the
            // value field to update the filter results
            valueField.bind("value_change", function(event, value, valueLogic, item) {
                // updates the current filter to reflect the
                // changes in the value field
                _update(_filter, options, true);
            });

            // registers for the value select event in the
            // value field to update the filter results
            valueField.bind("value_select", function(event, value, valueLogic, item) {
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

        var _addFilter = function(matchedObject, target, name) {
            // retrieves the data source for the current filter object
            // and retrieves the associated filtering objects
            var dataSource = jQuery("> .data-source", matchedObject);
            var dataFiltering = jQuery(".filtering > li", dataSource);

            // retrieves the advanced filters section of the filter, this
            // area is going to be used to add the "new" filter
            var advancedFilters = jQuery(".filter-advanced-filters", matchedObject);

            // creates the new filter element and the associated drop field
            // operation field (drop field) and the text field
            var filter = jQuery('<div class="filter-advanced-filter"></div>');
            var dropField = jQuery(
                '<div class="drop-field drop-field-select small"' +
                    ' data-number_options="-1">' +
                    '<ul class="data-source" data-type="local"></ul>' +
                    "</div>"
            );
            var operationField = jQuery(
                '<div class="drop-field drop-field-select small operation-field"' +
                    ' data-number_options="-1">' +
                    '<ul class="data-source" data-type="local"></ul>' +
                    "</div>"
            );

            // creates the remove and add buttons for the filter line
            // and creates the clear element to clear eht float layout structure
            // (in case it's necessary)
            var remove = jQuery('<div class="filter-input-remove"></div>');
            var add = jQuery('<div class="filter-input-add"></div>');
            var clear = jQuery('<div class="filter-clear"></div>');

            // retrieves the data source element associated with the drop field
            // to be used to select that value of filtering
            var dropSource = jQuery("> .data-source", dropField);

            // creates the initial list to hold the items, types and names associated
            // with them, the index should be associative between them
            var items = [];
            var types = [];
            var names = [];
            var elements = [];

            // iterates over each of the data filtering elements to
            // be able to "parse" the items and insert them into the
            // the items and types lists
            dataFiltering.each(function(index, element) {
                // retrieves the current element in iteration
                var _element = jQuery(this);

                // retrieves the HTML value of the element and
                // retrieves the data type attribute of it to
                // be used both as the item and the type
                var dataHtml = _element.html();
                var dataType = _element.attr("data-type");
                var dataName = _element.attr("data-name");

                // adds the data HTML (item) and the data type
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
            dropField.bind("value_select", function(event, value, valueLogic, item) {
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

            // registers for the click event in the add button to
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
                numberOptions: 10,
                filterOptions: true
            });
            operationField.uxdropfield("default", {
                numberOptions: 10,
                filterOptions: true
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
            target ? filter.insertAfter(target) : advancedFilters.prepend(filter);

            // selects the initial element of the "newly" created filter
            // this is the first value to be viewed by the end user, the
            // one with the provided name or the first one otherwise
            var index = name ? names.indexOf(name) : -1;
            _selectFilter(filter, items[index === -1 ? 0 : index], true);

            // returns the "newly" created filter (line) to the caller
            return filter;
        };

        var _disableFiltering = function(matchedObject, options) {
            // retrieves the filter add element (in the advanced panel)
            // and disables it to avoid insertion of filters
            var filterAdd = jQuery(".filter-advanced > .filter-input-add", matchedObject);
            filterAdd.hide();
        };

        var _restoreFilters = function(matchedObject, filters) {
            // retrieves the data source for the current filter object
            // and retrieves the associated filtering objects
            var dataSource = jQuery("> .data-source", matchedObject);
            var dataFiltering = jQuery(".filtering > li", dataSource);

            // creates the initial list to hold the names and the types
            // associated with them, the index should be associative between them
            var names = [];
            var types = [];

            // iterates over each of the data filtering elements to
            // be able to "parse" the items and insert them into the
            // the names and types lists
            dataFiltering.each(function(index, element) {
                // retrieves the current element in iteration
                var _element = jQuery(this);

                // retrieves the data name and the data type attributes
                // of the element and adds them to the corresponding lists
                var dataName = _element.attr("data-name");
                var dataType = _element.attr("data-type");
                names.push(dataName);
                types.push(dataType);
            });

            // starts the reference to the previously restored filter (line)
            // and the counter of the filter (lines) that have been restored
            var previous = null;
            var count = 0;

            // sets the restoring flag in the filter so that the changes in
            // the filter (lines) do not trigger any update operation
            matchedObject.data("restoring", true);

            // iterates over all the filter tuples of the state to create the
            // (graphical) filter lines for them, the ones that are not valid
            // (name, operation or value) are ignored
            for (var index = 0; index < filters.length; index++) {
                // retrieves the current filter in iteration and
                // unpack it into the various components
                var _filter = filters[index];
                var attribute = _filter[0];
                var operation = _filter[1];
                var value = _filter[2];

                // retrieves the type associated with the attribute and the
                // regular expression that validates the values of the type
                var nameIndex = names.indexOf(attribute);
                var type = nameIndex === -1 ? null : types[nameIndex];
                var regex = VALUE_REGEX[type];

                // in case the attribute is not one of the filtering elements
                // or the value is not valid for its type the filter is ignored
                if (!type || !value || (regex && !regex.test(value))) {
                    continue;
                }

                // adds the filter (line) for the attribute after the previous
                // one, so that the order of the filters is the one of the state
                var filter = _addFilter(matchedObject, previous, attribute);

                // retrieves the operation field of the filter (line) and the
                // data source of it to be used for the retrieval of the items
                // and operations lists
                var operationField = jQuery("> .operation-field", filter);
                var operationSource = jQuery("> .data-source", operationField);

                // retrieves the lists for the items and for the operations
                var items = operationSource.data("items");
                var operations = operationSource.data("operations");

                // retrieves the index of the (logical) operation in case it's
                // not one of the operations of the type the filter (line) is
                // removed and the filter is ignored
                var itemIndex = operations.indexOf(operation);
                if (itemIndex === -1) {
                    filter.remove();
                    continue;
                }

                // updates the operation field to be set to the (graphical)
                // operation value and restores the value of the filter (line)
                operationField.uxdropfield("set", {
                    value: items[itemIndex]
                });
                _restoreValue(filter, type, value);

                // updates the previous filter (line) reference and
                // increments the counter of restored filter (lines)
                previous = filter;
                count++;
            }

            // unsets the restoring flag in the filter, the update
            // operations are allowed again from this moment
            matchedObject.data("restoring", false);

            // returns the number of filter (lines) that have been restored
            return count;
        };

        var _restoreValue = function(filter, type, value) {
            // retrieves the reference to the value field using
            // the filter to do so
            var valueField = jQuery("> .value-field", filter);

            // switched over the type of the value that is being restored
            // (different type will have different value fields)
            switch (type) {
                case "date":
                    // converts the (UTC) timestamp into the date string
                    // and sets it as the value of the text field
                    var date = new Date(parseInt(value) * 1000);
                    valueField.uxtextfield("value", {
                        value: jQuery.uxformat(date, "%Y/%m/%d", true)
                    });

                    // breaks the switch
                    break;

                case "reference":
                    // retrieves the data source associated with the value
                    // field and the hidden field that holds the logic value
                    var valueSource = jQuery("> .data-source", valueField);
                    var hiddenField = jQuery(".hidden-field", valueField);

                    // retrieves the display and the value attributes from
                    // the value field to be used in the resolution
                    var displayAttribute = valueField.attr("data-display_attribute");
                    var valueAttribute = valueField.attr("data-value_attribute");

                    // sets the value as both the display and the logic value
                    // of the drop field, so that the filter is applied right
                    // away while the display value is not resolved
                    valueField.uxdropfield("set", {
                        value: value,
                        valueLogic: value
                    });

                    // runs the query in the data source of the value field to
                    // resolve the display value associated with the logic value
                    valueSource.uxdataquery(
                        {
                            filters: [[valueAttribute, "equals", value]],
                            startRecord: 0,
                            numberRecords: 1
                        },
                        function(validItems, moreItems) {
                            // retrieves the item that has been resolved, in case
                            // there's none or the logic value has changed in the
                            // meantime returns immediately (nothing to be done)
                            var item = validItems ? validItems[0] : null;
                            if (!item || hiddenField.val() !== value) {
                                return;
                            }

                            // in case the item is not the one for the logic value
                            // or it has no display value returns immediately
                            var isValid = String(item[valueAttribute]) === value;
                            if (!isValid || !item[displayAttribute]) {
                                return;
                            }

                            // updates the display value of the drop field with
                            // the resolved one, keeping the same logic value
                            valueField.uxdropfield("set", {
                                value: String(item[displayAttribute]),
                                valueLogic: value
                            });
                        }
                    );

                    // breaks the switch
                    break;

                default:
                    // sets the value in the text field as it's
                    // provided (no conversion required)
                    valueField.uxtextfield("value", {
                        value: value
                    });

                    // breaks the switch
                    break;
            }
        };

        var _getSort = function(matchedObject) {
            // retrieves the selected sort options and then uses it
            // to retrieve the value to be used for the sorting, falling
            // back to the text of the option (never to its markup)
            var sortSelected = jQuery(".filter-sort-option.selected", matchedObject);
            var sortValue = sortSelected.attr("data-name") || sortSelected.text();

            // checks if the sort option is currently in the ascending mode
            // and "calculates" the sort order string based on it, then created
            // the sorting list (tuple) to be used in the query
            var isAscending = sortSelected.hasClass("ascending");
            var sortOrder = isAscending ? "ascending" : "descending";
            return sortValue ? [sortValue, sortOrder] : null;
        };

        var _selectSort = function(matchedObject, sort) {
            // unpacks the sorting list (tuple) into the value
            // and the order that are going to be selected
            var sortValue = sort[0];
            var sortOrder = sort[1];

            // retrieves the references to the various sort options
            // and the one that is currently selected
            var filterOptions = jQuery(".filter-sort-option", matchedObject);
            var selectedOption = jQuery(".filter-sort-option.selected", matchedObject);

            // filters the sort options so that only the one that has
            // the requested value remains (same value used for the sorting)
            var element = filterOptions.filter(function() {
                var _element = jQuery(this);
                return (_element.attr("data-name") || _element.text()) === sortValue;
            });
            element = element.first();

            // in case the option is not found returns immediately
            // as it's not possible to select it (unknown value)
            if (element.length === 0) {
                return false;
            }

            // checks if the option is the one that represents no sorting
            // (default) in such case its own order is used, otherwise the
            // order must be valid or else nothing is selected
            var isEquals = element.attr("data-order") === "equals";
            sortOrder = isEquals ? "equals" : sortOrder;
            if (!isEquals && sortOrder !== "ascending" && sortOrder !== "descending") {
                return false;
            }

            // removes the selected classes from the selected
            // option, to unselect the selected option
            selectedOption.removeClass("selected");
            selectedOption.removeClass("ascending");
            selectedOption.removeClass("descending");
            selectedOption.removeClass("equals");

            // selects the element by adding the selected class
            // and the class of the requested order (sort order)
            element.addClass("selected");
            element.addClass(sortOrder);
            return true;
        };

        var _getView = function(matchedObject) {
            // iterates over the names of the views to find the one that
            // is currently set in the filter (using the associated class)
            for (var index = 0; index < VIEWS.length; index++) {
                if (matchedObject.hasClass(VIEWS[index] + "-list")) {
                    return VIEWS[index];
                }
            }

            // returns an invalid value as no view is set in the filter
            return null;
        };

        var _selectView = function(matchedObject, view) {
            // checks if the view is one of the possible views and if it's
            // possible to display it for the current filter component, note
            // that the classes of the template are obfuscated (data class)
            // until its first use, so both attributes must be verified
            var isValid = VIEWS.indexOf(view) !== -1;
            var hasView =
                isValid &&
                jQuery("." + view + "-view, [data-class~='" + view + "-view']", matchedObject).length;

            // in case the view is not valid or there's no way to display
            // it returns immediately (the current view is kept)
            if (!hasView) {
                return;
            }

            // removes the classes of the views from the filter and
            // then adds the class associated with the requested view
            for (var index = 0; index < VIEWS.length; index++) {
                matchedObject.removeClass(VIEWS[index] + "-list");
            }
            matchedObject.addClass(view + "-list");
        };

        var _readState = function() {
            // creates the map that holds the state of the filter with
            // the (default) values that represent no state at all
            var state = {
                filterString: "",
                filters: [],
                sort: null,
                view: null
            };

            // retrieves the query part of the current URL and splits
            // it into the various parameters that are part of it
            var search = window.location.search.slice(1);
            var parameters = search ? search.split("&") : [];

            // iterates over all the parameters to populate the state
            // with the ones that are part of it, the ones that are
            // not valid (or not known) are ignored
            for (var index = 0; index < parameters.length; index++) {
                // unpacks the current parameter into the name and the
                // value, decoding both of them (may not be possible)
                var parameter = _splitParameter(parameters[index]);
                var name = parameter[0];
                var value = parameter[1];
                var tokens = value ? value.split(":") : [];

                // switches over the name of the parameter
                switch (name) {
                    case "filter_string":
                        // sets the value as the search string
                        state.filterString = value || "";

                        // breaks the switch
                        break;

                    case "filters[]":
                    case "filters":
                        // adds the filter tuple to the filters list, the value
                        // is the remaining of the tokens as it may contain the
                        // separator, incomplete tuples are ignored
                        tokens.length > 2 &&
                            state.filters.push([
                                tokens[0],
                                tokens[1],
                                tokens.slice(2).join(":")
                            ]);

                        // breaks the switch
                        break;

                    case "sort":
                        // sets the sorting list (tuple) only in case
                        // both the value and the order are defined
                        state.sort = tokens.length === 2 ? tokens : null;

                        // breaks the switch
                        break;

                    case "view":
                        // sets the value as the name of the view
                        state.view = value;

                        // breaks the switch
                        break;
                }
            }

            // returns the state that has been read from the URL
            return state;
        };

        var _writeState = function(matchedObject) {
            // retrieves the state of the filter and the flags that control
            // if the state is bound to the URL and ready to be written
            var state = matchedObject.data("state");
            var stateful = matchedObject.data("stateful");
            var stateReady = matchedObject.data("state_ready");

            // in case the state is not meant to be reflected in the URL or
            // it's not possible to do so returns immediately
            if (!state || !stateful || !stateReady || !window.history.replaceState) {
                return;
            }

            // retrieves the query part of the current URL and splits
            // it into the various parameters that are part of it
            var search = window.location.search.slice(1);
            var parameters = search ? search.split("&") : [];

            // creates the list that will hold the parameters of the new
            // query, starting with the ones of the current URL that are
            // not part of the state of the filter (must be kept)
            var _parameters = [];
            for (var index = 0; index < parameters.length; index++) {
                var name = _splitParameter(parameters[index])[0];
                STATE_PARAMETERS.indexOf(name) === -1 && _parameters.push(parameters[index]);
            }

            // adds the search string to the parameters, in
            // case it's defined (not the default value)
            state.filterString &&
                _parameters.push("filter_string=" + _encodeValue(state.filterString));

            // iterates over all the filters to "serialize" their data into
            // a simple string and add it to the parameters
            for (index = 0; index < state.filters.length; index++) {
                _parameters.push("filters[]=" + _encodeValue(state.filters[index].join(":")));
            }

            // adds the sort string to the parameters, in case it's
            // not the one of the default sort of the filter
            var sort = state.sort.join(":");
            var defaultSort = matchedObject.data("default_sort").join(":");
            sort !== defaultSort && _parameters.push("sort=" + _encodeValue(sort));

            // adds the view to the parameters, in case it's
            // not the default view of the filter
            var view = _getView(matchedObject);
            var defaultView = matchedObject.data("default_view");
            view && view !== defaultView && _parameters.push("view=" + view);

            // builds the new URL from the path of the current one, the
            // new query and the fragment, in case it's the same as the
            // current one returns immediately (nothing to be done)
            var location = window.location;
            var query = _parameters.length > 0 ? "?" + _parameters.join("&") : "";
            var url = location.pathname + query + location.hash;
            if (url === location.pathname + location.search + location.hash) {
                return;
            }

            // replaces the URL of the current history entry, keeping
            // its state, the operation may not be possible (eg: opaque
            // origin or rate limit) and such failure is ignored
            try {
                window.history.replaceState(window.history.state, null, url);
            } catch (exception) {}
        };

        var _splitParameter = function(parameter) {
            // splits the parameter around the first separator
            // into the (encoded) name and value components
            var index = parameter.indexOf("=");
            var name = index === -1 ? parameter : parameter.slice(0, index);
            var value = index === -1 ? "" : parameter.slice(index + 1);

            // decodes both the name and the value, in case it's not
            // possible (malformed encoding) invalid values are returned
            try {
                name = decodeURIComponent(name.replace(/\+/g, " "));
                value = decodeURIComponent(value.replace(/\+/g, " "));
            } catch (exception) {
                return [null, null];
            }

            // returns the tuple with the name and the value
            return [name, value];
        };

        var _encodeValue = function(value) {
            // encodes the value keeping the filter separator as it
            // is (valid in the query), for a more readable URL
            return encodeURIComponent(value).replace(/%3A/g, ":");
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
                if (event.ctrlKey || event.metaKey) {
                    // retrieves the current selection for reference
                    var selection = filter.data("selection");

                    // checks if the current selection is the initial
                    // empty selection, in case it's "pops" it from the
                    // current selection set (avoids problems in selection)
                    var isInitial = selection.length === 1 && selection[0] === 0;
                    isInitial && selection.pop();

                    // in case the current selection is empty it's time to update
                    // the pivot value (it's the first element of the selection)
                    selection.length === 0 && filter.data("pivot", templateItemIndex + 1);

                    // retrieves the index of the element in the selection
                    // index, this is going to be used to check if the element
                    // is present in the selection set
                    var elementIndex = selection.indexOf(templateItemIndex + 1);

                    // in case the element index is invalid (it's not present
                    // in the selection set) must be added to set (selection)
                    if (elementIndex === -1) {
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
                    // it against the pivot index value
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
                var elementIndex = selection.indexOf(templateItemIndex + 1);

                // in case the element is currently selected
                // nothing is to be done
                if (elementIndex !== -1) {
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
