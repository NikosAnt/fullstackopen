import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import security from 'eslint-plugin-security'
import importPlugin from 'eslint-plugin-import'
import promisePlugin from 'eslint-plugin-promise'
import nPlugin from 'eslint-plugin-n'
import unicorn from 'eslint-plugin-unicorn'
import perfectionist from 'eslint-plugin-perfectionist'
import markdown from '@eslint/markdown'
import jsonc from 'eslint-plugin-jsonc'
import jsoncParser from 'jsonc-eslint-parser'
import globals from 'globals'

export default [
  { ignores: ['**/dist/**'] },

  // Backend source files (Node.js environment)
  {
    files: [
      'controllers/**/*.js',
      'models/**/*.js',
      'utils/**/*.js',
      'index.js',
      'app.js'
      // add other backend folders/files as needed
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node
    },
    plugins: {
      import: importPlugin,
      promise: promisePlugin,
      n: nPlugin,
      unicorn: unicorn,
      security: security,
      perfectionist
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.json']
        }
      }
    },
    rules: {
      ...js.configs.recommended.rules,
      // General quality
      eqeqeq: ['error', 'smart'],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // Import hygiene
      'import/no-duplicates': 'error',
      'import/newline-after-import': 'error',
      'import/no-unresolved': 'error',
      'import/no-extraneous-dependencies': 'error',
      // Deterministic import sorting (replaces import/order + alphabetize)
      'perfectionist/sort-imports': [
        'warn',
        {
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
          ]
        }
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
      // Turn off noisy/opinionated ones
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/no-array-reduce': 'off',
      // Catch "call vs pass" mistakes and stray expressions
      'no-unused-expressions': [
        'error',
        { allowShortCircuit: true, allowTernary: true }
      ],
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
      ],
      // Node.js best practices (eslint-plugin-n)
      'n/no-deprecated-api': 'error',
      'n/no-unsupported-features/es-syntax': 'error',
      'n/prefer-node-protocol': 'error',
      'n/no-missing-import': 'error',
      // Express/Mongoose specific rules
      'n/no-process-exit': 'error',
      'n/no-sync': 'error',
      'n/handle-callback-err': 'error',
      'n/no-new-require': 'error'
    }
  },

  // JSON: strict JSON files
  {
    files: ['**/*.json'],
    languageOptions: { parser: jsoncParser },
    plugins: { jsonc },
    rules: {
      ...jsonc.configs['recommended-with-json'].rules
    }
  },

  // JSONC/JSON5: allow comments/trailing commas
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
      globals: globals.node
    },
    rules: {
      ...js.configs.recommended.rules,
      // Reduce noise in docs code blocks
      'no-undef': 'off',
      'no-unused-vars': 'off'
    }
  },

  // Node scripts and config files
  {
    files: ['*.config.*', '{vite,eslint}.config.*', 'scripts/**/*.{js,jsx}'],
    languageOptions: {
      globals: globals.node,
      sourceType: 'module'
    }
  },

  // Test files (keep Vitest globals if you use Vitest; no plugin needed)
  {
    files: ['**/*.{test,spec}.js', 'tests/**/*.js'],
    languageOptions: {
      globals: { ...globals.node, ...globals.vitest }
    }
    // Temporarily disabled due to ESLint 9 compatibility
    // rules: {
    //   ...vitest.configs.recommended.rules,
    // },
  },

  // Prettier integration: disables all ESLint stylistic rules that may conflict with Prettier formatting.
  // This should always be the last item in the config array to ensure it disables any conflicting rules from previous configs,
  // guaranteeing consistent code style for future maintainers.
  eslintConfigPrettier
]
