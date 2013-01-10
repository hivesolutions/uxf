(function($) {
    jQuery.fn.uxfields = function() {
        // returns the complete set of fields (valid fields)
        // for the provided context
        return jQuery("[data-object]", this)
    }
})(jQuery);
