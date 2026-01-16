// ESLint config for a modern TypeScript Node.js backend project
// - Uses flat config array for flexible overrides
// - Integrates Prettier, security, import, promise, unicorn, and TypeScript plugins
// - Handles JSON, JSONC, Markdown, and test files
// - Allows comments in tsconfig.json only
// - Ignores build/dist output
import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import security from 'eslint-plugin-security'
import { createNodeResolver, importX } from 'eslint-plugin-import-x'
import promisePlugin from 'eslint-plugin-promise'
import nPlugin from 'eslint-plugin-n'
import unicorn from 'eslint-plugin-unicorn'
import markdown from '@eslint/markdown'
import jsonc from 'eslint-plugin-jsonc'
import jsoncParser from 'jsonc-eslint-parser'
import globals from 'globals'
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'
import tseslint from 'typescript-eslint'
import vitest from '@vitest/eslint-plugin'

export default [
  // Ignore build outputs
  { ignores: ['**/dist/**', '**/build/**'] },

  // Import-X presets (flat config)
  // Keep these early so the more specific rules below can override if needed.
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,

  // Backend source files (Node.js environment)
  // All main app logic, models, controllers, and utilities
  {
    files: ['**/*.{js,ts}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tseslint.parser, // Use TypeScript parser for .ts files
      parserOptions: {
        project: ['./tsconfig.json'], // Enable type-aware linting
        tsconfigRootDir: process.cwd()
      },
      globals: globals.node
    },
    plugins: {
      'import-x': importX,
      promise: promisePlugin,
      n: nPlugin,
      unicorn: unicorn,
      security: security,
      '@typescript-eslint': tseslint.plugin
    },
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          project: ['./tsconfig.json'],
          alwaysTryTypes: true
        }),
        createNodeResolver({
          extensions: ['.js', '.ts', '.json']
        })
      ]
    },
    // Rules: combine recommended, TS, and project-specific
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.strictTypeChecked.rules,
      // General code quality
      eqeqeq: ['error', 'smart'],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' }
      ],
      // Prefer inline type modifiers for cleaner imports
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports'
        }
      ],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
            // Allow void-returning async handlers in Express-like APIs
            // where frameworks ignore returned promises.
            attributes: false,
            returns: false
          },
          checksConditionals: true
        }
      ],
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/no-confusing-void-expression': [
        'error',
        { ignoreArrowShorthand: true }
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': [
        'warn',
        { ignoreTernaryTests: true }
      ],
      '@typescript-eslint/no-explicit-any': [
        'error',
        { fixToUnknown: true, ignoreRestArgs: false }
      ],
      // Security: flag risky dynamic object key access
      'security/detect-object-injection': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      // Extra strictness for type safety
      '@typescript-eslint/strict-boolean-expressions': 'warn',
      '@typescript-eslint/no-base-to-string': 'warn',
      '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
      '@typescript-eslint/prefer-reduce-type-parameter': 'warn',
      // Import hygiene and order
      'import-x/no-duplicates': 'error',
      'import-x/newline-after-import': 'error',
      'import-x/no-named-as-default-member': 'off',
      'import-x/no-unresolved': 'error',
      'import-x/no-extraneous-dependencies': 'error',
      'import-x/no-useless-path-segments': 'warn',
      'import-x/no-cycle': ['warn', { maxDepth: 2 }],
      // Import order: external first, then internal/project, no forced alpha
      'import-x/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index'
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'ignore' },
          pathGroups: [
            {
              pattern: '**/**',
              group: 'internal',
              position: 'after'
            }
          ],
          pathGroupsExcludedImportTypes: ['builtin']
        }
      ],
      // Promise best practices
      'promise/always-return': 'warn',
      'promise/no-nesting': 'warn',
      'promise/catch-or-return': 'error',
      'promise/no-return-wrap': 'error',
      // Unicorn plugin: modern JS best practices
      'unicorn/error-message': 'error',
      'unicorn/no-abusive-eslint-disable': 'error',
      'unicorn/prefer-structured-clone': 'error',
      'unicorn/prefer-node-protocol': 'error',
      'unicorn/consistent-function-scoping': 'warn',
      'unicorn/no-useless-undefined': 'warn',
      'unicorn/prefer-array-find': 'warn',
      'unicorn/prefer-at': 'warn',
      'unicorn/prefer-set-has': 'warn',
      // Turn off noisy/opinionated unicorn rules
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/no-array-reduce': 'off',
      // Catch common mistakes: call vs pass, stray expressions
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
      'n/no-process-env': 'warn',
      'n/no-missing-import': [
        'error',
        {
          tryExtensions: ['.ts', '.tsx', '.d.ts', '.js', '.jsx', '.json']
        }
      ],
      // Express/Mongoose specific rules
      'n/no-process-exit': 'error',
      'n/no-sync': 'error',
      'n/handle-callback-err': 'error',
      'n/no-new-require': 'error',
      // Security hardening (eslint-plugin-security)
      'security/detect-non-literal-regexp': 'warn',
      'security/detect-non-literal-fs-filename': 'warn',
      'security/detect-possible-timing-attacks': 'warn',
      // Logging policy: allow console but discourage bare logs
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }]
    }
  },

  // JSON: strict JSON files (no comments allowed by default)
  {
    files: ['**/*.json'],
    languageOptions: { parser: jsoncParser },
    plugins: { jsonc },
    rules: {
      ...jsonc.configs['recommended-with-json'].rules
    }
  },

  // Allow comments in tsconfig.json (for documentation and clarity)
  {
    files: ['tsconfig.json'],
    languageOptions: { parser: jsoncParser },
    plugins: { jsonc },
    rules: {
      ...jsonc.configs['recommended-with-json'].rules,
      'jsonc/no-comments': 'off'
    }
  },

  // JSONC/JSON5: allow comments/trailing commas (for config files that support them)
  {
    files: ['**/*.jsonc', '**/*.json5'],
    languageOptions: { parser: jsoncParser },
    plugins: { jsonc },
    rules: {
      ...jsonc.configs['recommended-with-jsonc'].rules
    }
  },

  // Markdown: lint code blocks using ESLint (for docs and examples)
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

  // Node scripts and config files (e.g., vite.config.js, eslint.config.js)
  {
    files: ['*.config.*', '{vite,eslint}.config.*', 'scripts/**/*.{js,jsx}'],
    plugins: {
      'import-x': importX
    },
    languageOptions: {
      globals: globals.node,
      sourceType: 'module'
    },
    rules: {
      'import-x/no-named-as-default-member': 'off'
    }
  },

  // Test files (keep Vitest globals if you use Vitest; no plugin needed)
  {
    files: ['**/*.{test,spec}.{js,ts}', 'tests/**/*.{js,ts}'],
    languageOptions: {
      globals: { ...globals.node, ...globals.vitest }
    },
    rules: {
      // Vitest recommended rules
      ...(vitest.configs?.recommended?.rules ?? {}),
      // Relax strictness for testing ergonomics
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off'
    }
  },

  // Prettier integration: disables all ESLint stylistic rules that may conflict with Prettier formatting.
  // Always keep this as the last item to guarantee consistent code style and avoid rule conflicts.
  eslintConfigPrettier
]
