<template>
<div class="button button-color" v-bind:class="buttonColor">
    <slot></slot>
</div>
</template>

<style scoped>
</style>

<script>
import Vue from "vue";
import jQuery from "jquery";
import "base";

export const UxButton = Vue.component("ux-button", {
    data: function() {
        return {
            isEnabled: true
        };
    },
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
    methods: {
        enable: function() {
            this.isEnabled = true;
        },
        disable: function() {
            this.isEnabled = false;
        }
    },
    watch: {
        isEnabled: function(val) {
            if (val) {
                jQuery(this.$el).uxenable();
            } else {
                jQuery(this.$el).uxdisable();
            }
        }
    },
    computed: {
        buttonColor: function() {
            return this.color ? `button-${this.color}` : null;
        }
    }
});

export default UxButton;
</script>
