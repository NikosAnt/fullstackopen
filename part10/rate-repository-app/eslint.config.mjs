import js from '@eslint/js'
import babelParser from '@babel/eslint-parser'
import globals from 'globals'

import reactPlugin from 'eslint-plugin-react'
import reactNativePlugin from 'eslint-plugin-react-native'
import jestPlugin from 'eslint-plugin-jest'

export default [
  {
    ignores: [
      'node_modules/**',
      '.expo/**',
      '.expo-shared/**',
      'web-build/**',
      'dist/**',
      'build/**',
      'coverage/**'
    ]
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ['babel-preset-expo']
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest
      }
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    plugins: {
      react: reactPlugin,
      'react-native': reactNativePlugin,
      jest: jestPlugin
    },
    rules: {
      ...(reactPlugin.configs?.recommended?.rules ?? {}),
      ...(jestPlugin.configs?.recommended?.rules ?? {}),
      'no-unused-vars': ['error', { caughtErrors: 'none' }],
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off'
    }
  }
]
