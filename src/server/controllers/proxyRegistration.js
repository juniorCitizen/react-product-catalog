import axios from 'axios'
const path = require('path')

require('dotenv').config()

const accessPath = process.env.NODE_ENV === 'development'
  ? path.resolve('./src/server')
  : path.resolve('./dist')

const eVars = require(path.join(accessPath, 'config/eVars'))
const logging = require(path.join(accessPath, 'controllers/logging'))

module.exports = (() => {
  let axiosOptions = {
    method: 'get',
    url: `${eVars.DOMAIN}://${eVars.HOST}/register?reference=${eVars.SYS_REF}&proxyPath=/${eVars.SYS_REF}&targetUrl=http://localhost:${eVars.PORT}`
  }
  return axios(axiosOptions)
    .then((response) => {
      return {
        registrationStatus: true,
        message: response
      }
    })
    .catch((error) => {
      logging.error(error, 'proxy server registration failure')
    })
})()
