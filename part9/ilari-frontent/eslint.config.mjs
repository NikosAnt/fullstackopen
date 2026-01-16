// ESLint flat config for a React + TypeScript frontend.
// Goals:
// - Type-aware linting for TS/TSX (catches real runtime bugs)
// - Strict import hygiene and consistent ordering (import-x)
// - React/Redux/TanStack best-practices where available
// - Keep React ergonomics reasonable (some strict rules are tuned)
// - Prettier stays in charge of formatting (ESLint does correctness)

import js from '@eslint/js'
import markdown from '@eslint/markdown'
import eslintConfigPrettier from 'eslint-config-prettier'
import cssModules from 'eslint-plugin-css-modules'
import { createNodeResolver, importX } from 'eslint-plugin-import-x'
import security from 'eslint-plugin-security'
import jestDom from 'eslint-plugin-jest-dom'
import jsonc from 'eslint-plugin-jsonc'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import n from 'eslint-plugin-n'
import promisePlugin from 'eslint-plugin-promise'
import reactPlugin from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import reactRedux from 'eslint-plugin-react-redux'
import tailwindcss from 'eslint-plugin-tailwindcss'
import testingLibrary from 'eslint-plugin-testing-library'
import unicorn from 'eslint-plugin-unicorn'
import globals from 'globals'
import jsoncParser from 'jsonc-eslint-parser'
import tanstackQuery from '@tanstack/eslint-plugin-query'
import tanstackRouter from '@tanstack/eslint-plugin-router'
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'
import tseslint from 'typescript-eslint'
import vitest from '@vitest/eslint-plugin'

// Tailwind rules are valuable but noisy when introducing Tailwind; keep as warnings.
const tailwindRecommendedWarn = tailwindcss?.configs?.recommended?.rules
  ? Object.fromEntries(
    Object.keys(tailwindcss.configs.recommended.rules).map(key => [
      key,
      'warn'
    ])
  )
  : {}

