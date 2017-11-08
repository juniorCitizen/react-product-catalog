const path = require('path')

require('dotenv').config()

const accessPath = process.env.NODE_ENV === 'development'
  ? path.resolve('./src/server')
  : path.resolve('./dist')

const routerResponse = require(path.join(accessPath, 'controllers/routerResponse'))

module.exports = (req, res, next) => {
  if (
    (!req.body.password) ||
    ((req.body.password.length < 8) || (req.body.password.length > 20))
  ) {
    return routerResponse.json({
      req: req,
      res: res,
      statusCode: 500,
      message: 'invalid password'
    })
  }
  next()
}
