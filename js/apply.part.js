(function(jQuery) {
    jQuery.fn.uxapply = function(options) {
        // the default values for the apply
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
            // validates that there's a valid matched object,
            // otherwise returns immediately
            if (!matchedObject || matchedObject.length == 0) {
                return;
            }

            // retrieves the elements to be able to apply their styles
            // and use them as the base reference for the rest of the
            // apply operation, note that the started flag is used to
            // controll the ammount of times the body is initialized
            var _body = jQuery("body");
            var started = _body.data("started");
            _body.data("started", true);
            _body = !started ? _body : jQuery([]);

            // applies the global document plugin so that the base behaviour
            // of the window is changed accordingly
            _body.uxdocument();

            // retrieves the complete set of template elements and applies
            // the attribute name obfuscation in each of them so that the
            // attributes do not "collide" creating unwanted behavior
            var template = jQuery(".template", matchedObject);
            template.uxattr("name", "data-name");
            template.uxattr("class", "data-class");
            template.uxattr("src", "data-src");

            // retrieves the meta source element to be started in the
            // first state of the apply (going to create functions)
            var source = jQuery(".source", matchedObject).not(".template .source");

            // retrieves the various elements based on their attribute
            // values (attribute based selection)
            var dataWidth = jQuery("[data-width]", matchedObject).not(".template [data-width]");
            var dataPivot = jQuery("[data-pivot]", matchedObject).not(".template [data-pivot]");
            var dataDisabled = jQuery("[data-disabled]", matchedObject).not(".template [data-disabled]");

            // retrieves the various elements
            var overlay = jQuery(".overlay", matchedObject).not(".template .overlay");
            var form = jQuery(".form", matchedObject).not(".template .form");
            var button = jQuery(".button", matchedObject).not(".template .button");
            var buttonGroup = jQuery(".button-group", matchedObject).not(".template .button-group");
            var textField = jQuery(".text-field", matchedObject).not(".template .text-field");
            var textArea = jQuery(".text-area", matchedObject).not(".template .text-area");
            var dropField = jQuery(".drop-field", matchedObject).not(".template .drop-field");
            var selectField = jQuery(".select-field", matchedObject).not(".template .select-field");
            var checkField = jQuery(".check-field", matchedObject).not(".template .check-field");
            var radioField = jQuery(".radio-field", matchedObject).not(".template .radio-field");
            var tagField = jQuery(".tag-field", matchedObject).not(".template .tag-field");
            var incrementalField = jQuery(".incremental-field", matchedObject).not(
                ".template .incremental-field");
            var toggleField = jQuery(".toggle-field", matchedObject).not(".template .toggle-field");
            var fileField = jQuery(".file-field", matchedObject).not(".template .file-field");
            var dropList = jQuery(".drop-list", matchedObject).not(".template .drop-list");
            var dropDown = jQuery(".drop-down", matchedObject).not(".template .drop-down");
            var dropTag = jQuery(".drop-tag", matchedObject).not(".template .drop-tag");
            var table = jQuery(".table", matchedObject).not(".template .table");
            var image = jQuery(".image", matchedObject).not(".template .image");
            var calendar = jQuery(".calendar", matchedObject).not(".template .calendar");
            var calendarRange = jQuery(".calendar-range", matchedObject).not(".template .calendar-range");
            var menu = jQuery(".menu", matchedObject).not(".template .menu");
            var menuLink = jQuery(".menu-link", matchedObject).not(".template .menu-link");
            var slider = jQuery(".slider", matchedObject).not(".template .slider");
            var scrollList = jQuery(".scroll-list", matchedObject).not(".template .scroll-list");
            var overlayPanel = jQuery(".overlay-panel", matchedObject).not(".template .overaly-panel");
            var overlaySearch = jQuery(".overlay-search", matchedObject).not(".template .overaly-search");
            var window = jQuery(".window", matchedObject).not(".template .window");
            var wizard = jQuery(".wizard", matchedObject).not(".template .wizard");
            var panel = jQuery(".panel", matchedObject).not(".template .panel");
            var tabPanel = jQuery(".tab-panel", matchedObject).not(".template .tab-panel");
            var sidePanel = jQuery(".side-panel", matchedObject).not(".template .side-panel");
            var panelMore = jQuery(".panel-more", matchedObject).not(".template .panel-more");
            var panelStack = jQuery(".panel-stack", matchedObject).not(".template .panel-stack");
            var stack = jQuery(".stack", matchedObject).not(".template .stack");
            var breadcrumbs = jQuery(".breadcrumbs", matchedObject).not(".template .breadcrumbs");
            var hightlightBox = jQuery(".hightlight-box", matchedObject).not(".template .hightlight-box");
            var replacer = jQuery(".replacer", matchedObject).not(".template .replacer");
            var dataSource = jQuery(".data-source", matchedObject).not(".template .data-source");
            var filter = jQuery(".filter", matchedObject).not(".template .filter");
            var hoveringbox = jQuery(".hovering-box", matchedObject).not(".template .hovering-box");
            var headerNotification = jQuery(".header-notification",
                matchedObject).not(".template .header-notification");
            var link = jQuery(".link", matchedObject).not(".template .link");
            var linkConfirm = jQuery(".link-confirm", matchedObject).not(".template .link-confirm");
            var imageLazy = jQuery(".image-lazy", matchedObject).not(".template .image-lazy");
            var list = jQuery(".list", matchedObject).not(".template .list");
            var selectList = jQuery(".select-list", matchedObject).not(".template .select-list");
            var sourceList = jQuery(".source-list", matchedObject).not(".template .source-list");
            var crossList = jQuery(".cross-list", matchedObject).not(".template .cross-list");
            var option = jQuery(".option", matchedObject).not(".template .option");
            var progressBar = jQuery(".progress-bar", matchedObject).not(".template .progress-bar");
            var passwordMeter = jQuery(".password-meter", matchedObject).not(".template .password-meter");
            var rating = jQuery(".rating", matchedObject).not(".template .rating");
            var changer = jQuery(".changer", matchedObject).not(".template .changer");
            var contentChanger = jQuery(".content-changer", matchedObject).not(".template .content-changer");
            var dateTime = jQuery(".date-time", matchedObject).not(".template .date-time");
            var enumeration = jQuery(".enumeration", matchedObject).not(".template .enumeration");
            var number = jQuery(".number", matchedObject).not(".template .number");
            var timestamp = jQuery(".timestamp", matchedObject).not(".template .timestamp");
            var slideshow = jQuery(".slideshow", matchedObject).not(".template .slideshow");
            var chart = jQuery(".chart", matchedObject).not(".template .chart");
            var lchart = jQuery(".lchart", matchedObject).not(".template .lchart");
            var video = jQuery(".video", matchedObject).not(".template .video");
            var code = jQuery(".code", matchedObject).not(".template .code");
            var uploader = jQuery(".uploader", matchedObject).not(".template .uploader");
            var animation = jQuery(".animation", matchedObject).not(".template .animation");
            var transformFlip = jQuery(".transform-flip", matchedObject).not(".template .transform-flip");
            var fileDrop = jQuery(".file-drop", matchedObject).not(".template .file-drop");
            var imageUpload = jQuery(".image-upload", matchedObject).not(".template .image-upload");
            var shortcuts = jQuery(".shortcuts", matchedObject).not(".template .shortcuts");
            var scan = jQuery(".scan", matchedObject).not(".template .scan");
            var focus = jQuery(".focus", matchedObject).not(".template .focus");
            var nameChange = jQuery(".name-change", matchedObject).not(".template .name-change");
            var _print = jQuery(".print", matchedObject).not(".template .print");
            var _eval = jQuery(".eval", matchedObject).not(".template .eval");

            // retrieves the various gateway elements
            var gatewayPrint = jQuery(".gateway-print", matchedObject).not(".template .gateway-print");

            // checks if the body element is meant to have the gateway plugin
            // loaded on it (for external symbol access)
            var gateway = _body.hasClass("gateway");

            // checks if the body element should wait for load to make its
            // appearance visible (shown after ux apply)
            var waitLoad = _body.hasClass("wait-load");

            // in case the gateway flag is set adds the gateway
            // plugin reference to the current body
            gateway && _body.uxgateway();

            // starts the various custom data source functions
            // to be used
            source.uxsource();

            // applies the various attribute base plugins
            dataWidth.uxdatawidth();
            dataPivot.uxdatapivot();

            // applies the scan plugin (must have register priority)
            // after this registration operation any scan mode will
            // be available from an user point of view
            scan.uxscan();

            // applies the browser plugin, this should change the body
            // classes reflecting the current environemnt in which the
            // system is currently running, this may also patch the
            // jquery environment so that it contains the browser object
            _body.uxbrowser();

            // applies the feature plugin that should validate a set
            // of features for the browser and change/populate the body
            // element according to the available features
            _body.uxfeature();

            // applies the mobile plugin, this extension is going
            // to change the classes of the body for a mobile browser
            // situation, that way the code may be used conditionaly
            // taking into account if this is a desktop or mobile browser
            _body.uxmobile();

            // applies the responsive plugin, responsible for the registration
            // of the handler that changes the top level classes of the body
            // according to the current dimensions/size of the viewport so that
            // the layout may adjust to the current dimensions (responsive design)
            _body.uxresponsive();

            // applies the various component plugins, these should start
            // the specific plugin behavior for each case
            overlay.uxoverlay();
            form.uxform();
            button.uxbutton();
            buttonGroup.uxbuttongroup();
            textField.uxtextfield();
            textArea.uxtextfield();
            dropField.uxdropfield();
            selectField.uxselectfield();
            checkField.uxcheckfield();
            radioField.uxradiofield();
            tagField.uxtagfield();
            incrementalField.uxincrementalfield();
            toggleField.uxtogglefield();
            fileField.uxfilefield();
            dropList.uxdroplist();
            dropDown.uxdropdown();
            dropTag.uxdroptag();
            table.uxtable();
            image.uximage();
            calendar.uxcalendar();
            calendarRange.uxcalendarrange();
            menu.uxmenu();
            menuLink.uxmenulink();
            slider.uxslider();
            scrollList.uxscrolllist();
            overlayPanel.uxoverlaypanel();
            overlaySearch.uxoverlaysearch();
            window.uxwindow();
            wizard.uxwizard();
            panel.uxpanel();
            tabPanel.uxtabpanel();
            sidePanel.uxsidepanel();
            panelMore.uxpanelmore();
            panelStack.uxpanelstack();
            stack.uxstack();
            breadcrumbs.uxbreadcrumbs();
            hightlightBox.uxhightlightbox();
            replacer.uxreplacer();
            dataSource.uxdatasource();
            filter.uxfilter();
            hoveringbox.uxhoveringbox();
            headerNotification.uxheadernotification();
            link.uxlink();
            linkConfirm.uxlinkconfirm();
            imageLazy.uximagelazy();
            list.uxlist();
            selectList.uxselectlist();
            sourceList.uxsourcelist();
            crossList.uxcrosslist();
            option.uxoption();
            progressBar.uxprogressbar();
            passwordMeter.uxpasswordmeter();
            rating.uxrating();
            changer.uxchanger();
            contentChanger.uxcontentchanger();
            dateTime.uxdatetime();
            enumeration.uxenumeration();
            number.uxnumber();
            timestamp.uxtimestamp();
            slideshow.uxslideshow();
            chart.uxchart();
            lchart.uxlchart();
            video.uxvideo();
            code.uxcode();

            // applies the various transform plugins, including the ones
            // related with sprite based animation (using single image)
            animation.uxanimation();
            transformFlip.uxtransformflip();

            // applies the various file plugins
            fileDrop.uxfiledrop();
            imageUpload.uximageupload();

            // applies the various shortcut plugins
            shortcuts.uxshortcuts();

            // applies the name change plugin
            nameChange.uxnamechange();

            // applies the error plugin, to the various elements that are
            // eligible for the automatic error processing operation
            textField.uxerror();
            textArea.uxerror();
            dropField.uxerror();
            tagField.uxerror();
            dropDown.uxerror();
            table.uxerror();
            rating.uxerror();

            // applies the uploader plugin
            uploader.uxuploader();

            // applies the print plugin
            _print.uxprint();

            // applies the resize plugin, responsible for the "artificial"
            // emulation of the resize event on the window object using a
            // pre-defined timeout interval, this way it's possible to overcome
            // some resize event related limitations on some browsers
            _body.uxresize();

            // applies the eval (javascript evalutation)
            // this is a dangerous operation
            _eval.uxeval();

            // applies the gateway plugins, this should allow seamless
            // integration with some of the native code operatiosn
            gatewayPrint.uxgprint();

            // applies the various attribute based plugins (post
            // structure construction apply)
            dataDisabled.uxdisable();

            // shows the body in case it's meant to be
            // shown only after the ux script execution
            waitLoad && _body.show();

            // applies the focus plugins, this must be done
            // after the visibility is set so that no problem
            // with focus operations occurs (safe operation)
            setTimeout(function() {
                focus.uxfocus();
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // validates that there's a valid matched object,
            // otherwise returns immediately
            if (!matchedObject || matchedObject.length == 0) {
                return;
            }

            // retrieves the body and verifies if it has
            // already been registered in case it was sets
            // the value and returns immediately
            var _body = jQuery("body");
            var registered = _body.data("registered");
            _body.data("registered", true);
            if (registered) {
                return;
            }

            try {
                // saves the original alert and confirm
                // functions under some more obscure global
                // variables so that they may be used latter
                // if that's required by the developer
                _alert = alert;
                _confirm = confirm;

                // overrides the current alert function
                // with the ux alert method
                alert = function(message, callback) {
                    // shows the alert window
                    _body.uxalert(message, callback);

                    // returns null to notify the caller
                    // of the requirement for a callback
                    return null;
                };

                // overrides the current confirm function
                // with the ux confirm method
                confirm = function(message, callback) {
                    // shows the confirm window
                    _body.uxconfirm(message, callback);

                    // returns null to notify the caller
                    // of the requirement for a callback
                    return null;
                };

                // registers the proper ajax pre-filter
                // so that all the xml http requests are
                // considered asynchronous
                jQuery.ajaxPrefilter(function(options) {
                    options.async = true;
                });
            } catch (exception) {}
        };

        // initializes the plugin
        initialize();

        // triggers an event indicating that the ux components
        // have finished the application of the structures, note
        // that the base of the apply is sent as an argument, this
        // is not a jquery standard and is used as an exception
        var _body = jQuery("body");
        _body.triggerHandler("pre_applied", [matchedObject]);
        _body.triggerHandler("applied", [matchedObject]);
        _body.triggerHandler("post_applied", [matchedObject]);

        // returns the object
        return this;
    };
})(jQuery);
