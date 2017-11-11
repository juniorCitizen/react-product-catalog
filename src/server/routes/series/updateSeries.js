const db = require('../../controllers/database')
const routerResponse = require('../../controllers/routerResponse')
const validateJwt = require('../../middlewares/validateJwt')

const seriesQueryParameters = require('../../models/ormQueryParameters/series')

module.exports = (() => {
  return [validateJwt, (req, res) => {
    return db.sequelize
      .transaction(async trx => {
        let trxObj = { transaction: trx }
        let targetRecord = await db.Series
          .findById(req.body.id, trxObj)
          .catch(error => Promise.reject(error))
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
            .catch(error => Promise.reject(error))
        })()
        return db.sequelize
          .query(adjustmentQuery(originalPosition, targetPosition, req.body.id), trxObj)
          .then(() => {
            if (req.body.hasOwnProperty('name')) targetRecord.name = req.body.name
            if (req.body.hasOwnProperty('order')) targetRecord.order = targetPosition
            if (req.body.hasOwnProperty('publish')) targetRecord.publish = req.body.publish
            return targetRecord
              .save(trxObj)
              .catch(error => Promise.reject(error))
          })
          .catch(error => Promise.reject(error))
      })
      .then(() => {
        return db.Series.findAll((() => {
          return req.params.hasOwnProperty('details')
            ? seriesQueryParameters.details()
            : seriesQueryParameters.simple()
        })()).catch(error => Promise.reject(error))
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
        message: 'error updating series data'
      }))
  }]
})()

function adjustmentQuery (originalPosition, targetPosition, targetId) {
  if (originalPosition === targetPosition) {
    return 'SELECT 0;'
  } else if (originalPosition < targetPosition) {
    return `
      UPDATE \`series\`
      SET \`order\` = \`order\` - 1
      WHERE \`id\` != ${targetId}
        AND \`order\` BETWEEN ${originalPosition + 1} AND ${targetPosition};`
  } else {
    return `
      UPDATE \`series\`
      SET \`order\` = \`order\` + 1
      WHERE \`id\` != ${targetId}
        AND \`order\` BETWEEN ${targetPosition} AND ${originalPosition - 1};`
  }
}
