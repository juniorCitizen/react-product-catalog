const db = require('../../controllers/database/database')
const logging = require('../../controllers/logging')
const routerResponse = require('../../controllers/routerResponse')

module.exports = {
  insertSeries: insertSeries
}

function insertSeries (req, res) {
  let nextAvailableId = 0
  let nextSequenceNumber = 0
  return db.Series.findAll()
    .map(series => series.id)
    .then((seriesIdList) => {
      while (seriesIdList.indexOf(nextAvailableId) !== -1) {
        nextAvailableId++
      }
      return db.Series.findAll()
    })
    .map(series => series.displaySequence)
    .then((existingSequenceNumbers) => {
      while (existingSequenceNumbers.indexOf(nextSequenceNumber) !== -1) {
        nextSequenceNumber++
      }
      return Promise.resolve()
    })
    .then(() => {
      if (req.query.name === undefined) {
        return routerResponse.json({
          req: req,
          res: res,
          statusCode: 400,
          message: '未發現 req.query.name'
        })
      } else {
        return db.Series.create({
          id: nextAvailableId,
          name: req.query.name,
          displaySequence: nextSequenceNumber
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
      }
    })
    .catch((error) => {
      logging.error(error, 'routes/series/insertSeries.js errored')
      return routerResponse.json({
        req: req,
        res: res,
        statusCode: 500,
        error: error,
        message: 'routes/series/insertSeries.js errored'
      })
    })
}
