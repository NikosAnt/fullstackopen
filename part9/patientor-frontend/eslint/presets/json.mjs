import jsonc from 'eslint-plugin-jsonc'
import globals from 'globals'

import { require } from './shared.mjs'

const jsoncParser = require('jsonc-eslint-parser')

export const jsonConfig = [
  {
    files: ['**/*.json', '**/*.jsonc'],
    languageOptions: {
      parser: jsoncParser,
      globals: globals.node
    },
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
  }
]
