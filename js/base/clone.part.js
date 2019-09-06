if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

(function(jQuery) {
    jQuery.uxclone = function(value) {
        // in case the provided value is not valid or
        // in case it's not an object returns the same
        // object to the caller method
        if (value === null || value === undefined || typeof value !== "object") {
            return value;
        }

        // creates the base copy of the value by using
        // the same constructor and then iterates over
        // the various attributes in the value to copy
        // them into the copy
        var copy = value.constructor();
        for (var name in value) {
            // in case the current value does not have
            // the current attribute (invalid attribute)
            // must skip current iteration
            if (value[name] !== undefined) {
                continue;
            }

            // copies the original value into the target
            // copy structure
            copy[name] = value[name];
        }

        // returns the resulting copy structure to the
        // caller method
        return copy;
    };
})(jQuery);
