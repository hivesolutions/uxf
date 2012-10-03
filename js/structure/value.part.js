(function($) {
    jQuery.fn.uxvalue = function() {
        // sets the jquery matched object
        var matchedObject = this;

        // retrieves the object (type) for the currently
        // matched object then uses it to contruct the method
        // name to be used and uses it to retrieve the the
        // value for the component
        var object = matchedObject.attr("data-object");
        var method = matchedObject["ux" + object]
        var value = method ? method.call(matchedObject, "value") : null;

        // returns the just retrived value from the component
        // to the caller method
        return value;
    }
})(jQuery);
