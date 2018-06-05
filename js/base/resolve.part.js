if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

(function(jQuery) {
    jQuery.uxresolve = function(url, baseUrl) {
        var doc = document;
        var oldBase = doc.getElementsByTagName("base")[0];
        var oldHref = oldBase && oldBase.href;
        var docHead = doc.head || doc.getElementsByTagName("head")[0];
        var ourBase = oldBase || docHead.appendChild(doc.createElement("base"));
        var resolver = doc.createElement("a");
        var resolvedUrl;

        baseUrl = baseUrl || (oldBase && oldBase.href) || "";

        ourBase.href = baseUrl;
        resolver.href = url;
        resolvedUrl = resolver.href;

        if (oldBase) {
            oldBase.href = oldHref;
        } else {
            docHead.removeChild(ourBase);
        }

        return resolvedUrl;
    };
})(jQuery);
