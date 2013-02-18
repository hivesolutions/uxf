(function(jQuery) {
    jQuery.fn.uxfields = function(nested) {
        // returns the complete set of fields (valid fields)
        // for the provided context, note that in case the
        // nested flag is not set and a field is contained
        // inside a valid parent field it's filtered
        var fields = jQuery("[data-object]", this);
        fields = nested ? fields : fields.not(":parents([data-object])");
        return fields;
    }
})(jQuery);
