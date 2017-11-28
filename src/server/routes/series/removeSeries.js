const db = require('../../controllers/database')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = [
  validateJwt({ admin: true }), // validate against token for admin privilege
  checkForAssociations,
  (req, res, next) => {
    let seriesId = req.params.seriesId.toUpperCase()
    // start transactions
    return db.sequelize
      .transaction(trx => {
        // find all the photos with same seriesId
        return db.Photos
          .findAll({ where: { seriesId }, transaction: trx })
          .then(photos => {
            // map the photos found into promises and run it with promise.all
            return Promise
              .all(photos.map(photo => {
                // check if the found photos are associated with any products
                return (photo.productId === null)
                  // if not, remove photos
                  ? photo.destroy({ transaction: trx })
                  // if yes, set SeriesId to null
                  : photo.update({ seriesId: null }, { transaction: trx })
              }))
          })
          // remove the actual series record
          .then(() => db.Series.destroy({
            where: { id: seriesId },
            transaction: trx
          }))
      })
      .then(data => {
        req.resJson = { data }
        next()
        return Promise.resolve()
      })
      .catch(error => next(error))
  }
]

// check if childSeries exists
function checkForAssociations (req, res, next) {
  return db.Series
    .findAll({
      include: [{
        model: db.Products
      }, {
        model: db.Series,
        as: 'childSeries'
      }],
      where: { id: req.params.seriesId.toUpperCase() }
    })
    .then(series => {
      // seriesId is not found in the database
      if (series[0] === undefined) {
        res.status(400)
        let error = new Error(`${req.params.seriesId.toUpperCase()} is not found`)
        next(error)
        return Promise.resolve()
      }
      // there are children series found in the database
      if (series[0].childSeries.length > 0) {
        res.status(400)
        let error = new Error('Not permitted to remove series that holds children series')
        next(error)
        return Promise.resolve()
      }
      // there are products associated with series
      if (series[0].products.length > 0) {
        res.status(400)
        let error = new Error('Not permitted to remove series with product associations')
        next(error)
        return Promise.resolve()
      }
      // proceed
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}
