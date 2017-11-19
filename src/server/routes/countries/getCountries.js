const db = require('../../controllers/database')

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
        .catch(error => next(error))
    },
    paginationLinkHeader(5, 0),
    (req, res, next) => {
      return db.Countries
        .findAll(req.queryOptions)
        .then(data => {
          req.resJson = { data }
          next()
          return Promise.resolve()
        })
        .catch(error => next(error))
    }]
})()
