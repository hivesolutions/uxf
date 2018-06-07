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
        "space-before-function-paren": ["error", {
            "anonymous": "never",
            "named": "never",
            "asyncArrow": "always"
        }],
        "mocha/no-exclusive-tests": "error",
        "no-debugger": "warn",
        "brace-style": "off",
        "no-useless-escape": "off",
        "no-mixed-operators": "off",
        "operator-linebreak": "off",
        "standard/no-callback-literal": "off",
        "standard/computed-property-even-spacing": "off"
    },
    "env": {
        "jasmine": true
    }
};
