const db = require('../../controllers/database')

const modelReference = 'products'

const setBaseQueryParameters = require('../../middlewares/setQueryBaseOptions')(modelReference)
const setResponseDetailLevel = require('../../middlewares/setResponseDetailLevel')(modelReference)
const paginationProcessing = require('../../middlewares/paginationProcessing')

module.exports = (() => {
  return [
    setBaseQueryParameters,
    setResponseDetailLevel,
    (req, res, next) => {
      return db.Products
        .findAndCountAll()
        .then(result => {
          req.dataSourceRecordCount = result.count
          next()
          return Promise.resolve()
        })
        .catch(error => next(error))
    },
    paginationProcessing(20, 100),
    (req, res, next) => {
      return db.Products
        .findAll(req.queryOptions)
        .then(data => {
          req.resJson = { data }
          return next()
        })
        .catch(error => next(error))
    }]
})()
