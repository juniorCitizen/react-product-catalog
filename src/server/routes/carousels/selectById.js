const db = require('../../controllers/database')

module.exports = (() => {
  return [(req, res, next) => {
    let id = parseInt(req.params.carouselId)
    return db.Carousels
      .findById(id)
      .then(carousel => {
        if (carousel === null) {
          req.resJson = {
            data: null,
            message: `carousel (id: ${id}) is missing`
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
