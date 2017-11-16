const db = require('../../controllers/database')
const eVars = require('../../config/eVars')
const logging = require('../../controllers/logging')
const routerResponse = require('../../controllers/routerResponse')

const modelReference = 'countries'

const setQueryBaseOptions = require('../../middlewares/setQueryBaseOptions')(modelReference)
const paginationLinkHeader = require('../../middlewares/paginationLinkHeader')

module.exports = (() => {
  let getRecordCount = require('axios')({
    method: 'get',
    url: `${eVars.PROTOCOL}://${eVars.DOMAIN}:${eVars.PORT}/${eVars.SYS_REF}/api/${modelReference}/count`
  }).then(res => res.data.data).catch(logging.reject)

  return [
    setQueryBaseOptions,
    paginationLinkHeader(getRecordCount, 5, 0),
    (req, res) => {
      return db.Countries
        .findAll(req.queryOptions)
        .then((data) => {
          return routerResponse.json({ res, req, statusCode: 200, data })
        })
        .catch((error) => {
          return routerResponse.json({
            req,
            res,
            statusCode: 500,
            error,
            message: 'failure getting country dataset'
          })
        })
    }]
})()
