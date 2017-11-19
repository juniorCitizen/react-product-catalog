const db = require('../../controllers/database')

module.exports = (() => {
  return [(req, res, next) => {
    return db.Flags
      .findById(req.params.countryId.toLowerCase())
      .then(svgData => {
        req.resImage = {
          mimeType: 'image/svg+xml',
          data: svgData.data
        }
        return next()
      })
      .catch((error) => next(error))
  }]
})()
