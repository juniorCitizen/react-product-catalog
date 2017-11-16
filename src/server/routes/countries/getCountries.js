const db = require('../../controllers/database')
const eVars = require('../../config/eVars')
const logging = require('../../controllers/logging')
const routerResponse = require('../../controllers/routerResponse')

const paginationLinkHeader = require('../../middlewares/paginationLinkHeader')
const setQueryBaseOptions = require('../../middlewares/setQueryBaseOptions')('countries')

module.exports = (() => {
  let getRecordCount = require('axios')({
    method: 'get',
    url: `${eVars.PROTOCOL}://${eVars.DOMAIN}:${eVars.PORT}/${eVars.SYS_REF}/api/countries/count`
  }).then(res => res.data.data).catch(logging.reject)

  return [
    setQueryBaseOptions,
    paginationLinkHeader(5, 0, getRecordCount),
    (req, res) => {
      console.log(req.linkHeader)
      console.log(req.queryOptions)
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
