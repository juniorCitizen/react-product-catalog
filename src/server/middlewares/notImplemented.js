const routerResponse = require('../controllers/routerResponse')

module.exports = (req, res, next) => {
  return routerResponse.json({ req, res, statusCode: 501 })
}
