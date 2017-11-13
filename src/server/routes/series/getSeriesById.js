const db = require('../../controllers/database')
const routerResponse = require('../../controllers/routerResponse')

const setBaseQueryParameters = require('./middlewares').setBaseQueryParameters
const setResponseDetailLevel = require('./middlewares').setResponseDetailLevel

module.exports = (() => {
  return [
    setBaseQueryParameters,
    setResponseDetailLevel,
    (req, res) => {
      return db.Series
        .findById(req.params.seriesId, req.queryParameters)
        .then((data) => routerResponse.json({
          req, res, statusCode: 200, data
        }))
        .catch(error => routerResponse.json({
          req,
          res,
          statusCode: 500,
          error,
          message: 'query series by id errored'
        }))
    }]
})()
