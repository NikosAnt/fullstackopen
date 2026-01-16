import { merge } from 'webpack-merge'
import common from './webpack.common.js'
import webpack from 'webpack'

const devConfig = {
  mode: 'development',
  devServer: {
    open: true,
    hot: true,
    historyApiFallback: true,
    compress: true,
    port: 5173,
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        pathRewrite: { '^/api': '' },
      },
    ],
  },
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      BACKEND_URL: JSON.stringify('http://localhost:5173/api/notes'),
    }),
  ],
}

export default merge(common, devConfig)
