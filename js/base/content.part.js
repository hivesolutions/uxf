if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

(function(jQuery) {
    jQuery.fn.uxcontent = function(value, method) {
        var element = jQuery(this);
        var other = element.clone();
        var children = other.children();
        children.remove();

        method = method || "html";

        if (typeof value === "string") {
            other[method](value);
            element[method](children);
            element.prepend(value);
        }

        return other[method]();
    };
})(jQuery);
