jQuery.expr[":"].parents = function(a, i, m) {
    return jQuery(a).parents(m[3]).length < 1;
};
