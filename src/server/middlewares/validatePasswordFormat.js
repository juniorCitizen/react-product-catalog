const routerResponse = require('../controllers/routerResponse')

module.exports = (req, res, next) => {
  if (!req.body.hasOwnProperty('password')) {
    routerResponse.json({
      req, res, statusCode: 401, message: 'password not found'
    })
    return next('PASSWORD_NOT_FOUND')
  } else if ((req.body.password.length < 8) || (req.body.password.length > 20)) {
    routerResponse.json({
      req, res, statusCode: 401, message: 'wrong password format'
    })
    return next('WRONG_PASSWORD_FORMAT')
  }
  next()
}
