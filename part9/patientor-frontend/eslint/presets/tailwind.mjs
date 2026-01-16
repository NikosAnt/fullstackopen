import tailwindcss from 'eslint-plugin-tailwindcss'

const tailwindRecommendedWarn = tailwindcss?.configs?.recommended?.rules
  ? Object.fromEntries(
      Object.keys(tailwindcss.configs.recommended.rules).map(key => [
        key,
        'warn'
      ])
    )
  : {}

export const tailwindConfig = [
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    plugins: { tailwindcss },
    rules: {
      ...tailwindRecommendedWarn
    }
  }
]
