<template>
    <div class="button button-color" v-bind:class="buttonColor">
        <slot></slot>
    </div>
</template>

<style scoped></style>

<script>
import Vue from "vue";
import jQuery from "jquery";
import "base";

import { state } from "../../mixins";

export const UxButton = Vue.component("ux-button", {
    mixins: [state],
    props: {
        color: {
            type: String,
            default: function() {
                return "";
            }
        }
    },
    mounted: function() {
        var vm = this;
        var element = jQuery(this.$el);
        element.uxbutton();
        element.bind("click", function() {
            vm.$emit("click");
        });
    },
    computed: {
        buttonColor: function() {
            return this.color ? `button-${this.color}` : null;
        }
    }
});

export default UxButton;
</script>
