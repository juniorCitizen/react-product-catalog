const Promise = require('bluebird')

const db = require('../../controllers/database')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = [
  validateJwt({ admin: true }), // validate against token for admin privilege
  checkChildSeries,
  (req, res, next) => {
    let targetSeriesId = req.params.seriesId.toUpperCase()
    // start transactions
    return db.sequelize
      .transaction(trx => {
        // query to process associated photos that has product association
        let query1 = db.Photos.update({ seriesId: null }, { where: { seriesId: targetSeriesId, productId: { [db.Sequelize.Op.ne]: null } }, transaction: trx })
        // query to process associated photos that does not have product association
        let query2 = db.Photos.update({ seriesId: null, primary: false, active: false }, { where: { seriesId: targetSeriesId, productId: null }, transaction: trx })
        // disassociate any associated products
        let query3 = db.Products.update({ seriesId: null, active: false }, { where: { seriesId: targetSeriesId }, transaction: trx })
        // run above queries in sequence
        return Promise
          .each([query1, query2, query3], () => Promise.resolve())
          // remove the actual series record
          .then(() => db.Series.destroy({ where: { id: targetSeriesId }, transaction: trx }))
          .catch(error => next(error))
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
function checkChildSeries (req, res, next) {
  return db.Series
    .findAll({ include: [{ model: db.Series, as: 'childSeries' }], where: { id: req.params.seriesId.toUpperCase() } })
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
      // proceed
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}
