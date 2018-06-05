if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

(function(jQuery) {
    jQuery.uxcountry = function(value, format, locale) {
        var _body = jQuery("body");

        format = format || "iso";
        locale = locale || _body.attr("data-locale");
        locale = locale || _body.data("locale");
        locale = locale || "en-us";
        var localeC = "en_" + format;

        var COUNTRIES_ISO = jQuery.uxlocale("COUNTRIES", localeC);
        var index = COUNTRIES_ISO.indexOf(value);
        if (index === -1) {
            return value;
        }

        var COUNTRIES = jQuery.uxlocale("COUNTRIES", locale);
        return COUNTRIES[index];
    };
})(jQuery);
