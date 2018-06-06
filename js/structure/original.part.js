if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

(function(jQuery) {
    jQuery.fn.uxoriginal = function() {
        // sets the jquery matched object
        var matchedObject = this;

        // iterates over all the elements that were selected
        // in order to perform the original operation in each of them
        matchedObject.each(function(index, element) {
            // retrieves the reference to the current
            // element for which the original operation will
            // be perfomed and the value set to the original
            var _element = jQuery(this);

            // retrieves the object (type) for the currently
            // matched object then uses it to construct the method
            // name to be used and uses it to restore the state of
            // the object to its original value, note that the reset
            // operation is unsed in case no original exists
            var object = _element.attr("data-object");
            var method = _element["ux" + object];
            var result = method ? method.call(_element, "original") : false;
            result !== true && method && method.call(_element, "reset");

            // triggers the original event on the current element indicating
            // that a original operation has been performed in it
            _element.triggerHandler("_original");
        });

        // returns the reference to the current context to
        // the caller object so that it may be "re-used"
        return this;
    };
})(jQuery);
