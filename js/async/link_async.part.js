(function(jQuery) {
    /**
     * The regular expression that is going to be used for the verification of
     * the same host policy, required for the async based links.
     */
    var HOST_REGEX = new RegExp(location.host);

    jQuery.uxlinkasync = function(href, verify, uuid) {
        // retrievs the reference to the body element to be used
        // for async verification
        var _body = jQuery("body");

        // normnalizes the current async reference so the href value
        // is allways a valid string value that may be used with no
        // dependency on its current data type
        href = href.href || href;

        // retrieves the value of the async flag for the current body
        // element in case the value is not set returns immediately
        // with a not processed value (not meant to be handled async)
        var async = _body.data("async");
        if (!async) {
            return false;
        }

        // in case the provided link value is invalid, not set
        // or empty there's no panel to be changed and everything
        // shuold remain the same (no update)
        if (!href) {
            return true;
        }

        // in case this is an internal link the panel change must be
        // avoided and the top handler should take this into account
        // otherwise potential loops may be created and some unrequired
        // sequential async loading procedures may also be created,
        // note that in case the verify flag is set this is ignore as
        // the loading is considered to be forced
        var hasHash = href.indexOf("#") != -1;
        var isInternal = hasHash && href.split("#")[0] == document.location.href.split("#")[0];
        isInternal = isInternal || href[0] == "#";
        if (isInternal && !verify) {
            return false;
        }

        // resolves the provided link so that were able to find out the
        // absolute url out of it and set it as the location to be retrieved
        // using an asynchronous approach (ajax)
        href = jQuery.uxresolve(href);

        // runs the regular expression that will verify if the current link
        // is local and in case it's not returns immediately with the error
        // flag set indicating that no processing has been done
        var isLocal = HOST_REGEX.test(href)
        if (!isLocal) {
            return false;
        }

        // calculates the aditional set of values of the base href value
        // so that this request may be "marked" as special avoiding possible
        // errors with cache in the browser/client side
        var hasQuery = href.indexOf("?") != -1;
        var extraParams = "x-async=1&x-partial=1";
        var extraQuery = hasQuery ? "&" + extraParams : "?" + extraParams;

        // trigers the async operation start handler indicating that an
        // asyncronous request is going to start, this trigger should
        // enable all the visuals so that the user is notified about the
        // remote communication that is going to occur
        _body.triggerHandler("async_start");

        // updates the async state of the current document so
        // that the system "knows" the current request that is
        // being processed in an async fashion
        _body.data("async_state", href);

        // runs the remove async call that will retrieve the partial contents
        // that will be used to change and re-populate the current dom, note
        // the extra async data parameter sent indicating that this is meant
        // to be handled differently (notably the redirection process)
        var request = jQuery.ajax({
            url: href + extraQuery,
            dataType: "html",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("X-Async", "all");
                xhr.setRequestHeader("X-Partial", "all");
            },
            success: function(data, status, request) {
                // verifies if the current result if of type (async) redirect, this
                // is a special case and the redirection must be performed using a
                // special strateg by retrieving the new location and setting it as
                // new async contents to be loaded, note that only requests that
                // contain a valid location header will be used for redirection
                var isRedirect = request.status == 280;
                var hrefR = request.getResponseHeader("Location");
                if (isRedirect && hrefR) {
                    hrefR = jQuery.uxresolve(hrefR, href);
                    jQuery.uxlocation(hrefR);
                    return;
                }

                // retrieves the reference to the body element to be used in the
                // current reponse handler for a series of operations
                var _body = jQuery("body");

                // retrieves the current async state that is in processing in case
                // it's not the same as the current link returns immediately as the
                // current process has been canceled "by a newer one"
                var state = _body.data("async_state");
                if (state != href) {
                    return;
                }

                // trigger the async end(ed) event that notifies the current
                // structures that no more remote communication is taking place
                _body.triggerHandler("async_end");

                // in case this is a verified operation the async operations
                // may pile up and so we must verify if the document location
                // in the current document is the same as the document we're
                // trying to retrieve, if it's not return immediately (ignore)
                if (verify && document.location != href) {
                    return;
                }

                // retrieves the body element and uses it to trigger the data
                // event indicating that new panel data is available and that
                // the current layout must be updated (async fashion)
                _body.triggerHandler("data", [data, href, uuid, !verify]);
            },
            error: function() {
                document.location = href;
            }
        });

        // encapsulates the request object around an acessor and then registers
        // for the ready state change event so that the conten type may be validated
        // as soon as possible (headers received stage) and the request canceled in
        // case it does not correspond to an html message
        var reference = jQuery(request);
        reference.bind("readystatechange", function() {
            // retrieves the current context as the request that is going to
            // beverified for the headers ready state change
            var request = this;

            // in case the current request state is not headers ready there's
            // no need to continue as we're going to verify the content type
            if (request.readyState != 2) {
                return;
            }

            // verifies if the current request represents and async request
            // and if that's not the case runs the fallback process (user agent
            // document redirection) and aborts the current request
            var requestAsync = isAsync(request);
            if (requestAsync == true) {
                return;
            }
            document.location = href;
            request.abort();
        });

        var isAsync = function(request) {
            // gathers the target location (redirection) in case it exists, then
            // retrieves the content type for the current request and processes
            // the value retrieving only the basic value for it, then verifies
            // that the mime type of it is html and in case it's returns valid as
            // the provided request is considered to be an async request
            var location = request.getResponseHeader("Location");
            var contentType = request.getResponseHeader("Content-Type") || "";
            contentType = contentType.split(";")[0];
            contentType = contentType.strip();
            return location || contentType == "text/html";
        };

        // returns valid as the link execution has been started
        // with success (async request sent)
        return true;
    };
})(jQuery);
