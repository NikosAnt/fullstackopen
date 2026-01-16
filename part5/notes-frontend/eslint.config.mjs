import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import promisePlugin from 'eslint-plugin-promise'
import reactPlugin from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import unicorn from 'eslint-plugin-unicorn'
import vitest from 'eslint-plugin-vitest'
import globals from 'globals'

export default [
  { ignores: ['**/dist/**'] },

  // Frontend source files (browser environment)
  {
    files: [
      'src/**/*.{js,jsx}',
      'public/**/*.{js,jsx}',
      // add other frontend folders/files as needed
    ],
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
      react: {
        version: 'detect',
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: importPlugin,
      'jsx-a11y': jsxA11y,
      promise: promisePlugin,
      unicorn: unicorn,
      vitest: vitest,
    },
    rules: {
      // Base + React + React Hooks
      ...js.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // Disable React import requirement for JSX (modern React 17+ with new JSX transform)
      'react/react-in-jsx-scope': 'off',

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
      'import/no-unresolved': 'error',
      'import/no-extraneous-dependencies': 'error',
      'import/no-named-as-default': 'error',
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

      // Security (frontend-specific security rules can be added here if needed)

      // Complexity and maintainability (disabled for React components)
      complexity: 'off',
      'max-depth': 'off',
      'max-lines-per-function': 'off',
      'max-params': 'off',

      // Error handling
      'no-empty': ['error', { allowEmptyCatch: false }],

      // Fast-refresh safety
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

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
      'no-unused-expressions': [
        'error',
        { allowShortCircuit: true, allowTernary: true },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "CallExpression[callee.name='setTimeout'][arguments.0.type='CallExpression']",
          message:
            'Pass a function to setTimeout, not the result of calling it.',
        },
        {
          selector:
            "CallExpression[callee.name='setInterval'][arguments.0.type='CallExpression']",
          message:
            'Pass a function to setInterval, not the result of calling it.',
        },
        {
          selector:
            "CallExpression[callee.property.name='then'][arguments.0.type='CallExpression']",
          message:
            'Pass a function to then(), e.g. .then(() => ...), not a called result.',
        },
      ],
    },
  },

  // Node scripts and config files
  {
    files: ['*.config.*', '{vite,eslint}.config.*', 'scripts/**/*.{js,jsx}'],
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
    // Temporarily disabled due to ESLint 9 compatibility
    // rules: {
    //   ...vitest.configs.recommended.rules,
    // },
  },

  // Prettier integration: disables all ESLint stylistic rules that may conflict with Prettier formatting.
  // This should always be the last item in the config array to ensure it disables any conflicting rules from previous configs,
  // guaranteeing consistent code style for future maintainers.
  eslintConfigPrettier,
]
