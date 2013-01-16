(function($) {
    jQuery.uxequals = function(first, second) {
        // allocates space for the variables that will be
        // used to store the temporary values, no multiple
        // allocation will be used (performance)
        var element;
        var valueF;
        var valueS;
        var type;

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
            type = typeof(valueF);

            // switched over the type for the value and runs the
            // appropriate comparision operations
            switch (type) {
                case "object" :
                    if (!jQuery.uxequals(valueF, valueS)) {
                        return false;
                    }

                    break;

                default :
                    if (valueF !== valueS) {
                        return false;
                    }

                    break;
            }
        }

        // in case the control as reached this place all the
        // tests have passed and the structures are considered
        // equal (deep comparision)
        return true;
    };
})(jQuery);
