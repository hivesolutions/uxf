(function(jQuery) {
    jQuery.fn.uxhoveringbox = function(options) {
        // the default values for the hovering box
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
            // registers for the mouse enter in the matched object
            matchedObject.mouseenter(function() {
                        // retrieves the element
                        var element = jQuery(this);

                        // schedules a show of the template
                        _scheduleTemplate(element, options);
                    });

            // registers for the mouse leave in the matched object
            matchedObject.mouseleave(function() {
                        // retrieves the element
                        var element = jQuery(this);

                        // cancels the show of the template
                        _cancelTemplate(element, options);
                    });
        };

        var _scheduleTemplate = function(matchedObject, options) {
            // retrieves the timeout handler for
            // the matched object
            var timeoutHandler = matchedObject.data("timeoutHandler");

            // in case there is already a
            // timeout handler (schedule pending)
            if (timeoutHandler) {
                // returns immediately
                return;
            }

            // sets the timeout for the showing of the
            // hovering box template
            var timeoutHandler = setTimeout(function() {
                        // showes the template for the given options
                        _showTemplate(matchedObject, options);

                        // unsets the timeout handler in the matched object
                        matchedObject.data("timeoutHandler", null);
                    }, 500);

            // sets the timeout handler in the matched object
            matchedObject.data("timeoutHandler", timeoutHandler);
        };

        var _cancelTemplate = function(matchedObject, options) {
            // retrieves the timeout handler for
            // the matched object
            var timeoutHandler = matchedObject.data("timeoutHandler");

            // in case there is already a
            // timeout handler (schedule pending)
            if (timeoutHandler) {
                // cancels (clears) the current timeout
                clearTimeout(timeoutHandler);

                // unsets the timeout handler in the matched object
                matchedObject.data("timeoutHandler", null);
            }

            // hides the template
            _hideTemplate(matchedObject, options);
        };

        var _containsTemplate = function(matchedObject, options) {
            // retrieves the hovering box template
            var hoveringBoxTemplate = jQuery(".hovering-box-template",
                    matchedObject);

            // checks if the hovering box already contains the template
            var containsTemplate = hoveringBoxTemplate.length > 0;

            // returns the result of the contains template flag
            return containsTemplate;
        };

        var _createTemplate = function(matchedObject, options) {
            // retrieves the id of the hovering
            // box (template) to be used
            var hoveringBoxId = matchedObject.attr("data-hovering-box-id");

            // retrieves the data source id
            var dataSourceId = matchedObject.attr("data-data-source-id");

            // converts the data source id to integer
            var dataSourceId = parseInt(dataSourceId)

            // retrieves the hovering box template and the data
            // source (elements)
            var hoveringBoxTemplate = jQuery("#" + hoveringBoxId);
            var dataSource = jQuery("> .data-source", hoveringBoxTemplate);

            // checks if the matched object contains the hovering
            // box right class (align the element to the right)
            var hoveringBoxRight = matchedObject.hasClass("hovering-box-right");

            // runs the query in the data source
            dataSource.uxdataquery({
                        id : dataSourceId
                    }, function(validItems, moreItems) {
                        // retrieves the current (and only)
                        // item from the list of valid items
                        var currentItem = validItems[0];

                        // applies the template to the hovering box
                        // template (item) retrieving the resulting
                        // template item
                        var templateItem = hoveringBoxTemplate.uxtemplate(currentItem);

                        // adds the template item item to the
                        // element (hovering box)
                        matchedObject.append(templateItem);

                        // in case the hovering box right flag
                        // is not set (no need to align to the right)
                        if (!hoveringBoxRight) {
                            // returns immediately
                            return;
                        }

                        // retrieves both the matched object width
                        // and the template item width
                        var matchedObjectWidth = matchedObject.outerWidth()
                        var templateItemWidth = templateItem.width();

                        // calculates the template item margin left
                        var templateItemMarginLeft = (templateItemWidth - matchedObjectWidth)
                                * -1;

                        // sets the template item margin left
                        templateItem.css("margin-left", templateItemMarginLeft
                                        + "px");
                    });
        };

        var _showTemplate = function(matchedObject, options) {
            // checks if the matched object already contains the template
            var containsTemplate = _containsTemplate(matchedObject, options);

            // in case the matched object does not contain already the template
            // creates it
            !containsTemplate && _createTemplate(matchedObject, options);

            // retrieves the hovering box template
            var hoveringBoxTemplate = jQuery(".hovering-box-template",
                    matchedObject);

            // hides the hovering box template
            hoveringBoxTemplate.show();
        };

        var _hideTemplate = function(matchedObject, options) {
            // retrieves the hovering box template
            var hoveringBoxTemplate = jQuery(".hovering-box-template",
                    matchedObject);

            // hides the hovering box template
            hoveringBoxTemplate.hide();
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
