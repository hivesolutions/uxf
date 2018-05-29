<template>
<div class="button button-color" v-bind:class="{ visible: isVisible }">Button</div>
</template>

<style scoped>
</style>

<script>
import Vue from "vue";

export const UxButton = Vue.component("uxbutton", {
    data: function() {
        return {
            isVisible: false
        };
    },
    methods: {
        show: function() {
            this.isVisible = true;
        },
        hide: function() {
            this.isVisible = false;
        }
    }
});

export default UxButton;
</script>
