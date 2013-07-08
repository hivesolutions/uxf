(function(jQuery) {

    /**
     * The map of symbols associating the value with a map containing all of its
     * localized values.
     */
    var SYMBOLS = {};

    jQuery.uxlocale = function(string, locale) {
        var _body = jQuery("body");

        locale = locale || _body.attr("data-locale");
        locale = locale || _body.data("locale");
        locale = locale || "en-us";

        var locales = SYMBOLS[string] || {};
        var stringLocale = locales[locale] || string;

        return stringLocale;
    };

    jQuery.uxloadbundle = function(bundle, locale) {
        for (var key in bundle) {
            var value = bundle[key];
            var values = SYMBOLS[key] || {};

            values[locale] = value;
            SYMBOLS[key] = values;
        }
    };
})(jQuery);
