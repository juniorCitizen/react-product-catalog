const db = require('../../controllers/database')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = {
  fromSeries: removeSeriesId(),
  fromProduct: removeProductId()
}

function removeProductId () {
  return [
    validateJwt({ admin: true }),
    (req, res, next) => {
      return db.Photos
        .findById(req.params.photoId.toUpperCase())
        .then(target => {
          if (target.productId === req.params.productId.toUpperCase()) {
            target.seriesId = null
            target.primary = false
            if (target.serieId === null) {
              target.active = false
            }
            return target.save()
          } else {
            return Promise.resolve()
          }
        })
        .then(() => db.Photos
          .findById(req.params.photoId.toUpperCase(), {
            attributes: { exclude: ['data'] }
          }))
        .then(data => {
          req.resJson = { data }
          next()
          return Promise.resolve()
        })
        .catch(error => next(error))
    }
  ]
}

function removeSeriesId () {
  return [
    validateJwt({ admin: true }),
    (req, res, next) => {
      return db.Photos
        .findById(req.params.photoId.toUpperCase())
        .then(target => {
          if (target.seriesId === req.params.seriesId.toUpperCase()) {
            target.seriesId = null
            if (target.productId === null) {
              target.active = false
              target.primary = false
            }
            return target.save()
          } else {
            return Promise.resolve()
          }
        })
        .then(() => db.Photos
          .findById(req.params.photoId.toUpperCase(), {
            attributes: { exclude: ['data'] }
          }))
        .then(data => {
          req.resJson = { data }
          next()
          return Promise.resolve()
        })
        .catch(error => next(error))
    }
  ]
}
