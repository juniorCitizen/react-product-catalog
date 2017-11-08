const path = require('path')

require('dotenv').config()

const accessPath = process.env.NODE_ENV === 'development'
  ? path.resolve('./src/server')
  : path.resolve('./dist')

const logging = require(path.join(accessPath, 'controllers/logging'))
const routerResponse = require(path.join(accessPath, 'controllers/routerResponse'))

module.exports = (req, res, next) => {
  if ((req.hostname === 'localhost') || (req.host === '127.0.0.1')) {
    next()
  } else {
    logging.warning('protected routes are being accessed from unauthorized locations')
    return routerResponse.json({
      req: req,
      res: res,
      statusCode: 400
    })
  }
}
