const jwt = require('jsonwebtoken')

const db = require('../controllers/database')
const eVars = require('../config/eVars')
const logging = require('../controllers/logging')

// restrictionLevel could be 'admin' or 'user'
// (any other string would default to 'admin')
// on 'user' - if account found next()
// on 'admin' - if account found and 'admin' === true next()
// on 'self' - used on /api/contacts/:contactId,
//    - decoded payload must be the same as :contactId
//    - used to restrict user to access endpoints with its own id
// on 'none' - skip validation process on purpose

module.exports = (restrictionLevel = 'admin') => {
  return (req, res, next) => {
    if (restrictionLevel === 'none') return next()
    // error checking
    if (['admin', 'self', 'user'].indexOf(restrictionLevel) === -1) {
      res.status(500)
      let error = new Error(`Restriction level ${restrictionLevel} is not valid`)
      return next(error)
    }
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
        if (
          (restrictionLevel === 'self') &&
          (
            !('contactId' in req.params) ||
            (decodedToken.id !== req.params.contactId)
          )
        ) {
          // route must have a req.params and match token payload id
          res.status(400)
          let error = new Error('id presented in token payload does not match route')
          return next(error)
        }
        return db.Contacts.findOne({
          where: (restrictionLevel !== 'admin')
            ? (restrictionLevel === 'self')
              ? { // find admin and user account with matching id and email
                email: decodedToken.email.toLowerCase(),
                id: decodedToken.id
              }
              : { // find admin and user account with just matching email
                email: decodedToken.email.toLowerCase()
              }
            : { // find admin account only
              email: decodedToken.email.toLowerCase(),
              admin: true
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
