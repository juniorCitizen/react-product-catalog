const jwt = require('jsonwebtoken')

const db = require('../controllers/database')
const eVars = require('../config/eVars')
const logging = require('../controllers/logging')

module.exports = (req, res, next) => {
  if (!eVars.ENFORCE_VALIDATION) {
    logging.warning('SYSTEM IS CONFIGURED TO SKIP TOKEN VALIDATION !!!')
    return next()
  } else {
    let accessToken = req.get('x-access-token')
    if (!accessToken) { // if there is no token, return an error
      res.status(401)
      req.resJson = { message: 'Missing Token' }
      return next()
    }
    // if a token is found
    return jwt.verify(accessToken, eVars.PASS_PHRASE, (error, decodedToken) => {
      if (error) { // if decoding error is encountered
        res.status(401)
        return next(error)
      }
      // successfully decoded
      return db.Users.findOne({
        where: {
          email: decodedToken.email.toLowerCase(),
          loginId: decodedToken.loginId,
          admin: true
        }
      }).then((user) => {
        if (!user) {
          res.status(401)
          req.resJson = { message: 'Unauthorized Credentials' }
        }
        next()
        return Promise.resolve()
      }).catch((error) => next(error))
    })
  }
}
