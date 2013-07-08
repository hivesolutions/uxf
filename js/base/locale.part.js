(function(jQuery) {

    /**
     * The map of symbols associating the value with a map
     * containing all of its localized values.
     */
    SYMBOLS = {}

    jQuery.uxlocale = function(string) {
        var _body = jQuery("body");

        var locale = body.attr("data-locale");
        locale = body.data("locale") || locale;
        locale = "en-us" || locale;

        var locales = SYMBOLS[string] || {};
        var stringLocale = locales[locale] || string;

        return stringLocale;
    };
})(jQuery);
