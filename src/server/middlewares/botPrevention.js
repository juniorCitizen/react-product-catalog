const routerResponse = require('../controllers/routerResponse')

module.exports = (req, res, next) => {
  if (req.body.botPrevention === '') {
    next()
  } else {
    return routerResponse.json({
      req: req,
      res: res,
      statusCode: 400,
      message: 'bot-like activity detected'
    })
  }
}
