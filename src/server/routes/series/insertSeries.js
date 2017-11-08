const db = require('../../controllers/database/database')
const routerResponse = require('../../controllers/routerResponse')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = {
  byName: inserByName
}

function inserByName () {
  return ['/name/:name', validateJwt, async (req, res) => {
    return db.Series.create({
      id: await nextAvailableId(),
      name: req.params.name,
      displaySequence: await nextAvailableSequenceNumber()
    }).then((newSeries) => {
      return routerResponse.json({
        req: req,
        res: res,
        statusCode: 200,
        data: newSeries
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

function nextAvailableSequenceNumber () {
  let nextAvailableSequenceNumber = 0
  return db.Series
    .findAll()
    .map(series => series.displaySequence)
    .then((displaySequenceNumberList) => {
      // loop through and find the next available unused id
      while (displaySequenceNumberList.indexOf(nextAvailableSequenceNumber) !== -1) {
        nextAvailableSequenceNumber++
      }
      return Promise.resolve(nextAvailableSequenceNumber)
    })
    .catch(error => Promise.reject(error))
}
