import globals from 'globals'
import n from 'eslint-plugin-n'
import { parser as tsEslintParser } from 'typescript-eslint'
import { importX } from 'eslint-plugin-import-x'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..'
)

const nRecommendedWarn = n?.configs?.['flat/recommended']?.rules
  ? Object.fromEntries(
      Object.keys(n.configs['flat/recommended'].rules).map(key => [key, 'warn'])
    )
  : n?.configs?.recommended?.rules
    ? Object.fromEntries(
        Object.keys(n.configs.recommended.rules).map(key => [key, 'warn'])
      )
    : {}

export const nodeConfig = [
  {
    files: [
      '*.config.*',
      'vite.config.*',
      'scripts/**/*.{js,jsx,ts,tsx}',
      'vite.config.ts'
    ],
    ignores: ['eslint.config.mjs'],
    languageOptions: {
      globals: globals.node,
      sourceType: 'module',
      parser: tsEslintParser,
      parserOptions: {
        project: ['./tsconfig.node.json'],
        tsconfigRootDir: projectRootDir
      }
    },
    plugins: { n, 'import-x': importX },
    rules: {
      ...nRecommendedWarn,
      'n/no-unsupported-features/node-builtins': 'off',
      'import-x/default': 'off',
      'import-x/no-named-as-default-member': 'off'
    }
  }
]
