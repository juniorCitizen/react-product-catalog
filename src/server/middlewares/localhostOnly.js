const routerResponse = require('../controllers/routerResponse')

module.exports = (req, res, next) => {
  if ((req.hostname === 'localhost') || (req.ip === '127.0.0.1')) {
    next()
  } else {
    return routerResponse.json({
      req,
      res,
      statusCode: 400,
      message: 'the route you are trying to access is protected and only accessible from localhost'
    })
  }
}
