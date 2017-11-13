const db = require('../../controllers/database')
const routerResponse = require('../../controllers/routerResponse')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = ((req, res) => {
  return [
    validateJwt,
    (req, res) => {
      return db.sequelize
        .transaction(trx => {
          let associatedOptions = { where: { productId: req.params.productId.toUpperCase() }, transaction: trx }
          let targetOptions = { where: { id: req.params.productId.toUpperCase() }, transaction: trx }
          // only product record is deleted
          // associated tags are preserved by only remove related entries of labels table
          // and photos only has 'productId' set to null
          // may create orphaned tags or photo data/records
          return db.Labels
            // disassociate related tags by removing entries from the labels table
            .destroy(associatedOptions)
            // disassocate photos by nullify 'productId' field
            .then(() => db.Photos.update({ productId: null }, associatedOptions))
            // delete product record
            .then(() => db.Products.destroy(targetOptions))
        })
        .then((data) => routerResponse.json({
          req, res, statusCode: 200, data
        }))
        .catch(error => routerResponse.json({
          req,
          res,
          statusCode: 500,
          error,
          message: 'failure deleting product record by id'
        }))
    }
  ]
})()
