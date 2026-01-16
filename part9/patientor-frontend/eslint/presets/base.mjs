import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'
import promisePlugin from 'eslint-plugin-promise'
import security from 'eslint-plugin-security'
import unicorn from 'eslint-plugin-unicorn'
import {
  importX,
  flatConfigs as importXFlatConfigs
} from 'eslint-plugin-import-x'

import { importOrderConfig } from './shared.mjs'

export const baseConfig = [
  { ignores: ['eslint.config.mjs', '**/dist/**', '**/build/**'] },

  // Import-X presets (flat config)
  importXFlatConfigs.recommended,

  // Base JS correctness (applies to JS/TS)
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser
    },
    plugins: {
      promise: promisePlugin,
      unicorn,
      security,
      'import-x': importX
    },
    rules: {
      ...js.configs.recommended.rules,

      // Align with Prettier (no semicolons)
      semi: ['error', 'never'],
      'no-extra-semi': 'error',

      // General quality
      eqeqeq: ['error', 'smart'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // Import hygiene
      'import-x/no-duplicates': 'error',
      'import-x/newline-after-import': 'error',
      'import-x/no-unresolved': 'error',
      'import-x/no-extraneous-dependencies': 'error',
      'import-x/no-useless-path-segments': 'warn',
      'import-x/no-cycle': ['warn', { maxDepth: 2 }],
      'import-x/order': ['error', importOrderConfig],

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

      // Turn off noisy/opinionated ones
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/no-array-reduce': 'off',

      // Error handling
      'no-empty': ['error', { allowEmptyCatch: false }],

      // Catch "call vs pass" mistakes
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "CallExpression[callee.name='setTimeout'][arguments.0.type='CallExpression']",
          message:
            'Pass a function to setTimeout, not the result of calling it.'
        },
        {
          selector:
            "CallExpression[callee.name='setInterval'][arguments.0.type='CallExpression']",
          message:
            'Pass a function to setInterval, not the result of calling it.'
        },
        {
          selector:
            "CallExpression[callee.property.name='then'][arguments.0.type='CallExpression']",
          message:
            'Pass a function to then(), e.g. .then(() => ...), not a called result.'
        }
      ]
    }
  },

  // Prettier integration: disable any ESLint stylistic rules that may conflict.
  eslintConfigPrettier
]
