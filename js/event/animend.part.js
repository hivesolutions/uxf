(function(jQuery) {
    jQuery.fn.uxanimend = function(name, callback) {
        // retrieves the currently defined context as the matched
        // object this should be used for the verification operation
        var matchedObject = this;

        // iterates over the complete set of matched objects
        // to register for the animation end for such animation
        // in case there's no animation defined the callback
        // function is called immediately instead
        matchedObject.each(function() {
            // retrieves the current element in iteration and
            // runs the animation name base verification in case
            // there's no animation registered with the requested
            // name the callback is called immediately
            var element = jQuery(this);
            var nameS = element.css("animation-name");
            var names = nameS.split(",")
            if (name && names.indexOf(name) == -1) {
                callback.call(this);
                return;
            }

            // creates the callback function that is going to be
            // called at the end of the animation event
            var onEnd = function(event) {
                var element = jQuery(this);
                var _name = event.originalEvent.animationName;
                var isValid = name == _name || !name;
                if (!isValid) {
                    return;
                }
                callback.call(this);
                element.unbind("animationend", onEnd);
            }

            // registers for the animation end event note that
            // the callback is only called in case the name based
            // event verification passes
            element.bind("animationend", onEnd);
        });

        // returns the current context to the caller so that it may be used
        // for chained based calling
        return this;
    };
})(jQuery);
