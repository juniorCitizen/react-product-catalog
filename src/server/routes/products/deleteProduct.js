const db = require('../../controllers/database')
const routerResponse = require('../../controllers/routerResponse')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = ((req, res) => {
  return [
    validateJwt,
    (req, res) => {
      if (!req.query.hasOwnProperty('id')) {
        // returns error if target record id is not set in url query
        return routerResponse.json({
          req,
          res,
          statusCode: 400,
          message: 'target record id not found'
        })
      } else {
        return db.sequelize
          .transaction(trx => {
            // only product record is deleted
            // associated tags are preserved by only remove related entries of labels table
            // and photos only has 'productId' set to null
            // may create orphaned tags or photo data/records
            return db.Labels
              // disassociate related tags by removing entries from the labels table
              .destroy({ where: { productId: req.query.id }, transaction: trx })
              .then(() => {
                // disassocate photos by nullify 'productId' field
                return db.Photos.update(
                  { productId: null },
                  { where: { productId: req.query.id }, transaction: trx }
                )
              })
              .then(() => {
                // delete product record
                return db.Products.destroy(
                  { where: { id: req.query.id }, transaction: trx }
                )
              })
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
            message: 'product record deletion failure'
          }))
      }
    }
  ]
})()

//   (req, res) => {
//   return db.sequelize
//     .transaction((trx) => {
//       let trxObj = { transaction: trx }
//       return db.Photos
//         .destroy({
//           where: { productId: req.query.productId }
//         }, trxObj)
//         .then(() => {
//           return db.Descriptions
//             .destroy({
//               where: { productId: req.query.productId }
//             }, trxObj)
//         })
//         .then(() => {
//           return db.Products
//             .destroy({
//               where: { id: req.query.productId }
//             }, trxObj)
//         })
//     })
//     .then(() => {
//       return routerResponse.json({
//         pendingResponse: res,
//         originalRequest: req,
//         statusCode: 200,
//         success: true
//       })
//     })
//     .catch((error) => {
//       return routerResponse.json({
//         pendingResponse: res,
//         originalRequest: req,
//         statusCode: 500,
//         success: false,
//         error: error.name,
//         message: error.message,
//         data: error.stack
//       })
//     })
// }
