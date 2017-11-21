const eVars = require('../config/eVars')
const logging = require('../controllers/logging')

module.exports = (req, res, next) => {
  logging.warning(`由客戶端接收到未建置的頁面: ${eVars.HOST}${req.path}`)
  res.status(501)
  return res.redirect(`${eVars.APP_ROUTE}`)
}
