jQuery.fn.uxcontent = function(value) {
    var element = jQuery(this);
    var other = element.clone();
    var children = other.children();
    children.remove();
    if (typeof value === "string") {
        other.html(value);
        element.html(children);
        element.prepend(value);
    }
    return other.html();
}
