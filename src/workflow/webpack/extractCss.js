const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = ({ include, exclude, use }) => {
  const cssPlugin = new ExtractTextPlugin({
    filename: '[name].css'
  })
  const sassPlugin = new ExtractTextPlugin({
    filename: '[name]-bluma.css'
  })
  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          include,
          exclude,
          use: cssPlugin.extract({
            use,
            fallback: 'style-loader'
          })
        },
        {
          test: /\.scss$/,
          include,
          exclude,
          use: sassPlugin.extract({
            use,
            fallback: 'style-loader'
          })
        }
      ]
    },
    plugins: [
      cssPlugin,
      sassPlugin
    ]
  }
}
