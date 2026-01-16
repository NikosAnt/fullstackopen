import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import promisePlugin from 'eslint-plugin-promise'
import playwright from 'eslint-plugin-playwright'
import unicorn from 'eslint-plugin-unicorn'
import perfectionist from 'eslint-plugin-perfectionist'
import n from 'eslint-plugin-n'
import markdown from '@eslint/markdown'
import jsonc from 'eslint-plugin-jsonc'
import jsoncParser from 'jsonc-eslint-parser'
import globals from 'globals'

// Configure Perfectionist import sorting with reduced noise and alias grouping
const perfectionistImportOptions = {
  type: 'natural',
  order: 'asc',
  ignoreCase: true,
  newlinesBetween: 'always',
  groups: [
    'type',
    'builtin',
    'external',
    'internal',
    ['parent', 'sibling', 'index', 'object']
  ],
  internalPattern: ['^@/', '^~/', '^#/']
}

// Soften Node plugin recommended rules to warnings for scripts/configs
const nRecommendedWarn = n?.configs?.['flat/recommended']?.rules
  ? Object.fromEntries(
      Object.keys(n.configs['flat/recommended'].rules).map(k => [k, 'warn'])
    )
  : n?.configs?.recommended?.rules
    ? Object.fromEntries(
        Object.keys(n.configs.recommended.rules).map(k => [k, 'warn'])
      )
    : {}

export default [
  { ignores: ['**/dist/**', 'test-results/**', 'playwright-report/**'] },

  // Playwright test files
  {
    files: ['**/*.spec.js', '**/*.test.js', 'tests/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node, ...globals.browser }
    },
    plugins: {
      import: importPlugin,
      promise: promisePlugin,
      playwright: playwright,
      unicorn: unicorn,
      perfectionist
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
      // Deterministic import sorting (replaces import/order + alphabetize)
      'perfectionist/sort-imports': ['warn', perfectionistImportOptions],
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
        { allowShortCircuit: true, allowTernary: true }
      ]
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
        }
      }
    }
  },

  // Config files
  {
    files: ['*.config.*', 'playwright.config.js'],
    languageOptions: {
      globals: globals.node,
      sourceType: 'module'
    },
    plugins: { n },
    rules: {
      ...nRecommendedWarn,
      // Config files legitimately import dev-only tooling; silence noisy checks
      'n/no-unpublished-import': 'off',
      'n/no-unpublished-require': 'off'
    }
  },

  // JSON files (strict JSON)
  {
    files: ['**/*.json'],
    languageOptions: { parser: jsoncParser },
    plugins: { jsonc },
    rules: {
      ...jsonc.configs['recommended-with-json'].rules
    }
  },

  // JSONC/JSON5 files
  {
    files: ['**/*.jsonc', '**/*.json5'],
    languageOptions: { parser: jsoncParser },
    plugins: { jsonc },
    rules: {
      ...jsonc.configs['recommended-with-jsonc'].rules
    }
  },

  // Markdown: lint code blocks using ESLint
  {
    files: ['**/*.md'],
    plugins: { markdown },
    processor: markdown.processors.markdown
  },
  {
    files: ['**/*.md/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node, ...globals.browser }
    },
    rules: {
      ...js.configs.recommended.rules,
      // Reduce noise in docs code blocks
      'no-undef': 'off',
      'no-unused-vars': 'off'
    }
  },

  // Prettier integration
  eslintConfigPrettier
]
