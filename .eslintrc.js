module.exports = {
    extends: ["expo", "prettier"],
    plugins: ["prettier"],
    rules: {
        "prettier/prettier": [
            "error",
            {
                printWidth: 80,
                tabWidth: 4,
                semi: true,
                singleQuote: false,
                trailingComma: "es5",
                bracketSpacing: true,
                jsxBracketSameLine: false,
            },
        ],
    },
};
