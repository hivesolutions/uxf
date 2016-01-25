/**
 * jQuery file field plugin, this jQuery plugin provides the base
 * infra-structure for the creation of a file field component.
 *
 * @name jquery-file-field.js
 * @author João Magalhães <joamag@hive.pt> & Luís Martinho <lmartinho@hive.pt>
 * @version 1.0
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2015 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxfilefield = function(options) {
        // the default values for the file field
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
            matchedObject.each(function(index, element) {
                var _element = jQuery(this);
                var name = _element.attr("name") || _element.attr("data-name");
                name && _element.attr("data-name", name);
                _element.removeAttr("name");
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            matchedObject.each(function(index, element) {
                var _element = jQuery(this);
                var parentForm = _element.parents("form");

                parentForm.bind("pre_submit", function() {
                    var value = _element.val();
                    if (!value) {
                        return;
                    }
                    var name = _element.attr("data-name");
                    name && _element.attr("name", name);
                });

                parentForm.bind("post_submit", function() {
                    _element.removeAttr("name");
                });
            });
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);
