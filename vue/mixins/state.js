import jQuery from "jquery";

export const state = {
    data: function() {
        return {
            isEnabled: true
        };
    },
    methods: {
        enable: function() {
            this.isEnabled = false;
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
};
