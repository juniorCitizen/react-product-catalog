const db = require('../../controllers/database')
const routerResponse = require('../../controllers/routerResponse')
const validateJwt = require('../../middlewares/validateJwt')

module.exports = {
  byName: inserByName
}

function inserByName () {
  return ['/:name', validateJwt, async (req, res) => {
    return db.Series.create({
      id: await nextAvailableId(),
      name: req.params.name,
      order: await nextAvailableValueInSequence()
    }).then((newSeries) => {
      return routerResponse.json({
        req: req,
        res: res,
        statusCode: 200,
        data: (() => {
          if (req.query.hasOwnProperty('details')) {
            return Object.assign(newSeries.dataValues, {
              products: [],
              photo: null
            })
          } else {
            return newSeries
          }
        })()
      })
    }).catch((error) => {
      return routerResponse.json({
        req: req,
        res: res,
        statusCode: 500,
        error: error,
        message: '產品系列資料新增失敗'
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
