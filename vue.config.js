require('dotenv').config()

module.exports = {
    sass: {
        includePaths: [
            './src/client/assets/sass'
        ]
    },
    // postcss: [require('postcss')([require('autoprefixer')])],
    babel: {
        babelrc: true,
        comments: process.env.NODE_ENV !== 'production',
        sourceMaps: true // set to 'false' to map to post-transpiled code
    }
}
