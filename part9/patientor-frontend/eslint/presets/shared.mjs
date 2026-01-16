import { createRequire } from 'node:module'

export const require = createRequire(import.meta.url)

export const importOrderConfig = {
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
