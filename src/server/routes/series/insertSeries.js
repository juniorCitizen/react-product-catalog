const db = require('../../controllers/database')
const routerResponse = require('../../controllers/routerResponse')
const validateJwt = require('../../middlewares/validateJwt')

module.exports = () => {
  return [validateJwt, async (req, res) => {
    if (!req.query.hasOwnProperty('name')) {
      return routerResponse.json({
        req,
        res,
        statusCode: 400,
        message: 'did not find valid name string in url query'
      })
    }
    return db.Series.create({
      id: await nextAvailableId(),
      name: req.query.name,
      order: await nextAvailableValueInSequence()
    }).then((newSeriesRecord) => {
      return routerResponse.json({
        req,
        res,
        statusCode: 200,
        data: (() => {
          if (req.query.hasOwnProperty('details')) {
            return Object.assign(newSeriesRecord.dataValues, {
              products: [],
              photo: null
            })
          } else { return newSeriesRecord }
        })()
      })
    }).catch((error) => {
      return routerResponse.json({
        req,
        res,
        statusCode: 500,
        error,
        message: 'error inserting series data'
      })
    })
  }]
}

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
    .catch(error => Promise.reject(error))
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
    .catch(error => Promise.reject(error))
}
