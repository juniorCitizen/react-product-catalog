const db = require('../../controllers/database')
const logging = require('../../controllers/logging')
const routerResponse = require('../../controllers/routerResponse')
const validateJwt = require('../../middlewares/validateJwt')

const setBaseQueryParameters = require('../../middlewares/setQueryBaseOptions')('series')
const setResponseDetailLevel = require('../../middlewares/setResponseDetailLevel')('series')
const filterBodyDataProperties = require('../../middlewares/filterBodyDataProperties')('series')

module.exports = (() => {
  return [
    validateJwt,
    setBaseQueryParameters,
    setResponseDetailLevel,
    filterBodyDataProperties,
    (req, res) => {
      return db.sequelize
        .transaction(async trx => {
          let trxObj = { transaction: trx }
          let targetRecord = await db.Series
            .findById(req.params.seriesId, trxObj)
            .catch(logging.reject('error querying for target record'))
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
              .catch(logging.reject('error counting dataset length'))
          })()
          return db.sequelize
            .query(adjustmentQuery(originalPosition, targetPosition, req.params.seriesId), trxObj)
            .then(() => {
              return targetRecord
                .update(req.filteredData, trxObj)
                .catch(logging.reject('error updating target record'))
            })
            .catch(logging.reject('error updating affected records'))
        })
        .then(() => {
          return db.Series
            .findAll(req.queryOptions)
            .catch(logging.reject('update operation completed but couldn\'t retrieve updated dataset'))
        })
        .then((data) => routerResponse.json({
          req, res, statusCode: 200, data
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
    // if the target position is the same as the original
    // return a dummy query
    return 'SELECT 0;'
  } else if (originalPosition < targetPosition) {
    // increase order value (push back)
    return `UPDATE \`series\` SET \`order\` = \`order\` - 1 WHERE \`id\` != ${targetId} AND \`order\` BETWEEN ${originalPosition + 1} AND ${targetPosition};`
  } else {
    // advance in position
    return `UPDATE \`series\` SET \`order\` = \`order\` + 1 WHERE \`id\` != ${targetId} AND \`order\` BETWEEN ${targetPosition} AND ${originalPosition - 1};`
  }
}
