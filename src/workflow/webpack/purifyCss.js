const PurifyCSSPlugin = require('purifycss-webpack')

module.exports = ({ paths }) => ({
  plugins: [
    new PurifyCSSPlugin({ paths })
  ]
})
