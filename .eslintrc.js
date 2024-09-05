module.exports = {
  extends: ["expo", "prettier"],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": ["error", { singleQuote: false }],
    quotes: ["error", "double", { avoidEscape: true }],
  },
};
