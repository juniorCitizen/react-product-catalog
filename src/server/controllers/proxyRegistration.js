const axios = require('axios')

const eVars = require('../config/eVars')
const logging = require('../controllers/logging')

module.exports = (() => {
  let axiosOptions = {
    method: 'get',
    url: `${eVars.PROTOCOL}://${eVars.DOMAIN}://${eVars.HOST}/register?reference=${eVars.SYS_REF}&proxyPath=/${eVars.SYS_REF}&targetUrl=http://localhost:${eVars.PORT}`
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
