import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import promisePlugin from 'eslint-plugin-promise'
import playwright from 'eslint-plugin-playwright'
import unicorn from 'eslint-plugin-unicorn'
import globals from 'globals'

export default [
  { ignores: ['**/dist/**', 'test-results/**', 'playwright-report/**'] },

  // Playwright test files
  {
    files: ['**/*.spec.js', '**/*.test.js', 'tests/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node, ...globals.browser },
    },
    plugins: {
      import: importPlugin,
      promise: promisePlugin,
      playwright: playwright,
      unicorn: unicorn,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...playwright.configs.recommended.rules,
      // General quality
      eqeqeq: ['error', 'smart'],
      'no-console': 'off', // Allow console in tests
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      // Import hygiene
      'import/no-duplicates': 'error',
      'import/newline-after-import': 'error',
      'import/no-unresolved': 'error',
      'import/no-extraneous-dependencies': 'error',
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
      // Turn off noisy ones
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/no-array-reduce': 'off',
      // Test-specific
      'no-unused-expressions': [
        'error',
        { allowShortCircuit: true, allowTernary: true },
      ],
    },
  },

  // Config files
  {
    files: ['*.config.*', 'playwright.config.js'],
    languageOptions: {
      globals: globals.node,
      sourceType: 'module',
    },
  },

  // Prettier integration
  eslintConfigPrettier,
]
