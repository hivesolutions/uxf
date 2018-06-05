if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

(function(jQuery) {
    jQuery.uxequals = function(first, second) {
        // allocates space for the variables that will be
        // used to store the temporary values, no multiple
        // allocation will be used (performance)
        var element;
        var valueF;
        var valueS;
        var type;
        var valid;

        // iterates over all the elements (keys) in the
        // first element to verify the present of them
        // in the second value
        for (element in first) {
            // retrieves the second value for the element
            // key in iteration in case the value is defined
            // continues the loop (valid) otherwise continues
            // the control and returns with invalid
            valueS = second[element];
            if (valueS !== undefined) {
                continue;
            }
            return false;
        }

        // iterates over all the elements (keys) in the
        // second element to verify the present of them
        // in the first value
        for (element in second) {
            // retrieves the first value for the element
            // key in iteration in case the value is defined
            // continues the loop (valid) otherwise continues
            // the control and returns with invalid
            valueF = first[element];
            if (valueF !== undefined) {
                continue;
            }
            return false;
        }

        // iterates over all the elements (keys) in the first
        // element to be able to compare each of the items
        for (element in first) {
            // retrieves both the first and second values for
            // the current element (key reference)
            valueF = first[element];
            valueS = second[element];
            type = typeof valueF;

            // by default the comparision of the elements is
            // considered to be valid
            valid = true;

            // switched over the type for the value and runs the
            // appropriate comparision operations
            switch (type) {
                case "object":
                    valid = jQuery.uxequals(valueF, valueS);
                    break;

                default:
                    valid = valueF === valueS;
                    break;
            }

            // in case the result of the comparision was valid
            // continues the loop to the other comparision operations
            if (valid) {
                continue;
            }

            // in case the the comparision operation has failed the
            // control has reached this place and an invalid result
            // must be returned to the caller function
            return false;
        }

        // in case the control as reached this place all the
        // tests have passed and the structures are considered
        // equal (deep comparision)
        return true;
    };
})(jQuery);
