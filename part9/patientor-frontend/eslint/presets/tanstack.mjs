import tanstackQuery from '@tanstack/eslint-plugin-query'
import tanstackRouter from '@tanstack/eslint-plugin-router'

export const tanstackConfig = [
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@tanstack/query': tanstackQuery,
      '@tanstack/router': tanstackRouter
    },
    rules: {
      ...(tanstackQuery.configs?.['flat/recommended']?.rules ??
        tanstackQuery.configs?.recommended?.rules ??
        {}),
      ...(tanstackRouter.configs?.['flat/recommended']?.rules ??
        tanstackRouter.configs?.recommended?.rules ??
        {}),

      // Prefer TanStack packages over legacy alternatives
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react-router-dom',
              message: 'Prefer @tanstack/react-router in this codebase.'
            },
            {
              name: 'react-router',
              message: 'Prefer @tanstack/react-router in this codebase.'
            },
            {
              name: 'react-query',
              message: 'Prefer @tanstack/react-query in this codebase.'
            }
          ]
        }
      ]
    }
  }
]
