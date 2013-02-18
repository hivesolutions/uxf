(function(jQuery) {
    jQuery.fn.uxdatasourcecountries = function(options) {
        // the set of countries to be used
        var COUNTRIES = ["Afghanistan", "Albania", "Algeria", "Andorra",
                "Angola", "Antigua & Deps", "Argentina", "Armenia",
                "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain",
                "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize",
                "Benin", "Bhutan", "Bolivia", "Bosnia Herzegovina", "Botswana",
                "Brazil", "Brunei", "Bulgaria", "Burkina", "Burundi",
                "Cambodia", "Cameroon", "Canada", "Cape Verde",
                "Central African Rep", "Chad", "Chile", "China", "Colombia",
                "Comoros", "Congo", "Congo {Democratic Rep}", "Costa Rica",
                "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark",
                "Djibouti", "Dominica", "Dominican Republic", "East Timor",
                "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea",
                "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France",
                "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece",
                "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
                "Haiti", "Honduras", "Hungary", "Iceland", "India",
                "Indonesia", "Iran", "Iraq", "Ireland {Republic}", "Israel",
                "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan",
                "Kazakhstan", "Kenya", "Kiribati", "Korea North",
                "Korea South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos",
                "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya",
                "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia",
                "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali",
                "Malta", "Marshall Islands", "Mauritania", "Mauritius",
                "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia",
                "Montenegro", "Morocco", "Mozambique", "Myanmar, {Burma}",
                "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand",
                "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan",
                "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru",
                "Philippines", "Poland", "Portugal", "Qatar", "Romania",
                "Russian Federation", "Rwanda", "St Kitts & Nevis", "St Lucia",
                "Saint Vincent & the Grenadines", "Samoa", "San Marino",
                "Sao Tome & Principe", "Saudi Arabia", "Senegal", "Serbia",
                "Seychelles", "Sierra Leone", "Singapore", "Slovakia",
                "Slovenia", "Solomon Islands", "Somalia", "South Africa",
                "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland",
                "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan",
                "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad & Tobago",
                "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda",
                "Ukraine", "United Arab Emirates", "United Kingdom",
                "United States", "Uruguay", "Uzbekistan", "Vanuatu",
                "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia",
                "Zimbabwe"];

        // the default values for the data source local
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
            // iterates over all the elements in the matched object
            matchedObject.each(function(index, element) {
                        // retrieves the element reference
                        var _element = jQuery(element);

                        // updates the items data in the current element
                        // ands runs the initializer of the items data
                        // source extension
                        _element.data("items", COUNTRIES);
                        _element.uxdatasourceitems();
                    });
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
