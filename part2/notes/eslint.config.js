import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import promisePlugin from 'eslint-plugin-promise'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
// @ts-expect-error - no type definitions for eslint-plugin-promise
import unicorn from 'eslint-plugin-unicorn'
import globals from 'globals'

export default [
  { ignores: ['**/dist/**'] },

  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      'import/resolver': {
        node: { extensions: ['.js', '.jsx'] },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: importPlugin,
      'jsx-a11y': jsxA11y,
      promise: promisePlugin,
      unicorn: unicorn,
    },
    rules: {
      // Base + React Hooks
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // a11y defaults
      ...jsxA11y.configs.recommended.rules,

      // Align with Prettier (no semicolons)
      semi: ['error', 'never'],
      'no-extra-semi': 'error',

      // General quality
      eqeqeq: ['error', 'smart'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],

      // Import hygiene
      'import/no-duplicates': 'error',
      'import/newline-after-import': 'error',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      // Promise best practices
      'promise/catch-or-return': 'error',
      'promise/no-return-wrap': 'error',

      // Fast-refresh safety
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // Unicorn (curated)
      'unicorn/error-message': 'error',
      'unicorn/no-abusive-eslint-disable': 'error',
      'unicorn/prefer-structured-clone': 'error',
      'unicorn/prefer-node-protocol': 'error',
      'unicorn/consistent-function-scoping': 'warn',
      'unicorn/no-useless-undefined': 'warn',
      'unicorn/prefer-array-find': 'warn',
      'unicorn/prefer-at': 'warn',
      'unicorn/prefer-set-has': 'warn',

      // Turn off noisy/opinionated ones
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/no-array-reduce': 'off',

      // Catch "call vs pass" mistakes and stray expressions
      'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.name='setTimeout'][arguments.0.type='CallExpression']",
          message: 'Pass a function to setTimeout, not the result of calling it.',
        },
        {
          selector: "CallExpression[callee.name='setInterval'][arguments.0.type='CallExpression']",
          message: 'Pass a function to setInterval, not the result of calling it.',
        },
        {
          selector:
            "CallExpression[callee.property.name='then'][arguments.0.type='CallExpression']",
          message: 'Pass a function to then(), e.g. .then(() => ...), not a called result.',
        },
      ],
    },
  },

  // Node scripts and config files
  {
    files: ['**/*.config.*', 'vite.config.*', 'eslint.config.js', 'scripts/**/*.{js,jsx}'],
    languageOptions: {
      globals: globals.node,
      sourceType: 'module',
    },
  },

  // Test files (Vitest globals)
  {
    files: ['**/*.{test,spec}.{js,jsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.vitest },
    },
  },

  // Prettier integration (flat config): disables all ESLint stylistic rules that may conflict with Prettier formatting, ensuring consistent code style.
  eslintConfigPrettier,
]
