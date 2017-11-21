const db = require('../../controllers/database')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = ((req, res) => {
  return [
    validateJwt,
    (req, res, next) => {
      let productId = req.params.productId.toUpperCase()
      return db.sequelize
        .transaction(trx => {
          let associatedOptions = { where: { productId: productId }, transaction: trx }
          let targetOptions = { where: { id: productId }, transaction: trx }
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
        .then((data) => {
          req.resJson = { data }
          next()
          return Promise.resolve()
        })
        .catch(error => next(error))
    }]
})()
