if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

(function(jQuery) {
    jQuery.fn.uxcursor = function(position, options) {
        // the default values for the next
        var defaults = {};

        // sets the default options value
        options = options || {};

        // constructs the options
        options = jQuery.extend(defaults, options);

        // sets the jquery matched object and retrieves
        // the first element from it
        var matchedObject = this;
        var firstElement = matchedObject.get(0);

        // in case the set selection range function
        // is available
        if (firstElement.setSelectionRange) {
            // sets the element selection range
            firstElement.setSelectionRange(position, position);
        }
        // otherwise in case create text range function
        // is available
        else if (firstElement.createTextRange) {
            // creates a new text range
            var range = firstElement.createTextRange();

            // collapses the range and moves the character
            // to the appropriate position
            range.collapse(true);
            range.moveEnd("character", position);
            range.moveStart("character", position);

            // selects the range
            range.select();
        }

        // returns the object
        return this;
    };
})(jQuery);
