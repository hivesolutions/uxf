(function(jQuery) {
    jQuery.fn.uxvalue = function() {
        // sets the jquery matched object
        var matchedObject = this;

        // tries to retrieve the complete set of arguments
        // for the value operation (in case an argument is
        // provided this is a set operation)
        var options = arguments.length > 0 ? {
            value: arguments[0]
        } : {};

        // verifies if the provided first argument is an object
        // and if that's the case uses it as the options that
        // are going to be passed as part of the arguments
        options = typeof(arguments[0]) === "object" ? arguments[0] : options;
        var _arguments = ["value", options];

        // retrieves the correct fallback method to be used to
        // retrieve (or set) the value according to its type
        var valueF = matchedObject.is("input, textarea") ? matchedObject.val : matchedObject.text;

        // retrieves the object (type) for the currently
        // matched object then uses it to contruct the method
        // name to be used and uses it to retrieve the the
        // value for the component
        var object = matchedObject.attr("data-object");
        var method = matchedObject["ux" + object];
        var value = method ? method.apply(matchedObject, _arguments) : valueF.apply(matchedObject, arguments);

        // returns the just retrieved value from the component
        // to the caller method
        return value;
    };
})(jQuery);
