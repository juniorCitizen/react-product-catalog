import dotEnv from 'dotenv'
import glob from 'glob'
import merge from 'webpack-merge'
import path from 'path'
import webpack from 'webpack'

import HtmlWebpackPlugin from 'html-webpack-plugin'

import devServer from './src/workflow/webpack/devServer'
import eslint from './src/workflow/webpack/eslint'
import extractCss from './src/workflow/webpack/extractCss'
import purifyCss from './src/workflow/webpack/purifyCss'
import sourceMaps from './src/workflow/webpack/sourceMaps'
import style from './src/workflow/webpack/style'
import transpiler from './src/workflow/webpack/transpilers'

import ExtractTextPlugin from 'extract-text-webpack-plugin'

dotEnv.config()
const eVars = process.env

let PATHS = {
  app: path.resolve('./src/client'),
  assets: path.resolve('./src/client/assets'),
  build: path.resolve('./dist/public')
}

const commonConfig = merge([
  {
    entry: {
      app: ['babel-polyfill', PATHS.app]
    },
    output: {
      publicPath: '/',
      path: PATHS.build,
      filename: '[name].js'
    },
    devServer: {
      historyApiFallback: true,
    }
  },
  transpiler.babel({ include: PATHS.app }),
  //eslint({ include: PATHS.app, excluede: './src/client' })
])

const productionConfig = merge([
  {
    entry: {
      vendor: ['react', 'react-dom']
    },
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor'
      })
    ]
  },
  sourceMaps({ type: 'source-map' }),
  extractCss({
    use: [
      'css-loader',
      'sass-loader',
      style.autoprefix()
    ]
  }),
  purifyCss({
    paths: glob.sync(`${PATHS.app}/**/*.js`, { nodir: true })
  })
])

const developmentConfig = merge([
  {
    output: {
      devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]'
    }
  },
  sourceMaps({ type: 'cheap-module-eval-source-map' }),
  devServer({
    host: eVars.DEV_HOST,
    port: eVars.PORT
  }),
  style.loadCss(),
  style.loadSass()
])

module.exports = (env) => {
  if (env === 'production') {
    return merge(commonConfig, productionConfig)
  }
  //return merge(commonConfig, developmentConfig)
  return merge(commonConfig, productionConfig)
}
