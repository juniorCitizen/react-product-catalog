const db = require('../../controllers/database')

const modelReference = 'products'

const setBaseQueryParameters = require('../../middlewares/setQueryBaseOptions')(modelReference)
const setResponseDetailLevel = require('../../middlewares/setResponseDetailLevel')(modelReference)

module.exports = (() => {
  return [
    setBaseQueryParameters,
    setResponseDetailLevel,
    (req, res, next) => {
      return db.Products
        .findById(req.params.productId.toUpperCase(), req.queryOptions)
        .then(data => {
          req.resJson = { data }
          next()
          return Promise.resolve()
        })
        .catch(error => next(error))
    }]
})()
