const db = require('../../controllers/database')
const eVars = require('../../config/eVars')
const logging = require('../../controllers/logging')
const routerResponse = require('../../controllers/routerResponse')

const modelReference = 'products'

const setBaseQueryParameters = require('../../middlewares/setQueryBaseOptions')(modelReference)
const setResponseDetailLevel = require('../../middlewares/setResponseDetailLevel')(modelReference)
const paginationLinkHeader = require('../../middlewares/paginationLinkHeader')

module.exports = (() => {
  let getRecordCount = require('axios')({
    method: 'get',
    url: `${eVars.PROTOCOL}://${eVars.DOMAIN}:${eVars.PORT}/${eVars.SYS_REF}/api/${modelReference}/count`
  }).then(res => res.data.data).catch(logging.reject)

  return [
    setBaseQueryParameters,
    setResponseDetailLevel,
    paginationLinkHeader(getRecordCount, 20, 100),
    (req, res) => {
      return db.Products
        .findAll(req.queryOptions)
        .then(data => routerResponse.json({
          req, res, statusCode: 200, data
        })).catch(error => routerResponse.json({
          req,
          res,
          statusCode: 500,
          error,
          message: 'error getting product dataset'
        }))
    }]
})()
