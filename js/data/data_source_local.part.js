(function(jQuery) {
    jQuery.fn.uxdatasourcelocal = function(options) {
        // the default values for the data source local
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
            // iterates over all the elements in the matched object
            matchedObject.each(function(index, element) {
                // retrieves the element reference
                var _element = jQuery(element);

                // updates the query element
                _updateQueryElement(_element, options);
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {};

        /**
         * Retrieves the sub-elements for the given element. The structure to be
         * returned may be a map or a list depending on the type of internal dom
         * structure of the element.
         *
         * @param {Element}
         *            element The element to be used to retrieve the
         *            sub-elements structure.
         * @return {List/Map} The created sub-elements structure.
         */
        var _getElements = function(element) {
            // retrieves the element children
            var elementChildren = element.children();

            // retrieves the name attribute for the element
            // children to check if the structure is a list
            // or a structured map
            var nameAttribute = elementChildren.attr("name");

            // checks the data structure to be used and
            // creates it accordingly
            var isList = nameAttribute === undefined;
            var dataStructure = isList ? [] : {};

            // iterates over all the children of the element
            // to populate the data structure
            elementChildren.each(function(index, element) {
                // retrieves the element reference
                var _element = jQuery(element);

                // retrieves the children of the element
                // to check if the element contains children
                var children = _element.children();
                var containsChildren = children.length > 0;

                // in case the element contains children
                if (containsChildren) {
                    // retrieves the "composite" element value
                    var elementValue = _getElements(_element);
                }
                // otherwise there are no children and
                // the ement contents must be directly
                // processed
                else {
                    // retrieves the element value directly
                    // from the element contents
                    var elementValue = _element.text();
                }

                // in case the data structure is a list
                if (isList) {
                    // adds the element value to the
                    // data structure (list)
                    dataStructure.push(elementValue);
                }
                // otherwise the data structure must be a map
                else {
                    // retrieves the element name and sets
                    // the element value in the data structure
                    // for the element name
                    var elementName = _element.attr("name");
                    dataStructure[elementName] = elementValue;
                }
            });

            // returns the (created) data structure
            return dataStructure;
        };

        var _updateQueryElement = function(element, options) {
            // retrieves the elements (items)
            // for the element
            var items = _getElements(element);

            // checks if the no remove class (flag) is set
            var noRemove = element.hasClass("no-remove");

            // empties the element (no need to
            // hold all the elements in dom)
            !noRemove && element.empty();

            // updates the element data
            element.data("type", "local");
            element.data("items", items);
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
