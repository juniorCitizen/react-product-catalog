const db = require('../../controllers/database')
const logging = require('../../controllers/logging')
const routerResponse = require('../../controllers/routerResponse')
const validateJwt = require('../../middlewares/validateJwt')

const setBaseQueryParameters = require('./middlewares').setBaseQueryParameters
const setResponseDetailLevel = require('./middlewares').setResponseDetailLevel
const filterBodyData = require('./middlewares').filterBodyData

module.exports = (() => {
  return [
    validateJwt,
    setBaseQueryParameters,
    setResponseDetailLevel,
    filterBodyData,
    (req, res) => {
      return db.sequelize
        .transaction(async trx => {
          let trxObj = { transaction: trx }
          let targetRecord = await db.Series
            .findById(req.params.id, trxObj)
            .catch(logging.reject)
          let originalPosition = targetRecord.order
          let targetPosition = await (() => {
            return db.Series
              .findAndCountAll(trxObj)
              .then((result) => {
                if (!req.body.hasOwnProperty('order')) {
                  return Promise.resolve(originalPosition)
                } else if (req.body.order > (result.count - 1)) {
                  return Promise.resolve(result.count)
                } else if (req.body.order < 0) {
                  return Promise.resolve(0)
                } else {
                  return Promise.resolve(parseInt(req.body.order))
                }
              })
              .catch(logging.reject)
          })()
          return db.sequelize
            .query(adjustmentQuery(originalPosition, targetPosition, req.params.id), trxObj)
            .then(() => {
              return targetRecord
                .update(req.filteredData, trxObj)
                .catch(logging.reject)
            })
            .catch(logging.reject)
        })
        .then(() => {
          return db.Series
            .findAll(req.queryParameters)
            .catch(logging.reject)
        })
        .then((data) => routerResponse.json({
          req,
          res,
          statusCode: 200,
          data
        }))
        .catch(error => routerResponse.json({
          req,
          res,
          statusCode: 500,
          error,
          message: 'error updating series record'
        }))
    }]
})()

function adjustmentQuery (originalPosition, targetPosition, targetId) {
  if (originalPosition === targetPosition) {
    return 'SELECT 0;'
  } else if (originalPosition < targetPosition) {
    return `UPDATE \`series\` SET \`order\` = \`order\` - 1 WHERE \`id\` != ${targetId} AND \`order\` BETWEEN ${originalPosition + 1} AND ${targetPosition};`
  } else {
    return `UPDATE \`series\` SET \`order\` = \`order\` + 1 WHERE \`id\` != ${targetId} AND \`order\` BETWEEN ${targetPosition} AND ${originalPosition - 1};`
  }
}
