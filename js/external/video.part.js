(function(jQuery) {
    jQuery.fn.uxvideo = function(options) {
        // the map for the youtube
        // base addresses
        var YOUTUBE_MAP = {
            "youtube.com" : true,
            "www.youtube.com" : true
        };

        // the map for the vimeo
        // base addresses
        var VIMEO_MAP = {
            "vimeo.com" : true,
            "www.vimeo.com" : true
        };

        // the map for the daily motion
        // base addresses
        var DAILY_MOTION_MAP = {
            "dailymotion.com" : true,
            "www.dailymotion.com" : true
        };

        // the default values for the timestamp
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
            // iterates over all the matched object
            // elements to update the video value
            matchedObject.each(function(index, element) {
                        // retrieves the element reference
                        var _element = jQuery(element);

                        // retrieves the url (html) from the element
                        // and then trims it
                        var url = _element.text();
                        url = url.trim();

                        // in case the current url value is not valid
                        // must return immediately because it's not possible
                        // to go any furhter with the current processing
                        if (!url) {
                            return;
                        }

                        // parses the url retrieving the
                        // url information
                        var urlInformation = parseUrl(url);

                        // retrieves the base name from the url information
                        var baseName = urlInformation["baseName"];

                        // in case the video is of type youtube
                        if (YOUTUBE_MAP[baseName]) {
                            updateYoutube(_element, options, urlInformation);
                        }
                        // in case the video is of type vimeo
                        else if (VIMEO_MAP[baseName]) {
                            updateVimeo(_element, options, urlInformation);
                        }
                        // in case the video is of type daily motion
                        else if (DAILY_MOTION_MAP[baseName]) {
                            updateDailyMotion(_element, options, urlInformation);
                        }
                    });
        };

        var updateYoutube = function(matchedObject, options, urlInformation) {
            // retrieves the options map to then retrieve
            // the video id from it
            var optionsMap = urlInformation["optionsMap"];
            var videoId = optionsMap["v"];

            // retrieves the width and the height
            var width = matchedObject.attr("data-width");
            var height = matchedObject.attr("data-height");

            // retrieves the (use) action script value that will
            // control the usage or not of the as3 vs html5 players
            var as = matchedObject.attr("data-as");

            // retrieves the reference to the various attributes that will
            // change the way the video is going to be embedded
            var hd = matchedObject.attr("data-hd");
            var info = matchedObject.attr("data-info");
            var chromeless = matchedObject.attr("data-chromeless");
            var autoPlay = matchedObject.attr("data-auto_play");

            // calculates the default width and height values
            width = width ? width : 560;
            height = height ? height : 315;

            // calculates the various technology dependent values, taking
            // into account if the player support is going to be action
            // script based or html5 based (legacy support)
            var tag = as ? "embed" : "iframe";
            var prefixUrl = as ? "v" : "embed";
            var type = as ? "application/x-shockwave-flash" : "text/html";

            // calculates the the various parameters that are going to be
            // set for the inclusion of the video player
            var hdValue = hd ? "hd=1" : "hd=0";
            var infoValue = info ? "showinfo=1" : "showinfo=0";
            var controlsValue = chromeless ? "controls=0" : "controls=1";
            var autoPlayValue = autoPlay ? "autoplay=1" : "autoplay=0";

            // updates the matched object html with the video embed object
            // that will include a flash object into the code
            matchedObject.html("<" + tag + " id=\"youtube-player\" width=\""
                    + width + "\" height=\"" + height
                    + "\" src=\"http://www.youtube.com/" + prefixUrl + "/"
                    + videoId + "?" + hdValue + "&" + infoValue + "&"
                    + controlsValue + "&" + autoPlayValue
                    + "&playerapiid=youtube-player" + "&version=3"
                    + "&enablejsapi=1" + "\" frameborder=\"0\""
                    + " allowfullscreen=\"true\""
                    + " allowscriptaccess=\"always\"" + " type=\"" + type
                    + "\"></" + tag + ">");
        };

        var updateVimeo = function(matchedObject, options, urlInformation) {
            // retrieves the resource reference
            var resourceReference = urlInformation["resourceReference"];

            // retrieves the reference to the various attributes that will
            // change the way the video is going to be embedded
            var width = matchedObject.attr("data-width");
            var height = matchedObject.attr("data-height");
            var info = matchedObject.attr("data-info");
            var autoPlay = matchedObject.attr("data-auto_play");

            // calculates the default width and height values
            width = width ? width : 560;
            height = height ? height : 315;

            // calculates the info value
            var infoValue = autoPlay
                    ? "title=1&byline=1&portrait=1"
                    : "title=0&byline=0&portrait=0";

            // calculates the auto play value
            var autoPlayValue = autoPlay ? "autoplay=1" : "autoplay=0";

            // updates the matched object html with the video iframe
            matchedObject.html("<iframe src=\"http://player.vimeo.com/video"
                    + resourceReference
                    + "?"
                    + infoValue
                    + "&"
                    + autoPlayValue
                    + "\" width=\""
                    + width
                    + "\" height=\""
                    + height
                    + "\" frameborder=\"0\" webkitAllowFullScreen allowFullScreen></iframe>");
        };

        var updateDailyMotion = function(matchedObject, options, urlInformation) {
            // retrieves the resource reference
            var resourceReference = urlInformation["resourceReference"];

            // retrieves the reference to the various attributes that will
            // change the way the video is going to be embedded
            var width = matchedObject.attr("data-width");
            var height = matchedObject.attr("data-height");
            var chromeless = matchedObject.attr("data-chromeless");
            var autoPlay = matchedObject.attr("data-auto_play");

            // calculates the default width and height values
            width = width ? width : 560;
            height = height ? height : 315;

            // calculates the the various parameters that are going to be
            // set for the inclusion of the video player
            var chromelessValue = chromeless ? "chromeless=1" : "chromeless=0";
            var autoPlayValue = autoPlay ? "autoplay=1" : "autoplay=0";

            // updates the matched object html with the video iframe
            matchedObject.html("<iframe src=\"http://www.dailymotion.com/embed"
                    + resourceReference
                    + "?"
                    + chromelessValue
                    + "&"
                    + autoPlayValue
                    + "\" width=\""
                    + width
                    + "\" height=\""
                    + height
                    + "\" frameborder=\"0\" webkitAllowFullScreen allowfullscreen></iframe>");
        };

        var parseUrl = function(url) {
            // creates the url regex (for url validation)
            var urlRegex = /(\w+\:\/\/)?([^\:\/\?#]+)(\:\d+)?((\/[^\?#]+)*)\/?(\?(([^#])*))?(#(.*))?/g;

            // executes the url regex against the url
            var match = urlRegex.exec(url);

            // retrieves and parses the various url component from
            // the (url) match
            var protocol = match[1] ? match[1].slice(0, -3) : null;
            var baseName = match[2] ? match[2] : null;
            var port = match[3] ? match[3].slice(1) : null;
            var resourceReference = match[4] ? match[4] : null;
            var options = match[7] ? match[7] : null;
            var location = match[9] ? match[9] : null;

            // splits the various options arround the and character
            var optionsSplit = options ? options.split("&") : [];

            // creates the options map
            var optionsMap = {};

            // iterates over all the split token in the options
            // split list
            for (var index = 0; index < optionsSplit.length; index++) {
                // retrieves the (current) option
                var option = optionsSplit[0];

                // splits the option arround the separator
                var optionSplit = option.split("=");

                // in case there are at least two
                // values in the option split
                if (optionSplit.length > 1) {
                    // retrieves the name and the value
                    // from the option split
                    var optionName = optionSplit[0];
                    var optionValue = optionSplit[1];
                } else {
                    // retrieves the name from the
                    // option split and sets the value
                    // to null
                    var optionName = optionSplit[0];
                    var optionValue = null;
                }

                // sets the option in the options map
                optionsMap[optionName] = optionValue;
            }

            // creates the url information map, from the
            // various url components
            var urlInformation = {
                protocol : protocol,
                baseName : baseName,
                port : port,
                resourceReference : resourceReference,
                options : options,
                location : location,
                optionsMap : optionsMap
            }

            // returns the url information map
            return urlInformation;
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);

function onYoutubeStateChange(state) {
    if (state == 0) {
        var video = jQuery("#youtube-player");
        var parent = video.parents(".video");
        parent.trigger("ended");
    }
}

function onYouTubePlayerReady(id) {
    var video = jQuery("#youtube-player");
    var videoElement = video[0];
    videoElement.addEventListener("onStateChange", "onYoutubeStateChange");
}
