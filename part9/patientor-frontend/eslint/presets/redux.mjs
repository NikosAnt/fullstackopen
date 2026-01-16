import reactRedux from 'eslint-plugin-react-redux'

export const reduxConfig = [
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'react-redux': reactRedux
    },
    rules: {
      ...(reactRedux.configs?.recommended?.rules ?? {})
    }
  }
]
