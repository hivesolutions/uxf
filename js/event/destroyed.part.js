if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

(function(jQuery) {
    jQuery.event.special.destroyed = {
        remove: function(object) {
            if (object.handler) {
                object.handler();
            }
        }
    };
})(jQuery);
