const eVars = require('../config/eVars')
const logging = require('../controllers/logging')

module.exports = (req, res) => {
  logging.warning(`由客戶端接收到未配置的端點要求: ${eVars.HOST}${req.path}`)
  return res.redirect(`${eVars.HOST}/${eVars.SYS_REF}`)
}
