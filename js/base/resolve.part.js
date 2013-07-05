(function(jQuery) {
    jQuery.uxresolve = function(url, base_url) {
        var doc = document;
        var oldBase = doc.getElementsByTagName("base")[0];
        var oldHref = oldBase && oldBase.href, docHead = doc.head
                || doc.getElementsByTagName("head")[0];
        var ourBase = oldBase || docHead.appendChild(doc.createElement("base"));
        var resolver = doc.createElement("a")
        var resolvedUrl;

        ourBase.href = base_url;
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
