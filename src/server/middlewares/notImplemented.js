const routerResponse = require('../controllers/routerResponse')

module.exports = (req, res, next) => {
  return routerResponse.json({ req: req, res: res, statusCode: 501 })
}
