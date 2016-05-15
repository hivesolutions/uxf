(function(jQuery) {
    jQuery.uxfullscreen = function(leave) {
        // retrieves the reference to the top level elements, that
        // are going to be used for part of the fullscreen operation
        var _document = jQuery(document);
        var _body = jQuery("body");

        // determines if the current plugin is already registered for
        // the fullscreen events and set the proper flag
        var isRegistered = _body.data("fullscreen");
        _body.data("fullscreen", true);

        // in case the plugin is not yet registered for the fullscreen
        // change event registers for such operation
        !isRegistered
            && _document.bind(
                "fullscreenchange webkitfullscreenchange mozfullscreenchange",
                function() {
                    var isFullscreen = this.fullScreen || this.mozFullScreen || this.webkitIsFullScreen;
                    isFullscreen = isFullscreen || this.fullscreenElement || this.mozFullScreenElement || this.webkitFullscreenElement ||
                        this.msFullscreenElement;
                    isFullscreen = isFullscreen ? true : false;
                    if (isFullscreen) {
                        _body.addClass("full-window");
                    } else {
                        _body.removeClass("full-window");
                    }
                    _body.triggerHandler("fullscreen_change", [isFullscreen]);
                });

        // tries to determine if the current screen is being displayed
        // in fullscreen or if it's under a window mode
        var isFullscreen = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement ||
            document.msFullscreenElement;
        isFullscreen = isFullscreen || leave;
        isFullscreen = isFullscreen ? true : false;

        if (!isFullscreen) {
            _body.addClass("full-window");
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
            _body.removeClass("full-window");
        }

        return !isFullscreen;
    };
})(jQuery);
