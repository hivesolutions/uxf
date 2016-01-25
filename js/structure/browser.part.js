(function(jQuery) {
    jQuery.fn.uxbrowser = function(options) {
        // the data browser values
        var DATA_BROWSER = [{
            string: navigator.userAgent,
            subString: "Edge",
            identity: "Edge",
            versionSearch: "Edge"
        }, {
            string: navigator.userAgent,
            subString: "Chrome",
            identity: "Chrome"
        }, {
            string: navigator.userAgent,
            subString: "OmniWeb",
            versionSearch: "OmniWeb/",
            identity: "OmniWeb"
        }, {
            string: navigator.vendor,
            subString: "Apple",
            identity: "Safari",
            versionSearch: "Version"
        }, {
            prop: window.opera,
            identity: "Opera"
        }, {
            string: navigator.vendor,
            subString: "iCab",
            identity: "iCab"
        }, {
            string: navigator.vendor,
            subString: "KDE",
            identity: "Konqueror"
        }, {
            string: navigator.userAgent,
            subString: "Firefox",
            identity: "Firefox"
        }, {
            string: navigator.vendor,
            subString: "Camino",
            identity: "Camino"
        }, {
            string: navigator.userAgent,
            subString: "Netscape",
            identity: "Netscape"
        }, {
            string: navigator.userAgent,
            subString: "MSIE",
            identity: "Explorer",
            versionSearch: "MSIE"
        }, {
            string: navigator.userAgent,
            subString: "Trident",
            identity: "Explorer",
            versionSearch: "rv"
        }, {
            string: navigator.userAgent,
            subString: "Gecko",
            identity: "Mozilla",
            versionSearch: "rv"
        }, {
            string: navigator.userAgent,
            subString: "Mozilla",
            identity: "Netscape",
            versionSearch: "Mozilla"
        }];

        // the data os values
        var DATA_OS = [{
            string: navigator.platform,
            subString: "Win",
            identity: "Windows"
        }, {
            string: navigator.platform,
            subString: "Mac",
            identity: "Mac"
        }, {
            string: navigator.userAgent,
            subString: "iPhone",
            identity: "iPhone/iPod"
        }, {
            string: navigator.platform,
            subString: "Linux",
            identity: "Linux"
        }];

        // the default values for the browser
        var defaults = {};

        // sets the default options value
        var options = options ? options : {};

        // constructs the options
        var options = jQuery.extend(defaults, options);

        // sets the jquery matched object
        var matchedObject = this;

        /**
         * Initializer of the plugin, runs the necessary functions to initialize
         * the structures.
         */
        var initialize = function() {
            _appendHtml();
            _registerHandlers();
        };

        /**
         * Creates the necessary html for the component.
         */
        var _appendHtml = function() {
            // in case the matched object is not defined
            // or in case it's an empty list must return
            // immediatly initialization is not meant to
            // be run (performance issues may be created)
            if (!matchedObject || matchedObject.length == 0) {
                return;
            }

            // retrieves the browser information
            var browserName = _searchString(DATA_BROWSER) || "Unknown browser";
            var browserVersion = _searchVersion(navigator.userAgent) || _searchVersion(navigator.appVersion) ||
                "Unknown version";
            var browserOs = _searchString(DATA_OS) || "Unknown OS";

            // lower cases the browser values
            browserName = browserName.toLowerCase();
            browserOs = browserOs.toLowerCase();

            // adds the browser classes to the body item, so that
            // they may be used for declarative conditionals
            matchedObject.addClass(browserName);
            matchedObject.addClass(browserName + "-" + browserVersion);
            matchedObject.addClass(browserOs);

            // updates a series of attributes in the body so that
            // it's possibel to access browser and operative system
            // information from the matched object
            matchedObject.attr("data-browser", browserName)
            matchedObject.attr("data-browser_version", browserVersion)
            matchedObject.attr("data-os", browserOs)

            // applies the patch to the kquery infra-structure so that
            // the old mode of broewser detection is still possible
            _applyPatch(browserName, browserOs);
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {};

        var _searchString = function(data) {
            for (var index = 0; index < data.length; index++) {
                var dataString = data[index].string;
                var dataProp = data[index].prop;
                jQuery.fn.uxbrowser.versionSearchString = data[index].versionSearch || data[index].identity;
                if (dataString) {
                    if (dataString.indexOf(data[index].subString) != -1) {
                        return data[index].identity;
                    }
                } else if (dataProp) {
                    return data[index].identity;
                }
            }
        };

        var _searchVersion = function(dataString) {
            // tries to search for the version search string
            var index = dataString.indexOf(jQuery.fn.uxbrowser.versionSearchString);

            // in case the version search string is not found
            if (index == -1) {
                // returns immediately
                return;
            }

            return parseFloat(dataString.substring(index + jQuery.fn.uxbrowser.versionSearchString.length +
                1));
        };

        var _applyPatch = function(browserName, browserOs) {
            // in case the browser structure is defined under the jquery
            // dictionary there's no need to continue
            if (jQuery.browser) {
                return;
            }

            // creates the browser bject structure and populates
            // it with the proper browser name index set to valid
            jQuery.browser = {}
            jQuery.browser[browserName] = true;
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
