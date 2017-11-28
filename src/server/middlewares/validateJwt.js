const jwt = require('jsonwebtoken')

const db = require('../controllers/database')
const eVars = require('../config/eVars')
const logging = require('../controllers/logging')

/*
restrictionLevel is an object
{ // parameters are all optional, defaults to general account comparison by email only
  none: true/false, // skips validation entirely, used on routes that's openly accessable to public
  admin: true/false, // account found by email lookup must has true as admin field value
  user: true/false // matches token payload id to account id found by query email, also need to match req.params.contactId
}
*/

module.exports = ({ none = false, admin = false, user = false } = {}) => {
  return (req, res, next) => {
    // system is configured to skip validation
    if (!eVars.ENFORCE_VALIDATION) {
      logging.warning('SYSTEM IS CONFIGURED TO SKIP TOKEN VALIDATION !!!')
      return next()
    }
    // skip validation on purpose
    if (none === true) return next()
    // grab token from request header
    let accessToken = req.get('x-access-token')
    if (!accessToken) { // if there is no token, return an error
      res.status(401)
      let error = new Error('Missing Token')
      return next(error)
    }
    // process the received request header
    return jwt.verify(accessToken, eVars.PASS_PHRASE, (error, decodedToken) => {
      if (error) { // if decoding error is encountered
        res.status(401)
        return next(error)
      }
      // token is successfully decoded
      if (user === true) {
        // if restriction level is set to 'self: true'
        if (!('contactId' in req.params) || (decodedToken.id !== req.params.contactId)) {
          // route must have a req.params.contactId and matching token payload id
          res.status(400)
          let error = new Error('id in token payload does not match route')
          return next(error)
        }
      }
      // base query option
      // system issued token should already have an email with only lowercased letters
      let queryOptions = { email: decodedToken.email } // valid for looking up all matching contacts
      // add admin restriction
      if (admin === true) Object.assign(queryOptions, { admin: true })
      // add restriction against user's own records
      if (user === true) Object.assign(queryOptions, { id: decodedToken.id })
      return db.Contacts.findOne(queryOptions)
        .then(contact => {
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
