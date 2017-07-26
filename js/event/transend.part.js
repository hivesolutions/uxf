(function(jQuery) {
    jQuery.fn.uxtransend = function(property, callback) {
        // retrieves the currently defined context as the matched
        // object this should be used for the verification operation
        var matchedObject = this;

        // iterates over the complete set of matched objects
        // to register for the transition end for such transition
        // in case there's no transition defined the callback
        // function is called immediately instead
        matchedObject.each(function() {
            // retrieves the current element in iteration and
            // runs the transition property base verification in case
            // there's no transition registered with the requested
            // property the callback is called immediately
            var element = jQuery(this);
            var propertyS = element.css("transition-property");
            var propertys = propertyS.split(",")
            if (property && propertys.indexOf(property) === -1) {
                callback.call(this);
                return;
            }

            // creates the callback function that is going to be
            // called at the end of the transition event
            var onEnd = function(event) {
                var element = jQuery(this);
                var _property = event.originalEvent.propertyName;
                var isValid = property === _property || !property;
                if (!isValid) {
                    return;
                }
                callback.call(this);
                element.unbind("transitionend", onEnd);
            };

            // registers for the transition end event note that
            // the callback is only called in case the property based
            // event verification passes
            element.bind("transitionend", onEnd);
        });

        // returns the current context to the caller so that it may be used
        // for chained based calling
        return this;
    };
})(jQuery);
