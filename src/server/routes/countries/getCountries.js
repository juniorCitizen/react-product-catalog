const db = require('../../controllers/database')

const modelReference = 'countries'

const setQueryBaseOptions = require('../../middlewares/setQueryBaseOptions')(modelReference)
const paginationProcessing = require('../../middlewares/paginationProcessing')
const setResponseDetailLevel = require('../../middlewares/setResponseDetailLevel')(modelReference)

module.exports = [
  setQueryBaseOptions,
  setResponseDetailLevel,
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
  paginationProcessing(),
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
