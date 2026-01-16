import {
  importX,
  flatConfigs as importXFlatConfigs,
  createNodeResolver
} from 'eslint-plugin-import-x'
import globals from 'globals'
import {
  parser as tsEslintParser,
  plugin as tsEslintPlugin,
  configs as tsEslintConfigs
} from 'typescript-eslint'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { require } from './shared.mjs'

const {
  createTypeScriptImportResolver
} = require('eslint-import-resolver-typescript')

const projectRootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..'
)

export const typescriptConfig = [
  // Import-X TypeScript preset
  importXFlatConfigs.typescript,

  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parser: tsEslintParser,
      parserOptions: {
        project: ['./tsconfig.eslint.json'],
        tsconfigRootDir: projectRootDir,
        ecmaFeatures: { jsx: true }
      }
    },
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          project: ['./tsconfig.eslint.json'],
          alwaysTryTypes: true,
          noWarnOnMultipleProjects: true
        }),
        createNodeResolver({
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
        })
      ]
    },
    plugins: {
      '@typescript-eslint': tsEslintPlugin,
      'import-x': importX
    },
    rules: {
      // Strict type-aware TypeScript rules
      ...tsEslintConfigs.strictTypeChecked
        .map(c => c.rules ?? {})
        .reduce((acc, rules) => ({ ...acc, ...rules }), {}),

      // Prefer TS-aware unused checks
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { varsIgnorePattern: '^[A-Z_]' }
      ],

      // Type safety (modeled after backend)
      'security/detect-object-injection': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'error',
      '@typescript-eslint/no-base-to-string': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/prefer-reduce-type-parameter': 'error',
      '@typescript-eslint/no-explicit-any': [
        'error',
        { fixToUnknown: true, ignoreRestArgs: false }
      ],

      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' }
      ],

      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: { attributes: false, returns: false },
          checksConditionals: true
        }
      ],
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/no-confusing-void-expression': [
        'error',
        { ignoreArrowShorthand: true }
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': [
        'error',
        { ignoreTernaryTests: true }
      ]
    }
  }
]
