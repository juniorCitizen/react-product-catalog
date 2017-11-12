const db = require('../../controllers/database')
const routerResponse = require('../../controllers/routerResponse')

const productQueryParameters = require('../../models/ormQueryParameters/products')

module.exports = (() => {
  return [(req, res) => {
    let queryParameters = req.query.hasOwnProperty('details')
      ? productQueryParameters.details()
      : productQueryParameters.simple()
    let query = null
    if ((req.query.hasOwnProperty('id')) &&
      !(req.query.hasOwnProperty('code'))) {
      // lookup by id
      query = db.Products
        .findById(req.query.id.toUpperCase(), queryParameters)
        .catch(error => Promise.reject(error))
    } else if ((req.query.hasOwnProperty('code')) &&
      !(req.query.hasOwnProperty('id'))) {
      // lookup by code
      Object.assign(queryParameters, { where: { code: req.query.code } })
      query = db.Products
        .findOne(queryParameters)
        .catch(error => Promise.reject(error))
    } else if ((req.query.hasOwnProperty('code')) &&
      (req.query.hasOwnProperty('id'))) {
      // if id and name exists at the same time
      let error = Error('code and id url queries cannot co-exist')
      error.name = 'CODE_AND_ID_COEXIST_CONFLICT'
      error.httpStatusCode = 400
      return Promise.reject(error)
    } else {
      // query for full recordset
      query = db.Products
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
        message: 'error reading product data'
      }))
  }]
})()
