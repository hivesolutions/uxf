<template>
<div class="button button-color">
    <slot></slot>
</div>
</template>

<style scoped>
</style>

<script>
import Vue from "vue";

export const UxButton = Vue.component("uxbutton", {
    data: function() {
        return {
            isEnabled: true
        };
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
    }
});

export default UxButton;
</script>
