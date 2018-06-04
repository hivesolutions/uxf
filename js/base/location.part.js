(function(jQuery) {
    jQuery.uxlocation = function(location) {
        var body = jQuery("body");
        var result = body.triggerHandler("location", [location]);
        if (result === false) {
            return;
        }
        document.location = location;
    };
})(jQuery);
