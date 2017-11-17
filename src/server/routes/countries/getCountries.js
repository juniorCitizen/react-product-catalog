const db = require('../../controllers/database')
const logging = require('../../controllers/logging')
const routerResponse = require('../../controllers/routerResponse')

const modelReference = 'countries'

const setQueryBaseOptions = require('../../middlewares/setQueryBaseOptions')(modelReference)
const paginationLinkHeader = require('../../middlewares/paginationLinkHeader')

module.exports = (() => {
  return [
    setQueryBaseOptions,
    (req, res, next) => {
      return db.Countries
        .findAndCountAll()
        .then(result => {
          req.dataSourceRecordCount = result.count
          next()
          return Promise.resolve()
        })
        .catch(error => {
          logging.error(error)
          error.statusCode = 500
          return next(error)
        })
    },
    paginationLinkHeader(5, 0),
    (req, res, next) => {
      return db.Countries
        .findAll(req.queryOptions)
        .then((data) => {
          return routerResponse.json({ res, req, statusCode: 200, data })
        })
        .catch(error => {
          logging.error(error)
          error.statusCode = 500
          error.customMessage = 'failure getting dataset from countries'
          return next(error)
        })
    }]
})()
