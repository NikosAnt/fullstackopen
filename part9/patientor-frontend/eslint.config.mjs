// ESLint flat config (composable presets).
// This project prefers TanStack Router + TanStack Query.

import { baseConfig } from './eslint/presets/base.mjs'
import { typescriptConfig } from './eslint/presets/typescript.mjs'
import { reactConfig } from './eslint/presets/react.mjs'
import { reduxConfig } from './eslint/presets/redux.mjs'
import { tanstackConfig } from './eslint/presets/tanstack.mjs'
import { nodeConfig } from './eslint/presets/node.mjs'
import { jsonConfig } from './eslint/presets/json.mjs'
import { markdownConfig } from './eslint/presets/markdown.mjs'

// Optional: Tailwind preset (enable only if the project uses Tailwind)
// import { tailwindConfig } from './eslint/presets/tailwind.mjs'

export default [
  ...baseConfig,
  ...typescriptConfig,
  ...reactConfig,
  ...reduxConfig,
  ...tanstackConfig,
  ...nodeConfig,
  ...jsonConfig,
  ...markdownConfig
  // ...tailwindConfig,
]
