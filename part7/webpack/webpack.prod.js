import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { merge } from 'webpack-merge'
import common from './webpack.common.js'
import webpack from 'webpack'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const prodConfig = {
  mode: 'production',
  output: {
    path: resolve(__dirname, 'build'),
    filename: 'main.js',
    clean: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      BACKEND_URL: JSON.stringify('https://notes2023.fly.dev/api/notes'),
    }),
  ],
}

export default merge(common, prodConfig)
