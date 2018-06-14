if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

(function(jQuery) {
    jQuery.fn.uxcalendarrange = function(options) {
        // the default values for the data source
        var defaults = {};

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
            // localizes the various strings that are going to be used
            // in the construction of the calendar range component
            var startDate = jQuery.uxlocale("Start date");
            var endDate = jQuery.uxlocale("End date");
            var to = jQuery.uxlocale("to");

            // creates both the range and the calendar elements that
            // will be added to the currently matched object latter
            var rangeHtml =
                '<div class="range">' +
                '<input type="text" class="text-field start-date" data-original_value="' +
                startDate +
                '" />' +
                '<span class="range-separator">' +
                to +
                "</span>" +
                '<input type="text" class="text-field end-date" data-original_value="' +
                endDate +
                '" />' +
                "</div>";
            var calendarHtml = '<div class="calendar no-layout"></div>';

            // adds both the range and the calendar part of the
            // component to the inner part of it
            matchedObject.append(rangeHtml);
            matchedObject.append(calendarHtml);

            // retrieves the various text field element contained
            // in the range part of the component
            var range = jQuery(".range", matchedObject);
            var calendar = jQuery(".calendar", matchedObject);
            var textFields = jQuery(".text-field", range);

            // runs the initialization of the components that are
            // part of the calendar range
            textFields.uxtextfield();
            calendar.uxcalendar();

            // iterates over each of the elements to change their
            // internal values
            matchedObject.each(function(index, element) {
                // retrieves the current element and uses then
                // to retrieve the currently selected date range
                // values and names
                var _element = jQuery(this);
                var start = _element.attr("data-start");
                var end = _element.attr("data-end");
                var startName = _element.attr("data-start_name");
                var endName = _element.attr("data-end_name");

                // retrieves the reference to the start date and
                // end date text fields
                var startDate = jQuery(".start-date", _element);
                var endDate = jQuery(".end-date", _element);

                // updates the text fields with the proper start
                // and en data string values
                start && startDate.uxvalue(start);
                end && endDate.uxvalue(end);

                // changes the name attribute in both the start
                // and end date text fields to the defined ones
                startName && startDate.attr("name", startName);
                endName && endDate.attr("name", endName);
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves both the text fields and the calendar
            // elements for the current object
            var textFields = jQuery(".text-field", matchedObject);
            var calendar = jQuery(".calendar", matchedObject);

            // registers for the composite focus event on the various
            // text fields that compose the calendar range
            textFields.bind("_focus", function() {
                // retrieves the reference to the current element and uses
                // it to retrieve the associated calendar range and then
                // the associated calendar component
                var element = jQuery(this);
                var range = element.parents(".calendar-range");
                var calendar = jQuery(".calendar", range);

                // shows the calendar component as the text field
                // is focused it must be shown
                range.addClass("calendar-visible");

                // retrieves the input field value and parses it,
                // retrieving the corresponding timestamp
                var inputFieldValue = element.uxvalue();
                var timestamp = Date.parse(inputFieldValue);

                // in case the timestamp was not correctly
                // parsed (not a number)
                if (isNaN(timestamp)) {
                    // returns immediately
                    return;
                }

                // creates the date object from the timestamp
                // and then uses it to unpack the various date
                // values fro it (value decomposition)
                var date = new Date(timestamp);
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();

                // sets the calendar value to reflect
                // the text field value changes
                calendar.uxcalendar("set", {
                    current: {
                        year: year,
                        month: month,
                        day: day
                    }
                });
            });

            // registers for the composite blur event in the various
            // text fields that compose the calendar range
            textFields.bind("_blur", function() {
                // retrieves the reference to the current element and uses
                // it to retrieve the associated calendar range
                var element = jQuery(this);
                var range = element.parents(".calendar-range");

                // hides the calendar as it's no longer going to be used
                // because no text field is focused
                range.removeClass("calendar-visible");
            });

            // registers for the change of value in the text fields so that
            // the associated calendar component may be changed
            textFields.bind("value_change", function(event, inputFieldValue) {
                // retrieves the reference to the current element and uses
                // it to retrieve the associated calendar range and then
                // the associated calendar component
                var element = jQuery(this);
                var range = element.parents(".calendar-range");
                var calendar = jQuery(".calendar", range);

                // parses the input field value, retrieving
                // the corresponding timestamp
                var timestamp = Date.parse(inputFieldValue);

                // in case the timestamp was not correctly
                // parsed (not a number)
                if (isNaN(timestamp)) {
                    // returns immediately
                    return;
                }

                // creates the date object from the timestamp
                // and then uses it to unpack the various date
                // values fro it (value decomposition)
                var date = new Date(timestamp);
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();

                // sets the calendar value to reflect
                // the text field value changes
                calendar.uxcalendar("set", {
                    current: {
                        year: year,
                        month: month,
                        day: day
                    }
                });
            });

            // registers for the current value change in the calendar
            // component to change the associated text field
            calendar.bind("current_change", function(event, current) {
                // retrieves the current element and uses it to retrieve the
                // calendar range associated and then the focused text field
                var element = jQuery(this);
                var range = element.parents(".calendar-range");
                var focused = jQuery(".focus", range);

                // retrieves the date format defined in the calendar range
                // and uses it with the current map to retrieve the date string
                var format = range.attr("data-format") || "%Y/%m/%d";
                var dateString = jQuery.uxformat(current, format);

                // updates both the logical value and the real value, so that
                // the proper value is changed for the calendar
                focused.attr("data-value", dateString);
                focused.val(dateString);

                // triggers the value change event for the element
                // to notify the event handlers
                focused.triggerHandler("value_change", [dateString]);
            });

            // registers for the mouse down event on the calendar so
            // that it's possible to avoid the next blur event on it
            calendar.mousedown(function() {
                // retrieves the current element and uses it to retrieve
                // the associated calendar range and then uses it to retrieve
                /// the focused text field in order to avoid the next blur
                var element = jQuery(this);
                var range = element.parents(".calendar-range");
                var focused = jQuery(".focus", range);

                // set the element to avoid the next (blur)
                focused.data("avoid_next", true);
            });
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
