if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

(function(jQuery) {
    jQuery.fn.uxbrowser = function(options) {
        // the data browser values
        var DATA_BROWSER = [
            {
                string: navigator.userAgent,
                subString: "Edge",
                identity: "Edge",
                versionSearch: "Edge"
            },
            {
                string: navigator.userAgent,
                subString: "Chrome",
                identity: "Chrome"
            },
            {
                string: navigator.userAgent,
                subString: "OmniWeb",
                versionSearch: "OmniWeb/",
                identity: "OmniWeb"
            },
            {
                string: navigator.vendor,
                subString: "Apple",
                identity: "Safari",
                versionSearch: "Version"
            },
            {
                prop: window.opera,
                identity: "Opera"
            },
            {
                string: navigator.vendor,
                subString: "iCab",
                identity: "iCab"
            },
            {
                string: navigator.vendor,
                subString: "KDE",
                identity: "Konqueror"
            },
            {
                string: navigator.userAgent,
                subString: "Firefox",
                identity: "Firefox"
            },
            {
                string: navigator.vendor,
                subString: "Camino",
                identity: "Camino"
            },
            {
                string: navigator.userAgent,
                subString: "Netscape",
                identity: "Netscape"
            },
            {
                string: navigator.userAgent,
                subString: "MSIE",
                identity: "Explorer",
                versionSearch: "MSIE"
            },
            {
                string: navigator.userAgent,
                subString: "Trident",
                identity: "Explorer",
                versionSearch: "rv"
            },
            {
                string: navigator.userAgent,
                subString: "Gecko",
                identity: "Mozilla",
                versionSearch: "rv"
            },
            {
                string: navigator.userAgent,
                subString: "Mozilla",
                identity: "Netscape",
                versionSearch: "Mozilla"
            }
        ];

        // the data os values, to be used for proper
        // indeitification of the operative systems
        var DATA_OS = [
            {
                string: navigator.platform,
                subString: "Win",
                identity: "Windows"
            },
            {
                string: navigator.platform,
                subString: "Mac",
                identity: "Mac"
            },
            {
                string: navigator.userAgent,
                subString: "iPhone",
                identity: "iPhone/iPod"
            },
            {
                string: navigator.platform,
                subString: "Linux",
                identity: "Linux"
            }
        ];

        // the legacy dictionary that is going to map the
        // name of the browser with the minimum version from
        // which the browser is considered not legacy (or current)
        var BROWSER_LEGACY = {
            chrome: 40,
            firefox: 30,
            explorer: 10
        };

        // the default values for the browser
        var defaults = {};

        // sets the default options value
        options = options || {};

        // constructs the options
        options = jQuery.extend(defaults, options);

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
            if (!matchedObject || matchedObject.length === 0) {
                return;
            }

            // retrieves the browser information
            var browserName = _searchString(DATA_BROWSER) || "Unknown browser";
            var browserVersion =
                _searchVersion(navigator.userAgent) ||
                _searchVersion(navigator.appVersion) ||
                "Unknown version";
            var browserOs = _searchString(DATA_OS) || "Unknown OS";

            // lower cases the browser values, so that it becomes
            // normalized (in the common sense)
            browserName = browserName.toLowerCase();
            browserOs = browserOs.toLowerCase();

            // tries to retrieve the minimum version version from which the
            // browser is considered to be a current one (not legacy) either
            // from the current element or the static definitions
            var versionLegacy =
                matchedObject.attr("data-" + browserName + "_legacy") ||
                BROWSER_LEGACY[browserName];
            versionLegacy = parseInt(versionLegacy);

            // tries to determine if the current browser is a legacy one, that
            // the case in case there's a valid version legacy value and the
            // current browser version is lower than that one
            var isLegacy = versionLegacy && browserVersion < versionLegacy;
            isLegacy = Boolean(isLegacy);

            // adds the browser classes to the body item, so that
            // they may be used for declarative conditionals
            matchedObject.addClass(browserName);
            matchedObject.addClass(browserName + "-" + browserVersion);
            matchedObject.addClass(browserOs);

            // adds the extra legacy classes in the current browser
            // is considered to be a legacy one
            isLegacy && matchedObject.addClass("browser-legacy");
            isLegacy && matchedObject.addClass(browserName + "-legacy");

            // updates a series of attributes in the body so that
            // it's possible to access browser and operative system
            // information from the matched object
            matchedObject.attr("data-browser", browserName);
            matchedObject.attr("data-browser_version", browserVersion);
            matchedObject.attr("data-os", browserOs);

            // adds the extra legacy attribute in the current browser
            // is considered to be a legacy one
            isLegacy && matchedObject.attr("data-browser_legacy", "1");

            // applies the patch to the jquery infra-structure so that
            // the old mode of broewser detection is still possible
            _applyPatch(browserName, browserVersion, browserOs, true);

            // remove the classes that are not legacy compliant if the
            // current browser is considered to be a legacy one
            _removeLegacy(matchedObject, isLegacy);
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {};

        var _searchString = function(data) {
            for (var index = 0; index < data.length; index++) {
                var dataString = data[index].string;
                var dataProp = data[index].prop;
                jQuery.fn.uxbrowser.versionSearchString =
                    data[index].versionSearch || data[index].identity;
                if (dataString) {
                    if (dataString.indexOf(data[index].subString) !== -1) {
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
            if (index === -1) {
                // returns immediately
                return;
            }

            return parseFloat(
                dataString.substring(index + jQuery.fn.uxbrowser.versionSearchString.length + 1)
            );
        };

        var _applyPatch = function(browserName, browserVersion, browserOs, force) {
            // in case the browser structure is defined under the jquery
            // dictionary and the force flag is not set there's no need
            // to continue with the patch apply
            if (!force && jQuery.browser) {
                return;
            }

            // creates the browser object structure (if required) and
            // then populates it with the proper browser values so that
            // they can be used later on for conditional execution
            jQuery.browser = jQuery.browser || {};
            jQuery.browser[browserName] = true;
            jQuery.browser.name = jQuery.browser.name || String(browserName);
            jQuery.browser.version = jQuery.browser.version || String(browserVersion);
            jQuery.browser.os = jQuery.browser.os || String(browserOs);
            jQuery.browser._name = String(browserName);
            jQuery.browser._version = String(browserVersion);
            jQuery.browser._os = String(browserOs);
        };

        var _removeLegacy = function(matchedObject, isLegacy) {
            // verifies if the current browser is considered to be
            // a legacy one, and if that's not the case returns the
            // control flow immediately to the caller method
            if (!isLegacy) {
                return;
            }

            // tries to retrieve the complete set of classes that
            // are meant to be removed in case this is a legacy
            // browser and splits them around the space character
            var legacy = matchedObject.attr("data-legacy") || "";
            legacy = legacy.split(" ");

            // iterates over the complete set of legacy classes and
            // removes them from the current element
            for (var index = 0; index < legacy.length; index++) {
                var legacyClass = legacy[index];
                matchedObject.removeClass(legacyClass);
            }
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
