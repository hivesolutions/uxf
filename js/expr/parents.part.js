if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

jQuery.expr[":"].parents = function(a, i, m) {
    return jQuery(a).parents(m[3]).length > 0;
};
