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

const newConfig = {
  entry: { // 打包入口
    index: "./src/client/index.js",
    vendor: [  // 将react和react-dom这些单独打包出来，减小打包文件体积
        "react",
        "react-dom"
    ]
  },
  output: { // 打包目标路径
      path: "./dist/public",
      filename: "[name].js"
  },
  resolve: {
      "extentions": ["", "js"]//当requrie的模块找不到时，添加这些后缀
  },
  module: {
    loaders: [{    // babel loader
        test: /\.js|.jsx$/,
        exclude: /node_modules/,
        loader: "babel",
        query: {
          presets: ['es2015', 'react', 'state-1']
        }
    }, {
        test: /\.(scss|sass|css)$/,  // 打包sass和css文件
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader!postcss-loader", {
        publicPath: '../' // 如果不需要打包成一个css，可以直接{test: /\.css$/,loaders: ['style', 'css'],}
    })
    }, {
        test: /\.(png|jpg|jpng|eot|ttf)$/, // 打包图片和字体文件
        loader: 'url-loader?limit=8192&name=images/[name].[ext]'
    }]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.js"), //这是之前单独打包出来的react、react-dom等文件
    new ExtractTextPlugin("app.css"), // 将所有sass/css文件打包成一个index.css文件
    new webpack.DefinePlugin({
        "process.env": { 
            NODE_ENV: JSON.stringify("production") 
        }
    }),
    new webpack.optimize.UglifyJsPlugin({ // 压缩打包后的代码
        compress: {
            warnings: false
        }
    })
  ]
}

module.exports = (env) => {
  if (env === 'production') {
    return merge(commonConfig, productionConfig)
  }
  //return merge(commonConfig, developmentConfig)
  return merge(commonConfig, productionConfig)
}
