const db = require('../../controllers/database')
const routerResponse = require('../../controllers/routerResponse')

const validateJwt = require('../../middlewares/validateJwt')
const setBaseQueryParameters = require('../../middlewares/setQueryBaseOptions')('products')
const setResponseDetailLevel = require('../../middlewares/setResponseDetailLevel')('products')
const filterBodyDataProperties = require('../../middlewares/filterBodyDataProperties')('products')

module.exports = ((req, res) => {
  return [
    validateJwt,
    setBaseQueryParameters,
    setResponseDetailLevel,
    filterBodyDataProperties,
    (req, res) => {
      return db.Products
        .update(req.filteredData, { where: { id: req.params.productId.toUpperCase() } })
        .then(() => db.Products.findById(req.params.productId.toUpperCase(), req.queryOptions))
        .then(data => routerResponse.json({
          req, res, statusCode: 200, data
        }))
        .catch(error => routerResponse.json({
          req,
          res,
          statusCode: 500,
          error,
          message: 'failure to update product record by id'
        }))
    }]
})()
