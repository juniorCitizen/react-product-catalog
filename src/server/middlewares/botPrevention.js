const logging = require('../controllers/logging')
const routerResponse = require('../controllers/routerResponse')

module.exports = (req, res, next) => {
  if (req.body.botPrevention === '') {
    next()
  } else {
    logging.warning('bot-like activity detected')
    return routerResponse.json({
      req: req,
      res: res,
      statusCode: 500,
      message: ''
    })
  }
}
