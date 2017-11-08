const db = require('../../controllers/database/database')
const routerResponse = require('../../controllers/routerResponse')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = {
  byId: updateById
}

function updateById () {
  let endpoint = '/id/:id/name/:name/displaySequence/:displaySequence'
  return [
    endpoint,
    validateJwt,
    determineDisplaySequence,
    (req, res) => {
      return db.sequelize
        .transaction(async (trx) => {
          let trxObj = { transaction: trx }
          let targetRecord = await db.Series.findById(req.params.id, trxObj)
          let originalPosition = targetRecord.displaySequence
          let targetPosition = req.displaySequence
          // update targetRecord.name
          if (req.params.name !== targetRecord.name) {
            await targetRecord.update({ name: req.params.name }, trxObj)
          }
          // skip reordering if original and target position is the same
          let queryOptions = { replacements: { targetId: req.params.id } }
          let queryString = null
          if (originalPosition !== targetPosition) {
            if (originalPosition < targetPosition) {
              // push back in sequential order
              queryString = 'UPDATE series SET displaySequence = displaySequence - 1 WHERE id != :targetId AND displaySequence BETWEEN :floor AND :ceiling;'
              queryOptions.replacements.floor = originalPosition + 1
              queryOptions.replacements.ceiling = targetPosition
            } else { // advance in sequential order
              queryString = 'UPDATE series SET displaySequence = displaySequence + 1 WHERE id != :targetId AND displaySequence BETWEEN :floor AND :ceiling;'
              queryOptions.replacements.floor = targetPosition
              queryOptions.replacements.ceiling = originalPosition - 1
            }
            return db.sequelize
              .query(queryString, Object.assign(queryOptions, trxObj))
              .then(() => {
                return targetRecord.update({ displaySequence: req.displaySequence }, trxObj)
              })
              .catch(error => Promise.reject(error))
          }
        })
        .then(async () => {
          return routerResponse.json({
            req: req,
            res: res,
            statusCode: 200,
            data: await db.Series
              .findAll({ order: ['displaySequence'] })
              .catch(error => Promise.reject(error))
          })
        })
        .catch(error => routerResponse.json({
          req: req,
          res: res,
          statusCode: 500,
          error: error,
          message: '產品大類內容變更失敗'
        }))
    }]
}

function determineDisplaySequence (req, res, next) {
  return db.Series
    .findAll()
    .then(seriesDataset => {
      if (req.params.displaySequence > seriesDataset.length) {
        req.displaySequence = seriesDataset.length
      } else if (req.params.displaySequence < 0) {
        req.displaySequence = 0
      } else {
        req.displaySequence = req.params.displaySequence
      }
      next()
      return Promise.resolve()
    })
    .catch(error => routerResponse.json({
      req: req,
      res: res,
      statusCode: 500,
      error: error,
      message: 'updateSeries.js determineDisplaySequence() errored'
    }))
}
