const routerResponse = require('../controllers/routerResponse')

module.exports = (req, res, next) => {
  let expectedFields = ['email', 'loginId', 'password', 'botPrevention']
  expectedFields.forEach((fieldName) => {
    if (!(fieldName in req.body)) {
      routerResponse.json({
        req, res, statusCode: 401, message: 'login info is incomplete'
      })
      return next('LOGIN_INFO_IMCOMPLETE')
    }
  })
  next()
}
