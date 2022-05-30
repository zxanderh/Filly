module.exports = {
	env: {
		commonjs: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:mocha/recommended',
	],
	parserOptions: {
		ecmaVersion: 6,
	},
	plugins: [
		'mocha',
	],
	rules: {
		indent: [
			'error',
			'tab',
		],
		'linebreak-style': [
			'error',
			'unix',
		],
		quotes: [
			'warn',
			'single',
		],
		semi: [
			'error',
			'always',
		],
		'no-unused-vars': [
			'warn',
		],
		'prefer-arrow-callback': [
			'warn',
		],
		'no-trailing-spaces': [
			'warn',
		],
		'comma-dangle': [
			'warn',
			'always-multiline',
		],
		'eol-last': [
			'error',
			'always',
		],
	},
};
