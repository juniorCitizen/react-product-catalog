const jwt = require('jsonwebtoken')

const db = require('../controllers/database')
const eVars = require('../config/eVars')
const logging = require('../controllers/logging')

// restrictionLevel could be 'admin' or 'user'
// (any other string would default to 'admin')
// on 'user' - if account found next()
// on 'admin' - if account found and 'admin' === true next()

module.exports = (restrictionLevel = 'admin') => {
  return (req, res, next) => {
    if (!eVars.ENFORCE_VALIDATION) {
      logging.warning('SYSTEM IS CONFIGURED TO SKIP TOKEN VALIDATION !!!')
      return next()
    } else {
      let accessToken = req.get('x-access-token')
      if (!accessToken) { // if there is no token, return an error
        res.status(401)
        let error = new Error('Missing Token')
        return next(error)
      }
      // if a token is found
      return jwt.verify(accessToken, eVars.PASS_PHRASE, (error, decodedToken) => {
        if (error) { // if decoding error is encountered
          res.status(401)
          return next(error)
        }
        // token is successfully decoded
        return db.Contacts.findOne({
          where: (restrictionLevel !== 'user')
            ? { // find admin account
              email: decodedToken.email.toLowerCase(),
              loginId: decodedToken.loginId,
              admin: true
            }
            : { // find admin and user account
              email: decodedToken.email.toLowerCase(),
              loginId: decodedToken.loginId
            }
        }).then(contact => {
          if (!contact) { // nothing found
            res.status(401)
            let error = new Error('Unauthorized Credentials')
            next(error)
          } else { // matching account found
            next()
          }
          return Promise.resolve()
        }).catch((error) => next(error))
      })
    }
  }
}
