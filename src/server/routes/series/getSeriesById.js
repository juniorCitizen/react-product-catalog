const db = require('../../controllers/database')

const setBaseQueryParameters = require('../../middlewares/setQueryBaseOptions')('series')
const setResponseDetailLevel = require('../../middlewares/setResponseDetailLevel')('series')

module.exports = (() => {
  return [
    setBaseQueryParameters,
    setResponseDetailLevel,
    (req, res, next) => {
      return db.Series
        .findById(req.params.seriesId, req.queryOptions)
        .then((data) => {
          req.resJson = { data: data.get({ plain: true }) }
          next()
          return Promise.resolve()
        })
        .catch(error => next(error))
    }]
})()
