if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

(function(jQuery) {
    jQuery.uxruntimeerror = function(message) {
        return {
            message: message
        };
    };
})(jQuery);
