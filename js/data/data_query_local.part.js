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

            // retrieves the record count information
            var startRecord = query["startRecord"] || 0;
            var numberRecords = query["numberRecords"] || MAX_RECORDS;

            // sets the initial filter flag value
            var filter = false;

            // in case the start record and the number
            // of records is set
            if (startRecord != null && numberRecords != null) {
                // sets the filter flag
                filter = true;
            }

            // retrieves the element items
            var items = element.data("items");

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
                    // retrieves the current compare string
                    var compareString = compareStrings[_index];

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
