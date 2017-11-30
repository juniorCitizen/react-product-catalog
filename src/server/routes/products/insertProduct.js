const db = require('../../controllers/database')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = [
  validateJwt({ admin: true }),
  (req, res, next) => {
    return db.sequelize
      .transaction(trx => {
        let productData = {
          code: req.body.code,
          name: req.body.name,
          specification: req.body.specification || null,
          description: req.body.description || null
        }
        return db.Products.create(productData)
      })
      .then(newRecord => db.Products.findById(newRecord.id))
      .then(data => {
        req.resJson = { data }
        next()
        return Promise.resolve()
      })
      .catch(error => next(error))
  }
]
