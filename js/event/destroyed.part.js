(function(jQuery) {
    jQuery.event.special.destroyed = {
        remove : function(object) {
            if (object.handler) {
                object.handler()
            }
        }
    }
})(jQuery);
