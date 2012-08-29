(function($) {
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
            // retrieves the body
            var _body = jQuery("body");

            // retrieves the various elements based on their attribute
            // values (attribute based selection)
            var dataWidth = jQuery("[data-width]", matchedObject).not(".template [data-width]");

            // retrieves the various elements
            var overlay = jQuery(".overlay", matchedObject).not(".template .overlay");
            var form = jQuery(".form", matchedObject).not(".template .form");
            var button = jQuery(".button", matchedObject).not(".template .button");
            var buttonGroup = jQuery(".button-group", matchedObject).not(".template .button-group");
            var textField = jQuery(".text-field", matchedObject).not(".template .text-field");
            var textArea = jQuery(".text-area", matchedObject).not(".template .text-area");
            var dropField = jQuery(".drop-field", matchedObject).not(".template .drop-field");
            var selectField = jQuery(".select-field", matchedObject).not(".template .select-field");
            var radioField = jQuery(".radio-field", matchedObject).not(".template .radio-field");
            var incrementalField = jQuery(".incremental-field", matchedObject).not(".template .incremental-field");
            var table = jQuery(".table", matchedObject).not(".template .table");
            var image = jQuery(".image", matchedObject).not(".template .image");
            var calendar = jQuery(".calendar", matchedObject).not(".template .calendar");
            var menulink = jQuery(".menu-link", matchedObject).not(".template .menu-link");
            var slider = jQuery(".slider", matchedObject).not(".template .slider");
            var overlayPanel = jQuery(".overlay-panel", matchedObject).not(".template .overaly-panel");
            var overlaySearch = jQuery(".overlay-search", matchedObject).not(".template .overaly-search");
            var window = jQuery(".window", matchedObject).not(".template .window");
            var wizard = jQuery(".wizard", matchedObject).not(".template .wizard");
            var panel = jQuery(".panel", matchedObject).not(".template .panel");
            var tabPanel = jQuery(".tab-panel", matchedObject).not(".template .tab-panel");
            var panelStack = jQuery(".panel-stack", matchedObject).not(".template .panel-stack");
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
            var list = jQuery(".list", matchedObject).not(".template .list");
            var selectList = jQuery(".select-list", matchedObject).not(".template .select-list");
            var crosstList = jQuery(".cross-list", matchedObject).not(".template .cross-list");
            var progressBar = jQuery(".progress-bar", matchedObject).not(".template .progress-bar");
            var passwordMeter = jQuery(".password-meter", matchedObject).not(".template .password-meter");
            var changer = jQuery(".changer", matchedObject).not(".template .changer");
            var contentChanger = jQuery(".content-changer", matchedObject).not(".template .content-changer");
            var dateTime = jQuery(".date-time", matchedObject).not(".template .date-time");
            var enumeration = jQuery(".enumeration", matchedObject).not(".template .enumeration");
            var number = jQuery(".number", matchedObject).not(".template .number");
            var timestamp = jQuery(".timestamp", matchedObject).not(".template .timestamp");
            var chart = jQuery(".chart", matchedObject).not(".template .chart");
            var video = jQuery(".video", matchedObject).not(".template .video");
            var uploader = jQuery(".uploader", matchedObject).not(".template .uploader");
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

            // applies the various attribute base plugins
            dataWidth.uxdatawidth();

            // applies the scan plugin (must have register priority)
            scan.uxscan();

            // applies the various component plugins
            overlay.uxoverlay();
            form.uxform();
            button.uxbutton();
            buttonGroup.uxbuttongroup();
            textField.uxtextfield();
            textArea.uxtextfield();
            dropField.uxdropfield();
            selectField.uxselectfield();
            radioField.uxradiofield();
            incrementalField.uxincrementalfield();
            table.uxtable();
            image.uximage();
            calendar.uxcalendar();
            menulink.uxmenulink();
            slider.uxslider();
            overlayPanel.uxoverlaypanel();
            overlaySearch.uxoverlaysearch();
            window.uxwindow();
            wizard.uxwizard();
            panel.uxpanel();
            tabPanel.uxtabpanel();
            panelStack.uxpanelstack();
            breadcrumbs.uxbreadcrumbs();
            hightlightBox.uxhightlightbox();
            replacer.uxreplacer();
            dataSource.uxdatasource();
            filter.uxfilter();
            hoveringbox.uxhoveringbox();
            headerNotification.uxheadernotification();
            link.uxlink();
            linkConfirm.uxlinkconfirm();
            list.uxlist();
            selectList.uxselectlist();
            crossList.uxcrosslist();
            progressBar.uxprogressbar();
            passwordMeter.uxpasswordmeter();
            changer.uxchanger();
            contentChanger.uxcontentchanger();
            dateTime.uxdatetime();
            enumeration.uxenumeration();
            number.uxnumber();
            timestamp.uxtimestamp();
            chart.uxchart();
            video.uxvideo();

            // applies the various transform plugins
            transformFlip.uxtransformflip();

            // applies the various file plugins
            fileDrop.uxfiledrop();
            imageUpload.uximageupload();

            // applies the various shortcut plugins
            shortcuts.uxshortcuts();

            // applies the focus plugins
            focus.uxfocus();

            // applies the name change plugin
            nameChange.uxnamechange();

            // applies the error plugin
            textField.uxerror();
            textArea.uxerror();
            table.uxerror();

            // applies the uploader plugin
            uploader.uxuploader();

            // applies the print plugin
            _print.uxprint();

            // applies the browser plugin
            _body.uxbrowser();

            // applies the eval (javascript evalutation)
            // this is a dangerous operation
            _eval.uxeval();

            // applies the gateway plugins
            gatewayPrint.uxgprint();

            // shows the body in case it's meant to be
            // shown only after the ux script execution
            waitLoad && _body.show();
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the body
            var _body = jQuery("body");

            try {
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
            } catch (exception) {
            }
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
