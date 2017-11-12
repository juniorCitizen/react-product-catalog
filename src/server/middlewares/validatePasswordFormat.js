const routerResponse = require('../controllers/routerResponse')

module.exports = (req, res, next) => {
  if (
    (!req.body.password) ||
    ((req.body.password.length < 8) || (req.body.password.length > 20))
  ) {
    return routerResponse.json({
      req: req,
      res: res,
      statusCode: 401,
      message: 'password not transmitted or is of incorrect length'
    })
  }
  next()
}
