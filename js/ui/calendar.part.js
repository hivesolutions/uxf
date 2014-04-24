/**
 * jQuery calendar plugin, this jQuery plugin provides the base infra-structure
 * for the creation of a calendar component.
 *
 * @name jquery-calendar.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @date March 10, 2010
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2014 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxcalendar = function(method, options) {
        // the list of week days in english language
        var WEEK_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

        // the list of year month in english language
        var YEAR_MONTHS = ["January", "February", "March", "April", "May",
                "June", "July", "August", "September", "October", "November",
                "December"];

        // the (maximum) number of days in the calendar
        var NUMBER_DAYS = 42;

        // the default values for the text field
        var defaults = {};

        // sets the default method value
        var method = method ? method : "default";

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
            // creates the week days string (with the initial
            // table row string)
            var weekDaysString = "<tr>";

            // iterates over all the week days to add them to the week
            // days string
            for (var index = 0; index < WEEK_DAYS.length; index++) {
                // retrieves the current week day and localizes the
                // value into the proper locale
                var weekDay = WEEK_DAYS[index];
                weekDay = jQuery.uxlocale(weekDay);

                // adds the week day partial string to the week days string
                weekDaysString += "<th><span>" + weekDay + "</span></th>";
            }

            // finishes the week days string
            weekDaysString += "</tr>"

            // adds the calendar header component to the matched object
            matchedObject.append("<div class=\"calendar-header\">"
                    + "<a class=\"calendar-arrow calendar-arrow-left\"></a>"
                    + "<span class=\"calendar-title\"></span>"
                    + "<a class=\"calendar-arrow calendar-arrow-right\"></a>"
                    + "</div>");

            // adds the calendar content component to the matched object
            matchedObject.append("<table class=\"calendar-content\">"
                    + "<thead>" + weekDaysString + "</thead>"
                    + "<tbody></tbody>" + "</table>");

            // creates a new date object to retrieve
            // the current year, month and day
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();

            // creates the initial current (day) reference object
            var current = {
                year : year,
                month : month,
                day : day
            };

            // sets the year and the month in the matched
            // object data
            matchedObject.data("year", year);
            matchedObject.data("month", month);

            // sets the current day object in the matched
            // object
            matchedObject.data("current", current);

            // updates the value for the matched object
            _update(matchedObject, options);
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the arrow from the matched object
            var arrowLeft = jQuery(".calendar-arrow-left", matchedObject);
            var arrowRight = jQuery(".calendar-arrow-right", matchedObject);

            // registers for the click event the arrow left
            arrowLeft.click(function() {
                        // retrievs the element
                        var element = jQuery(this);

                        // retrieves the calendar for the element
                        var calendar = element.parents(".calendar");

                        // decrements the month for the calendar
                        _decrementMonth(calendar, options);
                    });

            // registers for the click event the arrow right
            arrowRight.click(function() {
                        // retrievs the element
                        var element = jQuery(this);

                        // retrieves the calendar for the element
                        var calendar = element.parents(".calendar");

                        // increments the month for the calendar
                        _incrementMonth(calendar, options);
                    });
        };

        /**
         * Sets a new "current" value in the calendar, after the set is done a
         * visual update is run to ensure that the modifications are reflected
         * in the ui.
         *
         * @param {Element}
         *            matchedObject The reference to the current matched object.
         * @param {Map}
         *            options The map of options to be used.
         */
        var _set = function(matchedObject, options) {
            // retrieves the "new" current value for the calendar
            var current = options["current"];

            // unpacks the current value into year and month
            var year = current["year"];
            var month = current["month"]

            // updates the year and month values
            // in the matched object
            matchedObject.data("year", year);
            matchedObject.data("month", month);

            // updates the current value in the matched object
            matchedObject.data("current", current);

            // updates the matched object state, updating
            // the visual state
            _update(matchedObject, options);
        };

        /**
         * Resets the state of the calendar to the state defined in the current
         * state. The ui of the calendar will reflect the changes.
         *
         * @param {Element}
         *            matchedObject The reference to the current matched object.
         * @param {Map}
         *            options The map of options to be used.
         */
        var _reset = function(matchedObject, options) {
            // retrieves the current value from the
            // matched object
            var current = matchedObject.data("current");

            // unpacks the current value into year and month
            var year = current["year"];
            var month = current["month"]

            // updates the year and month values
            // in the matched object
            matchedObject.data("year", year);
            matchedObject.data("month", month);

            // updates the matched object state, updating
            // the visual state
            _update(matchedObject, options);
        };

        /**
         * Updates the state of the calendar, updating the month values and the
         * header title.
         *
         * @param {Element}
         *            matchedObject The reference to the current matched object.
         * @param {Map}
         *            options The map of options to be used.
         */
        var _update = function(matchedObject, options) {
            // in case the matched object does not contains any
            // elements (empty matched object)
            if (matchedObject.length == 0) {
                // returns immediately (nothing to be done)
                return;
            }

            // retrieves the current (viewable) year
            // and month values
            var year = matchedObject.data("year");
            var month = matchedObject.data("month") - 1;

            // retrieves the current (day) from the calendar
            var current = matchedObject.data("current");

            // unpacks the current day into year, month
            // and day
            var currentDayYear = current["year"];
            var currentDayMonth = current["month"] - 1;
            var currentDayNumber = current["day"];

            // creates the dates for the initial and the final
            // day of the month
            var initialDay = new Date(year, month, 1);
            var finalDay = new Date(year, month + 1, 0);

            // retrieve the dates for the final day of the previous
            // month and the initial day of the next month
            var finalDayPrevious = new Date(year, month, 0);
            var intialDayNext = new Date(year, month + 1, 1);

            // retrieves the week day of the initial day of
            // the current month and the month date of the
            // final day of the current and previous months
            var initialDayWeek = initialDay.getDay();
            var finalDayNumber = finalDay.getDate();
            var finalDayPreviousNumber = finalDayPrevious.getDate();

            // retrieves the previous year and the previous month
            var previousYear = finalDayPrevious.getFullYear();
            var previousMonth = finalDayPrevious.getMonth();

            // retrieves the next year and the next month
            var nextYear = intialDayNext.getFullYear();
            var nextMonth = intialDayNext.getMonth();

            // creates the initial list of days
            var days = []

            // iterates over all the final days of the previous month
            for (var index = 0; index < initialDayWeek; index++) {
                // calculates the (current) previous day from the final day
                // of the previous month, the initial week day and the index
                var previousDay = finalDayPreviousNumber
                        - (initialDayWeek - index) + 1;

                // in case the (current) previous day is the currently select day
                if (previousYear == currentDayYear
                        && previousMonth == currentDayMonth
                        && previousDay == currentDayNumber) {
                    // adds the day tuple with the active class in it
                    days.push([previousYear, previousMonth, previousDay,
                            "faded active"]);
                }
                // otherwise it's just a "normal" day
                else {
                    // adds the day tuple
                    days.push([previousYear, previousMonth, previousDay,
                            "faded"]);
                }
            }

            // iterates over all the days of the current month
            for (var index = 0; index < finalDayNumber; index++) {
                // calculates the (current) day
                var day = index + 1;

                // in case the (current) day is the currently select day
                if (year == currentDayYear && month == currentDayMonth
                        && day == currentDayNumber) {
                    // adds the day tuple with the active class in it
                    days.push([year, month, day, "active"]);
                }
                // otherwise it's just a "normal" day
                else {
                    // adds the day tuple
                    days.push([year, month, day, ""]);
                }
            }

            // "takes" a snapshot at the current length
            // of the days list for "extra" days calculus
            var daysLength = days.length;

            for (var index = daysLength; index < NUMBER_DAYS; index++) {
                // calculates the (current) next day from the days length
                // and the current index
                var nextDay = index - daysLength + 1;

                // in case the (current) next day is the currently select day
                if (nextYear == currentDayYear && nextMonth == currentDayMonth
                        && nextDay == currentDayNumber) {
                    // adds the day tuple with the active class in it
                    days.push([nextYear, nextMonth, nextDay, "faded active"]);
                }
                // otherwise it's just a "normal" day
                else {
                    // adds the day tuple
                    days.push([nextYear, nextMonth, nextDay, "faded"]);
                }
            }

            // starts the html code string
            var htmlCode = "";

            // unsets the line open flag
            var lineOpen = false;

            // iterates over all the days created in the days list
            for (var index = 0; index < days.length; index++) {
                // checks if the current cell is of type
                // start (line) cell (end/start of week)
                var isStartCell = index % 7 == 0;

                // in case the current cell is of type
                // start cell (end/start of week)
                if (isStartCell) {
                    // in case there is a line open
                    if (lineOpen) {
                        // adds the close line tag to the
                        // html code
                        htmlCode += "</tr>"
                    }
                    // otherwise it must be the first line
                    else {
                        // sets the line open flag
                        lineOpen = true;
                    }

                    // adds the open line tag to the
                    // html code
                    htmlCode += "<tr>";
                }

                // retrieves the current day tuple
                // from the list of days
                var dayTuple = days[index];

                // unpacks the day tuple into year,
                // month, day and day class
                var _year = dayTuple[0];
                var _month = dayTuple[1];
                var _day = dayTuple[2];
                var dayClass = dayTuple[3];

                // adds the cell code to the html code string
                htmlCode += "<td class=\"" + dayClass + "\" data-year=\""
                        + _year + "\" data-month=\"" + _month
                        + "\" data-day=\"" + _day + "\" >" + _day + "</td>";
            }

            // in case there is a line (still) open
            if (lineOpen) {
                // adds the close line tag to the
                // html code
                htmlCode += "</tr>";
            }

            // retrieves the table body (contents area) and
            // clears it
            var tableBody = jQuery("tbody", matchedObject);
            tableBody.empty();

            // adds the (generated) html code to the table body
            tableBody.append(htmlCode);

            // retrieves the year month values and then localizes the
            // value into the proper locale
            var yearMonth = YEAR_MONTHS[month];
            yearMonth = jQuery.uxlocale(yearMonth);

            // retrieves the calendar title and updates it
            // accordingly
            var title = jQuery(".calendar-title", matchedObject);
            title.html(yearMonth + " " + String(year));

            // updates the (cell) handlers in the matched object
            _updateHandlers(matchedObject, options);
        };

        var _incrementMonth = function(matchedObject, options) {
            // sets the calendar as the matched object
            var calendar = matchedObject;

            // retrieves the (current) year and month from the calendar
            var year = matchedObject.data("year");
            var month = matchedObject.data("month");

            // in case the final month is the current month
            if (month == 12) {
                // increments the year value and sets the
                // month value as the first month
                year++;
                month = 1;
            }
            // otherwise a different month is set
            else {
                // increments the month value
                month++;
            }

            // sets the year and the month in the
            // calendar data
            calendar.data("year", year);
            calendar.data("month", month);

            // updates the value for the calendar
            _update(calendar, options);
        };

        var _decrementMonth = function(matchedObject, options) {
            // sets the calendar as the matched object
            var calendar = matchedObject;

            // retrieves the (current) year and month from the calendar
            var year = matchedObject.data("year");
            var month = matchedObject.data("month");

            // in case the first month is the current month
            if (month == 1) {
                // decrements the year value and sets the
                // month value as the last month
                year--;
                month = 12;
            }
            // otherwise a different month is set
            else {
                // decrements the month value
                month--;
            }

            // sets the year and the month in the
            // calendar data
            calendar.data("year", year);
            calendar.data("month", month);

            // updates the value for the calendar
            _update(calendar, options);
        };

        var _updateHandlers = function(matchedObject, options) {
            // retrieves all the (valid) cells from the matched object
            var cells = jQuery("tbody td", matchedObject);

            // registrs for the click event in the cells
            cells.click(function() {
                        // retrieves the element
                        var element = jQuery(this);

                        // retrieves the calendar for the element
                        var calendar = element.parents(".calendar");

                        // retrieves all the (valid) cells from the calendar
                        var cells = jQuery("tbody td", calendar);

                        // retrieves the various day elements from
                        // the current element and then parses them
                        // into integer values
                        var year = element.attr("data-year");
                        var month = element.attr("data-month");
                        var day = element.attr("data-day");
                        var yearInteger = parseInt(year);
                        var monthInteger = parseInt(month) + 1;
                        var dayInteger = parseInt(day);

                        // creates the new current day reference object
                        var current = {
                            year : yearInteger,
                            month : monthInteger,
                            day : dayInteger
                        };

                        // updates the current (day) value
                        // in the calendar
                        calendar.data("current", current);

                        // removes the active class from all
                        // the cells and then adds the active
                        // class only to the clicked one
                        cells.removeClass("active");
                        element.addClass("active");

                        // triggers the current change event
                        calendar.triggerHandler("current_change", [current]);
                    });
        };

        // switches over the method
        switch (method) {
            case "set" :
                // sets the new current value in the matched object
                _set(matchedObject, options);

                // breaks the switch
                break;

            case "reset" :
                // resets the matched object to the value
                // in the current state
                _reset(matchedObject, options);

                // breaks the switch
                break;

            case "default" :
                // initializes the plugin
                initialize();

                // breaks the switch
                break;
        }

        // returns the object
        return this;
    };
})(jQuery);
