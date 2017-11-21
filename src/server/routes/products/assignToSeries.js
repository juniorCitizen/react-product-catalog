const db = require('../../controllers/database')
const routerResponse = require('../../controllers/routerResponse')

const validateJwt = require('../../middlewares/validateJwt')
const setBaseQueryParameters = require('../../middlewares/setQueryBaseOptions')('products')
const setResponseDetailLevel = require('../../middlewares/setResponseDetailLevel')('products')

module.exports = (() => {
  return [
    validateJwt,
    setBaseQueryParameters,
    setResponseDetailLevel,
    (req, res, next) => {
      let productId = req.params.productId.toUpperCase()
      return db.Products
        .update(
          { seriesId: req.params.seriesId },
          { where: { id: productId } }
        )
        .then(() => db.Products
          .findById(productId, req.queryOptions)
        )
        .then((data) => {
          req.resJson = { data }
          next()
          return Promise.resolve()
        })
        .catch(error => next(error))
    }]
})()
