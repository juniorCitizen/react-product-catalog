const db = require('../../controllers/database')

module.exports = (() => {
  return [(req, res, next) => {
    let displaySequence = parseInt(req.params.displaySequence)
    return db.Carousels
      .findOne({ where: { displaySequence } })
      .then(carousel => {
        if (carousel === null) {
          req.resJson = {
            data: null,
            message: `carousel at displaySequence '${displaySequence}' is missing`
          }
        } else {
          req.resImage = {
            mimeType: carousel.mimeType,
            data: carousel.data
          }
        }
        next()
        return Promise.resolve()
      })
      .catch(error => next(error))
  }]
})()