// Import ordering aligned with backend (no forced alphabetizing; consistent groups/newlines).
const importOrderConfig = {
  groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
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

// Node rules are useful for scripts/configs, but we keep them as warnings
// since this is primarily a browser app.
const nRecommendedWarn = n?.configs?.['flat/recommended']?.rules
  ? Object.fromEntries(
    Object.keys(n.configs['flat/recommended'].rules).map(key => [key, 'warn'])
  )
  : n?.configs?.recommended?.rules
    ? Object.fromEntries(
      Object.keys(n.configs.recommended.rules).map(key => [key, 'warn'])
    )
    : {}

// Type-aware linting:
// - points ESLint to your TS projects
// - enables rules that require type information
const typeScriptProjectParserOptions = {
  project: ['./tsconfig.json', './tsconfig.node.json'],
  tsconfigRootDir: import.meta.dirname,
  noWarnOnMultipleProjects: true
}

const config = [
  { ignores: ['**/dist/**', '**/build/**'] },

  // Import-X presets (flat config)
  // Keep these early so the more specific rules below can override if needed.
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,

  // Frontend TS/TSX source files (browser environment)
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        ...typeScriptProjectParserOptions,
        ecmaFeatures: { jsx: true }
      }
    },
    settings: {
      // Make import-x understand TS path resolution + node-style resolution.
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          project: ['./tsconfig.json', './tsconfig.node.json'],
          alwaysTryTypes: true,
          noWarnOnMultipleProjects: true
        }),
        createNodeResolver({
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
        })
      ],
      react: {
        version: 'detect'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react: reactPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'react-redux': reactRedux,
      'import-x': importX,
      'jsx-a11y': jsxA11y,
      promise: promisePlugin,
      unicorn: unicorn,
      security: security,
      tailwindcss,
      'css-modules': cssModules,
      // Ecosystem-specific rules
      '@tanstack/query': tanstackQuery,
      '@tanstack/router': tanstackRouter
    },
    rules: {
      // Base + TypeScript + React + React Hooks
      ...js.configs.recommended.rules,
      // Use strict type-checked TypeScript rules (similar strictness to backend).
      ...tseslint.configs.strictTypeChecked
        .map(c => c.rules ?? {})
        .reduce((acc, rules) => ({ ...acc, ...rules }), {}),
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // Redux + TanStack (recommended rulesets)
      ...(reactRedux.configs?.recommended?.rules ?? {}),
      ...(tanstackQuery.configs?.['flat/recommended']?.rules ??
        tanstackQuery.configs?.recommended?.rules ??
        {}),
      ...(tanstackRouter.configs?.['flat/recommended']?.rules ??
        tanstackRouter.configs?.recommended?.rules ??
        {}),

      // Disable React import requirement for JSX (modern React 17+ with new JSX transform)
      'react/react-in-jsx-scope': 'off',

      // TypeScript already covers props typing
      'react/prop-types': 'off',

      // Prefer inline type modifiers for cleaner imports
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' }
      ],

      // Promise discipline (keep ergonomic for React event handlers)
      // React event handlers often return void; we still want promise safety.
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
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

      // Extra strictness for type safety (modeled after backend)
      'security/detect-object-injection': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/strict-boolean-expressions': 'warn',
      '@typescript-eslint/no-base-to-string': 'warn',
      '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
      '@typescript-eslint/prefer-reduce-type-parameter': 'warn',
      '@typescript-eslint/no-explicit-any': [
        'error',
        { fixToUnknown: true, ignoreRestArgs: false }
      ],

      // a11y defaults
      ...jsxA11y.configs.recommended.rules,

      // Align with Prettier (no semicolons)
      semi: ['error', 'never'],
      'no-extra-semi': 'error',

      // General quality
      eqeqeq: ['error', 'smart'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // Prefer TS-aware unused checks
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { varsIgnorePattern: '^[A-Z_]' }
      ],

      // Import hygiene
      'import-x/no-duplicates': 'error',
      'import-x/newline-after-import': 'error',
      'import-x/no-unresolved': 'error',
      'import-x/no-extraneous-dependencies': 'error',
      'import-x/no-named-as-default-member': 'off',
      'import-x/no-useless-path-segments': 'warn',
      'import-x/no-cycle': ['warn', { maxDepth: 2 }],
      // Import order (modeled after backend config)
      'import-x/order': ['error', importOrderConfig],

      // Promise best practices
      'promise/catch-or-return': 'error',
      'promise/no-return-wrap': 'error',

      // Tailwind CSS (warnings while adopting)
      ...tailwindRecommendedWarn,

      // CSS Modules (only takes effect when using .module.css imports)
      'css-modules/no-unused-class': 'warn',
      'css-modules/no-undef-class': 'error',

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
        { allowConstantExport: true }
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
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': [
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
      ]
    }
  },

  // Frontend JS/JSX files (browser environment)
  {
    files: ['src/**/*.{js,jsx}', 'public/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true }
      }
    },
    settings: {
      // Keep the same resolver behavior as TS/TSX (helps mixed JS/TS repos).
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          project: ['./tsconfig.json', './tsconfig.node.json'],
          alwaysTryTypes: true,
          noWarnOnMultipleProjects: true
        }),
        createNodeResolver({
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
        })
      ],
      react: {
        version: 'detect'
      }
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'react-redux': reactRedux,
      'import-x': importX,
      'jsx-a11y': jsxA11y,
      promise: promisePlugin,
      unicorn: unicorn,
      security: security,
      tailwindcss,
      'css-modules': cssModules,
      // Ecosystem-specific rules
      '@tanstack/query': tanstackQuery,
      '@tanstack/router': tanstackRouter
    },
    rules: {
      // Base + React + React Hooks
      ...js.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...(reactRedux.configs?.recommended?.rules ?? {}),
      ...(tanstackQuery.configs?.['flat/recommended']?.rules ??
        tanstackQuery.configs?.recommended?.rules ??
        {}),
      ...(tanstackRouter.configs?.['flat/recommended']?.rules ??
        tanstackRouter.configs?.recommended?.rules ??
        {}),

      // Disable React import requirement for JSX (modern React 17+ with new JSX transform)
      'react/react-in-jsx-scope': 'off',

      // TypeScript projects don't need runtime prop-types
      'react/prop-types': 'off',

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
      'import-x/no-duplicates': 'error',
      'import-x/newline-after-import': 'error',
      'import-x/no-unresolved': 'error',
      'import-x/no-extraneous-dependencies': 'error',
      'import-x/no-named-as-default-member': 'off',
      'import-x/no-useless-path-segments': 'warn',
      'import-x/no-cycle': ['warn', { maxDepth: 2 }],
      // Import order (modeled after backend config)
      'import-x/order': ['error', importOrderConfig],

      // Promise best practices
      'promise/catch-or-return': 'error',
      'promise/no-return-wrap': 'error',

      // Tailwind CSS (warnings while adopting)
      ...tailwindRecommendedWarn,

      // CSS Modules (only takes effect when using .module.css imports)
      'css-modules/no-unused-class': 'warn',
      'css-modules/no-undef-class': 'error',

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
        { allowConstantExport: true }
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
      ]
    }
  },

  // Node scripts and config files
  {
    files: [
      '*.config.*',
      '{vite,eslint}.config.*',
      'scripts/**/*.{js,jsx,ts,tsx}',
      'vite.config.ts'
    ],
    languageOptions: {
      globals: globals.node,
      sourceType: 'module',
      parser: tseslint.parser
    },
    plugins: { n, 'import-x': importX },
    rules: {
      ...nRecommendedWarn,
      'n/no-unsupported-features/node-builtins': 'off',
      // Config files often import packages with CJS/ESM interop quirks
      'import-x/default': 'off',
      'import-x/no-named-as-default-member': 'off'
    }
  },

  // Test files (Vitest globals)
  {
    files: ['**/*.{test,spec}.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.vitest }
    },
    plugins: {
      vitest,
      'testing-library': testingLibrary,
      'jest-dom': jestDom
    },
    rules: {
      // Vitest recommended rules
      ...(vitest.configs.recommended.rules ?? {}),

      // Testing Library (React)
      ...(testingLibrary.configs.react?.rules ?? {}),

      // jest-dom assertions
      ...(jestDom.configs?.recommended?.rules ?? {})
    }
  },

  // JSON files
  {
    files: ['**/*.json'],
    languageOptions: { parser: jsoncParser },
    plugins: { jsonc },
    rules: {
      ...jsonc.configs['recommended-with-json'].rules
    }
  },

  // TypeScript configs are JSONC (comments allowed)
  {
    files: ['**/tsconfig*.json'],
    languageOptions: { parser: jsoncParser },
    plugins: { jsonc },
    rules: {
      ...jsonc.configs['recommended-with-jsonc'].rules,
      'jsonc/no-comments': 'off'
    }
  },

  // JSONC/JSON5 files (allow comments, trailing commas)
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
    files: ['**/*.md/*.js', '**/*.md/*.jsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } }
    },
    rules: {
      ...js.configs.recommended.rules,
      // Reduce noise in docs code blocks
      'no-undef': 'off',
      'no-unused-vars': 'off',
      // Docs may reference optional packages
      'import-x/no-unresolved': 'off'
    }
  },

  // Prettier integration: disable any ESLint stylistic rules that may conflict with Prettier.
  // Keep this last.
  eslintConfigPrettier
]

export default config
