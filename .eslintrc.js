module.exports = {
    "extends": [
        "standard",
        "plugin:vue/essential"
    ],
    "plugins": ["mocha", "vue"],
    "rules": {
        "indent": ["warn", 4, {
            SwitchCase: 1
        }],
        "quotes": ["error", "double"],
        "semi": ["error", "always"],
        "space-before-function-paren": ["error", "never"],
        "mocha/no-exclusive-tests": "error",
        "no-debugger": "warn"
    },
    "env": {
        "jasmine": true
    }
};
