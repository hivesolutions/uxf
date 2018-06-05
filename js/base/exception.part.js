if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

(function(jQuery) {
    jQuery.uxexception = function(message) {
        return {
            message: message
        };
    };
})(jQuery);
