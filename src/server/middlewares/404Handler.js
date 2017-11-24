const eVars = require('../config/eVars')
const logging = require('../controllers/logging')

module.exports = (req, res, next) => {
  logging.warning(`不存在的頁面: ${eVars.HOST}${req.path}`)
  res.status(404)
  return res.redirect(`${eVars.APP_ROUTE}`)
}
