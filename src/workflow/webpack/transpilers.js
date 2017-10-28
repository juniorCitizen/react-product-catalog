exports.babel = ({ include, exclude }) => ({
  module: {
    rules: [
      {
        test: /\.js$/,
        include,
        exclude,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        }
      }
    ]
  }
})
