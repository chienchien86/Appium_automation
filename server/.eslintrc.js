module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true,
        "mocha": true
    },
    "extends": "airbnb",
    "rules": {
        // "no-restricted-syntax": 0,
        "no-unused-vars": "warn",
        "indent": [
            "error",
            4,
            {
                "SwitchCase": 0
            }
        ],
        "no-underscore-dangle": [0],
        "no-console": [
            "error",
            {
                "allow": ["warn", "error", "log"] 
            }
        ],
    }
};