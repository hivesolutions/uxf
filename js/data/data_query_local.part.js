(function(jQuery) {
    jQuery.fn.uxdataquerylocal = function(query, callback, options) {
        // the default value to be used when no number of
        // records field is defined (should be a very large
        // value) so that all the records are retrieved
        var MAX_RECORDS = 100000000;

        // the default values for the data query local
        var defaults = {};

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
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // iterates over all the object to retrieve the
            // result associated
            matchedObject.each(function(index, element) {
                        // retrieves the element reference
                        var _element = jQuery(element);

                        // retrieves the results for the element and query
                        _getResults(_element, query, callback);
                    });
        };

        var _getResults = function(element, query, callback) {
            // retrieves the id part of the url
            var id = query["id"];

            // retrieves the "main" filter string and attribute
            var filterString = query["filterString"];
            var filterAttributes = query["filterAttributes"];

            // retrieves the record count information and validates that
            // the requested number of records is not infinite (minus one)
            var startRecord = query["startRecord"] || 0;
            var numberRecords = query["numberRecords"] || MAX_RECORDS;
            numberRecords = numberRecords == -1 ? MAX_RECORDS : numberRecords

            // sets the initial filter flag value
            var filter = false;

            // in case the start record and the number
            // of records is set the filtering mosde should
            // be enabled so that only a slice of the results
            // is returned at the end of the query process
            if (startRecord != null && numberRecords != null) {
                filter = true;
            }

            // retrieves the element items, these should contain the
            // list of items currently registered in the data souce
            var items = element.data("items");

            // retrieves the value of the insensitive flag in in the
            // data source in case the data source is configured as
            // insensitive the casing of the letters to be searched
            // must not matter and capital and lower letters should
            // be treated the same way
            var insensitive = element.attr("data-insensitive")

            // converts the provided filter string into a lowercase
            // representation in case the insensitive mode has been
            // set for the current context, this is required in order
            // for the search process to be executed correctly
            filterString = insensitive
                    ? filterString.toLowerCase()
                    : filterString;

            // creates a list to hold (the valid) items
            var validItems = [];

            // in case the id value is set, there's
            // a need to filter the items
            if (id) {
                // creates the list to hold the valid
                // items for the id value
                var itemsId = [];

                // iterates over the range of items (indexes)
                for (var index = 0; index < items.length; index++) {
                    // retrieves the current item, and
                    // then retrieves and casts the item id
                    var item = items[index];
                    var itemId = parseInt(item["id"]);

                    // in case the item id does not
                    // represent a number
                    if (isNaN(itemId)) {
                        // continues the loop
                        continue;
                    }

                    // in case the current item
                    // id is the id to be found
                    if (itemId == id) {
                        // adds the item to the items
                        // id list
                        itemsId.push(item);
                    }
                }

                // sets the list of items for the id
                // as the current usable list of items
                items = itemsId;
            }

            // iterates over all the items to check for a valid
            // prefix (starts with)
            for (var index = 0; index < items.length; index++) {
                // retrieves the current item
                var currentItem = items[index];

                // in case the filter attributes are defined
                if (filterAttributes) {
                    // starts the compare strings list
                    var compareStrings = [];

                    // iterates over all the filter attributes
                    for (var _index = 0; _index < filterAttributes.length; _index++) {
                        // retrieves the current filter attribute
                        var filterAttribute = filterAttributes[_index];

                        // retrieves the compare string and adds it
                        // to the compare strings list
                        var compareString = currentItem[filterAttribute];
                        compareStrings.push(compareString);
                    }
                }
                // otherwise in case the current item is a map the
                // default attribute must be used
                else if (typeof currentItem == "object") {
                    // retrieves the name attribute from the current
                    // item and sets it in the list of compaare strings
                    var name = currentItem["name"];
                    var compareStrings = [name];
                }
                // otherwise the current item must be a string
                // and so it's used directly as the compare strings
                else {
                    // sets the current item as the only
                    // compare string
                    var compareStrings = [currentItem];
                }

                // iterates over all the compare string for the filter
                // string comparison
                for (var _index = 0; _index < compareStrings.length; _index++) {
                    // retrieves the current compare string and converts it into
                    // a lowercased string in case the insensitive flag is set
                    var compareString = compareStrings[_index];
                    compareString = insensitive
                            ? compareString.toLowerCase()
                            : compareString;

                    // checks if the compare string (current item) starts with the
                    // current filter string
                    if (compareString.indexOf(filterString) == 0) {
                        // adds the current item to the list
                        // of valid items (valid item)
                        validItems.push(currentItem);

                        // breaks the loop
                        break;
                    }
                }
            }

            // retrieves the valid items length to check if there
            // is more items available
            var validItemsLength = validItems.length;
            var moreItems = validItemsLength > startRecord + numberRecords;

            // filters "some" valid items (in
            // case the filter options flag is set)
            var validItems = filter ? validItems.slice(startRecord, startRecord
                            + numberRecords) : validItems;

            // calls the callback with the "valid" items
            callback(validItems, moreItems);
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
