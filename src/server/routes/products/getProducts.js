const db = require('../../controllers/database')

const modelReference = 'products'

const setBaseQueryParameters = require('../../middlewares/setQueryBaseOptions')(modelReference)
const setResponseDetailLevel = require('../../middlewares/setResponseDetailLevel')(modelReference)
const paginationLinkHeader = require('../../middlewares/paginationLinkHeader')

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
    paginationLinkHeader(20, 100),
    (req, res, next) => {
      console.log(req.resJson)
      return db.Products
        .findAll(req.queryOptions)
        .then(data => {
          req.resJson = { data }
          return next()
        })
        .catch(error => next(error))
    }]
})()
