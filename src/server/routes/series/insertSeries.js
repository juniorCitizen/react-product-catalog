const db = require('../../controllers/database/database')
const logging = require('../../controllers/logging')
const routerResponse = require('../../controllers/routerResponse')

module.exports = (req, res) => {
  let nextAvailableId = 0
  let nextSequenceNumber = 0
  // find all series record
  return db.Series.findAll()
    // map out the series id into an array
    .map(series => series.id)
    .then((seriesIdList) => {
      // loop through and find the next available unused id
      while (seriesIdList.indexOf(nextAvailableId) !== -1) {
        nextAvailableId++
      }
      // find all series record (without deleted)
      return db.Series.findAll()
    })
    // map out the display sequence into an array
    .map(series => series.displaySequence)
    .then((existingSequenceNumbers) => {
      // loop through and find the next available usused display sequence value
      while (existingSequenceNumbers.indexOf(nextSequenceNumber) !== -1) {
        nextSequenceNumber++
      }
      return Promise.resolve()
    })
    .then(() => {
      if (req.query.name === undefined) {
        // exit if query name is missing
        return routerResponse.json({
          req: req,
          res: res,
          statusCode: 400,
          message: '未發現 req.query.name'
        })
      } else {
        // create new record
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
