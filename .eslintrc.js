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
        "no-debugger": "warn",
        "brace-style": "off",
        "operator-linebreak": "off",
        "standard/no-callback-literal": "off"
    },
    "env": {
        "jasmine": true
    }
};
