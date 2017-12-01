const db = require('../../controllers/database')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = {
  toSeries: assignSeriesId(),
  toProduct: assignProductId()
}

function assignSeriesId () {
  return [
    validateJwt({ admin: true }),
    (req, res, next) => {
      return db.sequelize.transaction(trx => {
        // make sure no other photo has the same seriesId
        return db.Photos
          .update({ seriesId: null }, {
            where: { seriesId: req.params.seriesId.toUpperCase() },
            transaction: trx
          })
          // actually update the target
          .then(() => db.Photos.update({
            seriesId: req.params.seriesId.toUpperCase()
          }, {
            where: { id: req.params.photoId.toUpperCase() },
            transaction: trx
          }))
      }).then(() => db.Photos.findById(req.params.photoId.toUpperCase(), {
        attributes: { exclude: ['data'] }
      })).then(data => {
        req.resJson = { data }
        next()
        return Promise.resolve()
      }).catch(error => next(error))
    }
  ]
}

function assignProductId () {
  return [
    validateJwt({ admin: true }),
    (req, res, next) => {
      return db.Photos
        .update({
          productId: req.params.productId.toUpperCase(),
          primary: false
        }, {
          where: { id: req.params.photoId.toUpperCase() }
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
