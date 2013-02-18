(function(jQuery) {
    jQuery.fn.uxsource = function(query, callback, options) {
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
            // iterates over each of the matched object
            // to create the various data source functions
            matchedObject.each(function(index, element) {
                        // retrieves the current element
                        var _element = jQuery(this);

                        // retrieves the name to be used in the created
                        // source for the element
                        var name = _element.attr("data-name");

                        // retrieves the various child list items to
                        // be parsed and creates the list structure that
                        // will hold them in such case
                        var items = jQuery("> li", _element);
                        var _items = [];

                        // iterates over each of the items to construct
                        // the various structures
                        items.each(function(index, element) {
                                    // retrieves the current item in iteration
                                    var item = jQuery(this);

                                    // retrieves both the name and the value
                                    // of the current item in iteration
                                    var name = item.attr("data-name")
                                            || item.html();
                                    var value = item.html();

                                    // creates the item structure with the name
                                    // and the value set
                                    _item = {
                                        "name" : name,
                                        "value" : value
                                    };

                                    // adds the item to the "logical" list
                                    // containing the various items
                                    _items.push(_item);
                                });

                        // creates the jquery function associated with the
                        // newly created data souce function
                        jQuery.fn["uxdatasource" + name] = _dataSource(_items);
                    });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
        };

        var _dataSource = function(items) {
            var _function = function(options) {
                // sets the matched object as the current context
                // value (instance)
                var matchedObject = this;

                // iterates over all the elements in the matched
                // to be able to create the various item data sources
                matchedObject.each(function(index, element) {
                            // retrievs the current element in iteration to
                            // update it with the proper generalized data source
                            var _element = jQuery(this);

                            // updates the items data in the current element
                            // ands runs the initializer of the items data
                            // source extension
                            _element.data("items", items);
                            _element.uxdatasourceitems();
                        });
            };

            return _function;
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
