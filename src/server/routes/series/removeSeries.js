const db = require('../../controllers/database')
const routerResponse = require('../../controllers/routerResponse')
const validateJwt = require('../../middlewares/validateJwt')

module.exports = {
  byId: deleteById,
  byName: deleteByName
}

function deleteById () {
  return ['/id/:id', validateJwt, (req, res) => {
    let targetPosition
    return db.sequelize
      .transaction((trx) => {
        let trxObj = { transaction: trx }
        return db.Series
          .findById(req.params.id, trxObj)
          .then((targetRecord) => {
            // record the order position of delete target
            targetPosition = targetRecord.order
            // delete the instance
            return targetRecord.destroy(trxObj)
          })
          .then(() => {
            // advance records that were after the delete target in order
            return db.Series
              .update({
                order: db.sequelize.literal('`order` - 1')
              }, Object.assign({
                where: {
                  order: {
                    [db.Sequelize.Op.gt]: targetPosition
                  }
                }
              }, trxObj))
          })
      })
      .then(() => {
        return db.Series
          .findAll(detailedQueryParameters(req.query.hasOwnProperty('details')))
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
        message: `產品系列記錄 id = ${req.params.id} 刪除失敗`
      }))
  }]
}

function deleteByName () {
  return ['/name/:name', validateJwt, (req, res) => {
    let targetPosition
    return db.sequelize
      .transaction((trx) => {
        let trxObj = { transaction: trx }
        return db.Series
          .findOne(Object.assign({
            where: { name: req.params.name }
          }, trxObj))
          .then((targetRecord) => {
            // record the order position of delete target
            targetPosition = targetRecord.order
            // delete the instance
            return targetRecord.destroy(trxObj)
          })
          .then(() => {
            // advance records that were after the delete target in order
            return db.Series
              .update({
                order: db.sequelize.literal('`order` - 1')
              }, Object.assign({
                where: {
                  order: {
                    [db.Sequelize.Op.gt]: targetPosition
                  }
                }
              }, trxObj))
          })
      })
      .then(() => {
        return db.Series
          .findAll(detailedQueryParameters(req.query.hasOwnProperty('details')))
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
        message: `產品系列記錄 id = ${req.params.name} 刪除失敗`
      }))
  }]
}

function detailedQueryParameters (detailed = false) {
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
