module.exports = {
	extends: ["expo"],
	rules: {
		"@typescript-eslint/no-unused-vars": "warn",
		"react-hooks/exhaustive-deps": "warn",
		"no-console": "off",
		"import/order": [
			"warn",
			{
				groups: [
					"builtin",
					"external",
					"internal",
					"parent",
					"sibling",
					"index",
				],
				"newlines-between": "always",
				alphabetize: {
					order: "asc",
					caseInsensitive: true,
				},
			},
		],
	},
	env: {
		jest: true,
	},
	overrides: [
		{
			files: ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}"],
			rules: {
				"@typescript-eslint/no-explicit-any": "off",
				"react/display-name": "off",
				"@typescript-eslint/no-var-requires": "off",
			},
		},
	],
};
