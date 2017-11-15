const routerResponse = require('../controllers/routerResponse')

module.exports = (req, res, next) => {
  if (req.body.botPrevention === '') {
    next()
  } else {
    return next(routerResponse.json({
      req,
      res,
      statusCode: 400,
      message: 'bot-like activity detected'
    }))
  }
}
