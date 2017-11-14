const db = require('../../controllers/database')
const routerResponse = require('../../controllers/routerResponse')

const validateJwt = require('../../middlewares/validateJwt')
const setBaseQueryParameters = require('../../middlewares/setQueryBaseOptions')('products')
const setResponseDetailLevel = require('../../middlewares/setResponseDetailLevel')('products')

module.exports = ((req, res) => {
  return [
    validateJwt,
    setBaseQueryParameters,
    setResponseDetailLevel,
    (req, res) => {
      return db.Products
        .update(
          { seriesId: req.params.seriesId },
          { where: { id: req.params.productId.toUpperCase() } }
        )
        .then(() => db.Products.findById(req.params.productId.toUpperCase(), req.queryOptions))
        .then((data) => routerResponse.json({
          req, res, statusCode: 200, data
        }))
        .catch(error => routerResponse.json({
          req,
          res,
          statusCode: 500,
          error,
          message: 'failure to assign product to a series'
        }))
    }
  ]
})()
