var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var env = require('./src/server/config/eVars')
const eVars = process.env
var publicPath = env.HOST + '/' + env.SYS_REF + '/'
console.log('##' + publicPath)
var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true'
var babelPolyfill = require('babel-polyfill')
const ExtractTextPlugin = require("extract-text-webpack-plugin")

const extractSass = new ExtractTextPlugin({
  filename: '[name]-bluma.css'
});

let PATHS = {
  app: path.resolve('./src/client'),
  assets: path.resolve('./src/client/assets'),
  build: path.resolve('./dist/public')
}

module.exports = {
    entry: {
        app: [
          'babel-polyfill', 
          PATHS.app,
          hotMiddlewareScript
        ]
      },
      output: {
        path: PATHS.build,
        filename: '[name].js',
        publicPath: publicPath,
      },
      devServer: {
        historyApiFallback: true,
      },
      module: {
        loaders: [{
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          include: PATHS.app,
          query: {
            presets: ['es2015', 'react', 'stage-2'],
          },
        },{
          test: /\.css$/,
          loader: 'style-loader',
        }, {
          test: /\.(scss|sass)$/,
          loader: ['style-loader', 'sass-loader'],
        }, {
          test: /\.(jpe?g|JPE?G|png|PNG|gif|GIF|svg|SVG|woff|woff2|eot|ttf)(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url?limit=1024&name=[sha512:hash:base64:7].[ext]'
        }],
        rules: [
          {
            test: /\.scss$/,
            use: extractSass.extract({
                use: [{
                    loader: "css-loader"
                }, {
                    loader: "sass-loader"
                }],
                // use style-loader in development 
                fallback: "style-loader"
            })
          }, {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          }
        ]
      },
      devtool: 'source-map',

      plugins: [
        //new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
          name: 'vendor'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
          React: 'react',
          ReactDOM:'react-dom'
        }), 
        extractSass
      ]
}