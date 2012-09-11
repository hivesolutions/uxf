(function($) {
    jQuery.fn.uxdataqueryjson = function(query, callback, options) {
        // the default timeout to be used in the request
        // (this value is used to delay the request)
        var DEFAULT_TIMEOUT = 250;

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
            var sort = query["sort"];

            // retrieves the filter tuples to be used to filter
            // the result set around certain rules
            var filters = query["filters"];

            // retrieves the record count information
            var startRecord = query["startRecord"];
            var numberRecords = query["numberRecords"];

            // unpacks the sort value and the sort oder from the
            // sort tuple and uses them to create the "final" sort
            // string to be used in the query string
            var sortValue = sort[0];
            var sortOrder = sort[1];
            var sortString = sortValue + ":" + sortOrder;

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

            // retrieves the element url
            var url = element.data("url");

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

            // retrieves the current timestamp as the identifier
            // for the current request (assumes uniqueness)
            var identifier = new Date().getTime();

            // sets the current request identifier in the
            // matched object this is going to be used later
            // to identify if the request pending is the same
            // or if a new request has come in between
            matchedObject.data("current", identifier)

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

                // executes the remote ajax call
                jQuery.ajax({
                    url : url,
                    dataType : "text",
                    data : {
                        filter_string : filterString,
                        sort : sortString,
                        filters : _filters,
                        start_record : startRecord,
                        number_records : numberRecords
                    },
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

                        // shows an alert window about the error
                        _body.uxalert("There was an error retrieving json data");

                        // calls the callback with the failure values
                        callback(null, null);
                    },
                    success : function(data) {
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

                        // parses the data, retriebing the valid items
                        var validItems = jQuery.parseJSON(data);

                        // in case the received (items) is not a list
                        // (single retrieval)
                        if (!(validItems.constructor == Array)) {
                            // constructs a list of valid items
                            // from the single valid item
                            validItems = [validItems];
                        }

                        // retrieves the valid items length to check if there
                        // is more items available
                        var validItemsLength = validItems.length;
                        var moreItems = validItemsLength == numberRecords;

                        // filters the valid valid items using the calculated
                        // end slice to filter the "extra" items
                        var endSlice = numberRecords ? numberRecords - 1 : 1;
                        validItems = validItems.slice(0, endSlice);

                        // calls the callback with the valid items
                        callback(validItems, moreItems);
                    }
                });
            }, timeout);
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
