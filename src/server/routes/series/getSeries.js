const db = require('../../controllers/database')
const routerResponse = require('../../controllers/routerResponse')

const seriesQueryParameters = require('../../models/ormQueryParameters/series')

module.exports = (() => {
  return [(req, res) => {
    let queryParameters = req.query.hasOwnProperty('details')
      ? seriesQueryParameters.details()
      : seriesQueryParameters.simple()
    let query = null
    if ((req.query.hasOwnProperty('id')) &&
      !(req.query.hasOwnProperty('name'))) {
      // lookup by id
      query = db.Series
        .findById(req.query.id, queryParameters)
        .catch(error => Promise.reject(error))
    } else if ((req.query.hasOwnProperty('name')) &&
      !(req.query.hasOwnProperty('id'))) {
      // lookup by name
      Object.assign(queryParameters, { where: { name: req.query.name } })
      query = db.Series
        .findOne(queryParameters)
        .catch(error => Promise.reject(error))
    } else if ((req.query.hasOwnProperty('name')) &&
      (req.query.hasOwnProperty('id'))) {
      // if id and name exists at the same time
      let error = Error('name and id url queries cannot co-exist')
      error.name = 'NAME_AND_ID_COEXIST_CONFLICT'
      error.httpStatusCode = 400
      return Promise.reject(error)
    } else {
      // query for full recordset
      query = db.Series
        .findAll(queryParameters)
        .catch(error => Promise.reject(error))
    }
    return query
      .then(data => routerResponse.json({
        req,
        res,
        statusCode: 200,
        data
      })).catch(error => routerResponse.json({
        req,
        res,
        statusCode: error.httpStatusCode || 500,
        error,
        message: 'error reading series data'
      }))
  }]
})()
