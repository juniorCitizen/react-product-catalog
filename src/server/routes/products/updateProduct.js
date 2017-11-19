const db = require('../../controllers/database')

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
    (req, res, next) => {
      return db.Products
        .update(req.filteredData, { where: { id: req.params.productId.toUpperCase() } })
        .then(() => db.Products.findById(req.params.productId.toUpperCase(), req.queryOptions))
        .then(data => {
          req.resJson = { data }
          next()
          return Promise.resolve()
        })
        .catch(error => next(error))
    }]
})()
