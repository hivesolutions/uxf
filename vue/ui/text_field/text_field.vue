<template>
    <input
        type="text"
        class="text-field"
        v-bind:data-type="type"
        v-bind:data-original_value="originalValue"
    />
</template>

<style scoped></style>

<script>
import Vue from "vue";
import jQuery from "jquery";
import "base";

import { state } from "../../mixins";

export const UxTextField = Vue.component("ux-text-field", {
    mixins: [state],
    props: {
        type: {
            type: String,
            default: function() {
                return "text";
            }
        },
        originalValue: {
            type: String,
            default: function() {
                return "";
            }
        }
    },
    mounted: function() {
        var vm = this;
        var element = jQuery(this.$el);
        element.uxtextfield();
        element.bind("_focus", function() {
            vm.$emit("_focus");
        });
        element.bind("_blur", function() {
            vm.$emit("_blur");
        });
        element.bind("value_change", function(event, value) {
            vm.$emit("value_change", value);
        });
    }
});

export default UxTextField;
</script>
