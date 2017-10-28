import db from '../../controllers/database/database'
import routerResponse from '../../controllers/routerResponse'

module.exports = (req, res) => {
  return db.sequelize
    .transaction((trx) => {
      let trxObj = { transaction: trx }
      return db.Photos
        .destroy({
          where: { productId: req.query.productId }
        }, trxObj)
        .then(() => {
          return db.Descriptions
            .destroy({
              where: { productId: req.query.productId }
            }, trxObj)
        })
        .then(() => {
          return db.Products
            .destroy({
              where: { id: req.query.productId }
            }, trxObj)
        })
    })
    .then(() => {
      return routerResponse.json({
        pendingResponse: res,
        originalRequest: req,
        statusCode: 200,
        success: true
      })
    })
    .catch((error) => {
      return routerResponse.json({
        pendingResponse: res,
        originalRequest: req,
        statusCode: 500,
        success: false,
        error: error.name,
        message: error.message,
        data: error.stack
      })
    })
}
