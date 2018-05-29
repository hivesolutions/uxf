<template>
<ul class="drop-down" data-name="Drop Down">
    <li>
        <span>No Operation 1</span>
    </li>
    <li>
        <span>No Operation 2</span>
    </li>
    <li>
        <span>No Operation 3</span>
    </li>
    <li>
        <a href="http://www.hive.pt" target="_blank">Hive Website</a>
    </li>
    <li>
        <a href="/about">About</a>
    </li>
</ul>
</template>

<style scoped>
</style>

<script>
import Vue from "vue";

export const UxDropDown = Vue.component("uxdropdown", {
    data: function() {
        return {
            isEnabled: true
        };
    },
    mounted: function () {
        var vm = this;
        var element = jQuery(this.$el);
        element.uxdropdown();
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

export default UxDropDown;
</script>
