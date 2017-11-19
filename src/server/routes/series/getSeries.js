const db = require('../../controllers/database')

const setBaseQueryParameters = require('../../middlewares/setQueryBaseOptions')('series')
const setResponseDetailLevel = require('../../middlewares/setResponseDetailLevel')('series')

module.exports = (() => {
  return [
    setBaseQueryParameters,
    setResponseDetailLevel,
    (req, res, next) => {
      return db.Series
        .findAll(req.queryOptions)
        .then((data) => {
          req.resJson = { data }
          return next()
        })
        .catch(error => next(error))
    }]
})()
