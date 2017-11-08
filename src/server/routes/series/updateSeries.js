const db = require('../../controllers/database/database')
const routerResponse = require('../../controllers/routerResponse')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = {
  updateById: updateById,
  updateNameById: updateNameById,
  updateOrderById: updateOrderById
}

function updateById () {
  let endpoint = '/:id/:name/:order'
  return [endpoint, validateJwt, validateOrderValue, (req, res) => {
    return db.sequelize
      .transaction(async trx => {
        let trxObj = { transaction: trx }
        let targetRecord = await db.Series.findById(req.params.id, trxObj)
        let originalPosition = targetRecord.order
        let targetPosition = req.order
        // update targetRecord.name
        await targetRecord.update({ name: req.params.name }, trxObj)
        // resequence affected records
        let queryOptions = { replacements: { targetId: req.params.id } }
        let queryString = null
        if (originalPosition < targetPosition) {
          // prepare query for push back target record in sequential order
          queryString = 'UPDATE series SET order = order - 1 WHERE id != :targetId AND order BETWEEN :floor AND :ceiling;'
          queryOptions.replacements.floor = originalPosition + 1
          queryOptions.replacements.ceiling = targetPosition
        } else {
          // prepare query for advance target record in sequential order
          queryString = 'UPDATE series SET order = order + 1 WHERE id != :targetId AND order BETWEEN :floor AND :ceiling;'
          queryOptions.replacements.floor = targetPosition
          queryOptions.replacements.ceiling = originalPosition - 1
        }
        // run the query
        return db.sequelize
          .query(queryString, Object.assign(queryOptions, trxObj))
          .then(() => {
            // actually adjust the target record's order
            return targetRecord.update({ order: req.order }, trxObj)
          })
          .catch(error => Promise.reject(error))
      })
      .then(async () => {
        return routerResponse.json({
          req: req,
          res: res,
          statusCode: 200,
          data: await db.Series
            .findAll({ order: ['order'] })
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

function updateNameById () {
  return ['/:id/name/:name', validateJwt, (req, res) => {
    return db.Series
      .update({
        name: req.params.name
      }, {
        where: { id: req.params.id }
      })
      .then((updated) => {
        return routerResponse.json({
          req: req,
          res: res,
          statusCode: 200,
          data: updated
        })
      })
      .catch(error => routerResponse.json({
        req: req,
        res: res,
        statusCode: 500,
        error: error,
        message: '產品大類名稱變更失敗'
      }))
  }]
}

function updateOrderById () {
  let endpoint = '/:id/order/:order'
  return [endpoint, validateJwt, validateOrderValue, (req, res) => {
    return db.sequelize
      .transaction(async trx => {
        let trxObj = { transaction: trx }
        let targetRecord = await db.Series.findById(req.params.id, trxObj)
        let originalPosition = targetRecord.order
        let targetPosition = req.order
        // resequence affected records
        let queryOptions = { replacements: { targetId: req.params.id } }
        let queryString = null
        if (originalPosition < targetPosition) {
          // prepare query for push back target record in sequential order
          queryString = 'UPDATE series SET order = order - 1 WHERE id != :targetId AND order BETWEEN :floor AND :ceiling;'
          queryOptions.replacements.floor = originalPosition + 1
          queryOptions.replacements.ceiling = targetPosition
        } else {
          // prepare query for advance target record in sequential order
          queryString = 'UPDATE series SET order = order + 1 WHERE id != :targetId AND order BETWEEN :floor AND :ceiling;'
          queryOptions.replacements.floor = targetPosition
          queryOptions.replacements.ceiling = originalPosition - 1
        }
        // run the query
        return db.sequelize
          .query(queryString, Object.assign(queryOptions, trxObj))
          .then(() => {
            // actually adjust the target record's order
            return targetRecord.update({ order: req.order }, trxObj)
          })
          .catch(error => Promise.reject(error))
      })
      .then(async () => {
        return routerResponse.json({
          req: req,
          res: res,
          statusCode: 200,
          data: await db.Series
            .findAll({ order: ['order'] })
            .catch(error => Promise.reject(error))
        })
      })
      .catch(error => routerResponse.json({
        req: req,
        res: res,
        statusCode: 500,
        error: error,
        message: '產品大類順序變更失敗'
      }))
  }]
}

function validateOrderValue (req, res, next) {
  return db.Series
    .findAll()
    .then(seriesDataset => {
      if (req.params.order > seriesDataset.length) {
        req.order = seriesDataset.length
      } else if (req.params.order < 0) {
        req.order = 0
      } else {
        req.order = req.params.order
      }
      next()
      return Promise.resolve()
    })
    .catch(error => routerResponse.json({
      req: req,
      res: res,
      statusCode: 500,
      error: error,
      message: 'updateSeries.js validateOrderValue() errored'
    }))
}
