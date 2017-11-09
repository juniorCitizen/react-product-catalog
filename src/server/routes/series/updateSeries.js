const path = require('path')

require('dotenv').config()

const accessPath = process.env.NODE_ENV === 'development'
  ? path.resolve('./src/server')
  : path.resolve('./dist')

const db = require(path.join(accessPath, 'controllers/database'))
const logging = require(path.join(accessPath, 'controllers/logging'))
const routerResponse = require(path.join(accessPath, 'controllers/routerResponse'))

const validateJwt = require(path.join(accessPath, 'middlewares/validateJwt'))

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
          queryString = 'UPDATE `series` SET `order` = `order` - 1 WHERE `id` != :targetId AND `order` BETWEEN :floor AND :ceiling;'
          queryOptions.replacements.floor = originalPosition + 1
          queryOptions.replacements.ceiling = targetPosition
        } else {
          // prepare query for advance target record in sequential order
          queryString = 'UPDATE `series` SET `order` = `order` + 1 WHERE `id` != :targetId AND `order` BETWEEN :floor AND :ceiling;'
          queryOptions.replacements.floor = targetPosition
          queryOptions.replacements.ceiling = originalPosition - 1
        }
        // run the query
        return db.sequelize
          .query(queryString, Object.assign({}, trxObj, queryOptions))
          .then(() => {
            // actually adjust the target record's order
            return targetRecord.update({ order: req.order }, trxObj)
          })
          .catch(error => Promise.reject(error))
      })
      .then(() => {
        return db.Series
          .findAll(queryParameters(req.query.hasOwnProperty('details')))
          .then(seriesDataset =>
            routerResponse.json({
              req: req,
              res: res,
              statusCode: 200,
              data: seriesDataset
            }))
          .catch(error => Promise.reject(error))
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
      .update(
        { name: req.params.name },
        { where: { id: req.params.id } }
      )
      .then(() => {
        let queryParameters = [req.params.id]
        if (req.query.hasOwnProperty('details')) {
          queryParameters.push(
            Object.assign({}, {
              include: [{
                model: db.Products,
                include: [{ model: db.Tags }, {
                  model: db.Photos,
                  attributes: { exclude: ['data'] }
                }]
              }, {
                model: db.Photos,
                attributes: { exclude: ['data'] }
              }],
              order: [
                [db.Products, 'code'],
                [db.Products, db.Tags, 'name'],
                [db.Products, db.Photos, 'primary', 'DESC']
              ]
            })
          )
        }
        return db.Series.findById(...queryParameters)
      })
      .then((targetRecord) => {
        return routerResponse.json({
          req: req,
          res: res,
          statusCode: 200,
          data: targetRecord
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
          queryString = 'UPDATE `series` SET `order` = `order` - 1 WHERE `id` != :targetId AND `order` BETWEEN :floor AND :ceiling;'
          queryOptions.replacements.floor = originalPosition + 1
          queryOptions.replacements.ceiling = targetPosition
        } else {
          // prepare query for advance target record in sequential order
          queryString = 'UPDATE `series` SET `order` = `order` + 1 WHERE `id` != :targetId AND `order` BETWEEN :floor AND :ceiling;'
          queryOptions.replacements.floor = targetPosition
          queryOptions.replacements.ceiling = originalPosition - 1
        }
        // run the query
        return db.sequelize
          .query(queryString, Object.assign({}, trxObj, queryOptions))
          .then(() => {
            // actually adjust the target record's order
            return targetRecord.update({ order: req.order }, trxObj)
          })
          .catch(error => {
            logging.error(error, 'abc')
            return Promise.reject(error)
          })
      })
      .then(() => {
        return db.Series
          .findAll(queryParameters(req.query.hasOwnProperty('details')))
          .then(seriesDataset =>
            routerResponse.json({
              req: req,
              res: res,
              statusCode: 200,
              data: seriesDataset
            }))
          .catch(error => Promise.reject(error))
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
        req.order = parseInt(req.params.order)
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

function queryParameters (detailed = false) {
  return detailed
    ? {
      include: [{
        model: db.Products,
        include: [{ model: db.Tags }, {
          model: db.Photos,
          attributes: { exclude: ['data'] }
        }]
      }, {
        model: db.Photos,
        attributes: { exclude: ['data'] }
      }],
      order: [
        'order',
        [db.Products, 'code'],
        [db.Products, db.Tags, 'name'],
        [db.Products, db.Photos, 'primary', 'DESC']
      ]
    }
    : {
      order: ['order']
    }
}
