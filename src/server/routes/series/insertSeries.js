const db = require('../../controllers/database')
const logging = require('../../controllers/logging')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = (() => {
  return [
    validateJwt,
    async (req, res, next) => {
      if (res.statusCode >= 400) return next()
      return db.Series
        .create({
          id: await nextAvailableId(),
          name: req.params.name,
          order: await nextAvailableValueInSequence()
        })
        .then((newSeriesRecord) => (() => {
          if ('details' in req.query) {
            let detailedData = Object.assign({
              products: [],
              photo: null
            }, newSeriesRecord.dataValues)
            return Promise.resolve(detailedData)
          } else { return Promise.resolve(newSeriesRecord) }
        })())
        .then((data) => {
          req.resJson = { data }
          return next()
        })
        .catch(error => next(error))
    }]
})()

function nextAvailableId () {
  let nextAvailableId = 0
  return db.Series
    .findAll()
    .map(series => series.id)
    .then((seriesIds) => {
      // loop through and find the next available unused id
      while (seriesIds.indexOf(nextAvailableId) !== -1) {
        nextAvailableId++
      }
      return Promise.resolve(nextAvailableId)
    })
    .catch(logging.reject('error getting the next available id value'))
}

function nextAvailableValueInSequence () {
  let nextAvailableValueInSequence = 0
  return db.Series
    .findAll()
    .map(series => series.order)
    .then((orderSequence) => {
      // loop through and find the next available order sequence value
      while (orderSequence.indexOf(nextAvailableValueInSequence) !== -1) {
        nextAvailableValueInSequence++
      }
      return Promise.resolve(nextAvailableValueInSequence)
    })
    .catch(logging.reject('error getting the next available order value'))
}
