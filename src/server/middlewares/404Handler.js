const path = require('path')

require('dotenv').config()

const accessPath = process.env.NODE_ENV === 'development'
  ? path.resolve('./src/server')
  : path.resolve('./dist')

const eVars = require(path.join(accessPath, 'config/eVars'))
const logging = require(path.join(accessPath, 'controllers/logging'))

module.exports = (req, res) => {
  logging.warning(`由客戶端接收到未配置的端點要求: ${eVars.PROTOCOL}://${eVars.DOMAIN}:${eVars.PORT}${req.path}`)
  return res.redirect(`${eVars.PROTOCOL}://${eVars.DOMAIN}:${eVars.PORT}/${eVars.SYS_REF}`)
}
