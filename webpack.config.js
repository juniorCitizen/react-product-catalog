var path = require('path')
var webpack = require('webpack')

var env = process.env

var publicPath = env.LOCAL_DEV_DOMAIN + ':' + env.PORT
var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true'
var babelPolyfill = require('babel-polyfill')
const ExtractTextPlugin = require("extract-text-webpack-plugin")

const extractSass = new ExtractTextPlugin({
   filename: "[name].[contenthash].css",
   disable: process.env.NODE_ENV === "development"
});

module.exports = {
    entry: {
        app: [hotMiddlewareScript, 'babel-polyfill', path.resolve('./src/client')]
      },
      output: {
        path: path.join(__dirname, 'dist/public'),
        filename: '[name].js',
        publicPath: '/'
      },
      /*
      resolve: {
        extensions: ['.js', '.jsx','css', '.scss']
      },
      */
      module: {
        loaders: [{
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          include: path.resolve('./src/client'),
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
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
          React: 'react',
          ReactDOM:'react-dom'
        }), 
        extractSass
      ]
}