(function(jQuery) {
    jQuery.fn.uxdataqueryjson = function(query, callback, options) {
        // the default timeout to be used in the request
        // (this value is used to delay the request)
        var DEFAULT_TIMEOUT = 250;

        // the default value to be used when no number of
        // records field is defined (should be a very large
        // value) so that all the records are retrieved
        var MAX_RECORDS = 100000000;

        // the default values for the data query json
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

            // retrieves the "main" filter string
            var filterString = query["filterString"];

            // retrieves the sort tuple to be used to sort
            // the resulting set of elements
            var sort = query["sort"] || ["default", "descending"];

            // retrieves the filter tuples to be used to filter
            // the result set around certain rules
            var filters = query["filters"] || [];

            // retrieves the record count information and validates that
            // the requested number of records is not infinite (minus one)
            var startRecord = query["startRecord"] || 0;
            var numberRecords = query["numberRecords"] || MAX_RECORDS;
            numberRecords = numberRecords == -1 ? MAX_RECORDS : numberRecords

            // unpacks the sort value and the sort oder from the
            // sort tuple and uses them to create the "final" sort
            // string to be used in the query string
            var sortValue = sort ? sort[0] : null;
            var sortOrder = sort ? sort[1] : null;
            var sortString = sort ? sortValue + ":" + sortOrder : null;

            // creates the list that will hold the various filter strings
            // to be sent to the remote handler
            var _filters = [];

            // iterates over all the filters to "serialize" their data into
            // a simple string to the remote handler
            for (var index = 0; index < filters.length; index++) {
                // retrieves the current filter in iteration and
                // unpack it into the various components
                var filter = filters[index];
                var attribute = filter[0];
                var operation = filter[1];
                var value = filter[2];

                // in case the current value is a sequence must join
                // all of its values arround the separator token
                var isSequence = typeof value == "object";
                if (isSequence) {
                    value = value.join(";")
                }

                // creates the serialized filter string and adds it
                // to the list of filters to be sent to the handler
                var _filter = attribute + ":" + operation + ":" + value;
                _filters.push(_filter);
            }

            // sets the initial filter flag value
            var filter = false;

            // in case the start record and the number
            // of records is set
            if (startRecord != null && numberRecords != null) {
                // sets the filter flag
                filter = true;
            }

            // retrieves the elements url and data values to be used
            // for the processing of the "remote" query
            var url = element.data("url");
            var data = element.data("data");
            var cacheD = element.data("cache_d");

            // adds the id (part) to the url (in case
            // it's necessary)
            url += id ? "/" + id + ".json" : ""

            // increments the value of the number of records (to provide
            // an extra value for more items verification)
            numberRecords = numberRecords ? numberRecords + 1 : numberRecords;

            // checks if the data source is still dirty
            // this will be used to check if a timeout should
            // be used in the remote query
            var isDirty = matchedObject.data("is_dirty");
            matchedObject.data("is_dirty", true);

            // tries to retrieve the timeout attribute from the matched
            // object and then parse as integer as a fallback the default
            // timeout value is used, note that if the data source is
            // not dirty no timeout is used (instant query)
            var timeout = matchedObject.attr("data-timeout");
            timeout = !isDirty ? 0 : timeout
                    ? parseInt(timeout)
                    : DEFAULT_TIMEOUT;

            // creates the map containing the definition of the
            // query to be sent to the data source, then creates
            // the corresponding hash value to be used as the
            // (unique) identifier of the query
            var query = {
                filter_string : filterString,
                sort : sortString,
                filters : _filters,
                start_record : startRecord,
                number_records : numberRecords
            }
            var queryHash = _queryHash(query);

            // retrieves the current timestamp as the identifier
            // for the current request (assumes uniqueness)
            var identifier = new Date().getTime();

            // sets the current request identifier in the
            // matched object this is going to be used later
            // to identify if the request pending is the same
            // or if a new request has come in between
            matchedObject.data("current", identifier)

            // retrieves the cache structure for the matched object
            // and tries to find the result from the cache in case
            // their found calls the callback immediately with them
            var cache = matchedObject.data("cache") || {};
            var cacheItem = cache[queryHash];
            if (cacheItem) {
                callback(cacheItem.validItems, cacheItem.moreItems,
                        cacheItem.extraItems);
                return;
            }

            // sets a timeout for the request to be performed, this
            // timeout will allow the performing of a delayed request
            // (ths way resource usage is minimized)
            setTimeout(function() {
                // retrieves the current identifier from the
                // matched object and checks it against the
                // clojure based identifier in case it's not
                // the same (the current request is not the
                // latest no need to perform it)
                var current = matchedObject.data("current");
                if (current != identifier) {
                    // returns immediately not going to perform
                    // the request (not required)
                    return;
                }

                // iterates over all the data components to
                // be added (custom query) and adds the items
                // to the current query, this is a query extension
                for (var key in data) {
                    query[key] = data[key];
                }

                // executes the remote ajax call, with the provided
                // query and for the defined url
                jQuery.ajax({
                            url : url,
                            dataType : "text",
                            data : query,
                            error : function(request, status, error) {
                                // retrieves the current identifier from the
                                // matched object and checks it against the
                                // clojure based identifier in case it's not
                                // the same (the current response is not the
                                // latest no need to parse it)
                                var current = matchedObject.data("current");
                                if (current != identifier) {
                                    // returns immediately not going to parse
                                    // the response (not required)
                                    return;
                                }

                                // retrieves the body
                                var _body = jQuery("body");

                                // shows an info window about the problem retrieving
                                // the data from the remote data source
                                _body.uxinfo(
                                        "There was an error retrieving json data",
                                        "Warning", "warning");

                                // calls the callback with the failure values
                                callback(null, null);
                            },
                            success : function(data) {
                                // parses the data, retrieving the valid items
                                var validItems = jQuery.parseJSON(data);
                                var extraItems = validItems;

                                // in case the received (items) is not a list
                                // (single retrieval)
                                if (!(validItems.constructor == Array)) {
                                    // tries to retrieve the (private) base
                                    // values that will serve as prototype for
                                    // the retrieval of the valid items
                                    var baseValue = validItems._base;

                                    // constructs a list of valid items
                                    // from the single valid item
                                    validItems = baseValue
                                            ? validItems[baseValue]
                                            : [validItems];
                                }

                                // retrieves the valid items length to check if there
                                // is more items available
                                var validItemsLength = validItems.length;
                                var moreItems = validItemsLength == numberRecords;

                                // filters the valid valid items using the calculated
                                // end slice to filter the "extra" items
                                var endSlice = numberRecords ? numberRecords
                                        - 1 : 1;
                                validItems = validItems.slice(0, endSlice);

                                // retrieves the current cache structure and updates
                                // it with the newly found item, indexing it by the
                                // (representing) query hash value, note that if the
                                // cache disable flag is set no value is set in cache
                                var cache = matchedObject.data("cache") || {};
                                cache[queryHash] = cacheD ? null : {
                                    validItems : validItems,
                                    moreItems : moreItems,
                                    extraItems : extraItems
                                };

                                // retrieves the current identifier from the
                                // matched object and checks it against the
                                // clojure based identifier in case it's not
                                // the same (the current response is not the
                                // latest no call the callback for it)
                                var current = matchedObject.data("current");
                                if (current != identifier) {
                                    // returns immediately not going to send
                                    // the response (not required)
                                    return;
                                }

                                // calls the callback with the valid items
                                // note that extra items are applied
                                callback(validItems, moreItems, extraItems);
                            }
                        });
            }, timeout);
        };

        var _queryHash = function(query) {
            // retrieves the various components of the query to
            // be used to construct the query string and run the
            // hash function on it
            var filterString = query.filter_string;
            var sort = query.sort;
            var filters = query.filters;
            var startRecord = query.start_record;
            var numberRecords = query.number_records;

            // joins the various filter string to create a complete
            // filter string
            var _filters = filters.join();

            // creates the final query string from the various components
            // of the query and creates the digest for it returning it to
            // the caller function
            var queryString = filterString + sort + _filters
                    + String(startRecord) + String(numberRecords);
            var hash = Md5.digest(queryString);
            return hash;
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
