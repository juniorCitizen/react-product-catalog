const path = require('path')

require('dotenv').config()

const accessPath = process.env.NODE_ENV === 'development'
  ? path.resolve('./src/server')
  : path.resolve('./dist')

const logging = require(path.join(accessPath, 'controllers/logging'))
const routerResponse = require(path.join(accessPath, 'controllers/routerResponse'))

module.exports = (req, res, next) => {
  if (req.body.botPrevention === '') {
    next()
  } else {
    logging.warning('bot-like activity detected')
    return routerResponse.json({
      req: req,
      res: res,
      statusCode: 400
    })
  }
}
