const jwt = require('jsonwebtoken')

const db = require('../controllers/database')
const eVars = require('../config/eVars')
const logging = require('../controllers/logging')

/*
restrictionLevel is an object
{ // parameters are all optional, defaults to general account comparison by email only
  none: true/false, // skips validation entirely, used on routes that's openly accessable to public (other restrictions will be ignored)
  admin: true/false, // account found by email lookup must has true as admin field value (staff and user restrictions will be ignored)
  staff: true/false, // accounts registered under hosting companies
  user: true/false // matches token payload id to account id found by query email, also need to match req.params.contactId
}
*/

module.exports = ({ none = false, admin = false, staff = false, user = false } = {}) => {
  return (req, res, next) => {
    // skip validation if specified in the .env file
    if (!eVars.ENFORCE_VALIDATION) {
      logging.warning('SYSTEM IS CONFIGURED TO SKIP ALL TOKEN VALIDATION !!!')
      return next()
    }

    // skip validation if specified by the server code
    if (none) return next()

    // check if token exists in the request header
    let accessToken = req.get('x-access-token')
    if (!accessToken) {
      res.status(401)
      let error = new Error('Missing Token')
      return next(error)
    }

    // decode token and verify against restriction settings
    return jwt.verify(accessToken, eVars.PASS_PHRASE, (error, decodedToken) => {
      if (error) { // token cannot be decoded
        res.status(401)
        return next(error)
      }

      // token decoded, search contact list for account that at least matches in email
      return db.Contacts
        .scope({ method: ['credentialsOnly'] })
        .findOne({ where: { email: decodedToken.email } })
        .then(contact => {
          // token carries an email that's not registered in the contact records
          if (!contact) {
            res.status(401)
            let error = new Error('Cannot validate the provided credentials')
            next(error)
            return Promise.resolve()
          }

          // determine and set user privilege level
          let privilege = req.userPrivilege = contact.admin ? 3 : contact.company.host ? 2 : 1
          req.registeredUser = contact

          // matching account has admin privilege, allow access immediately
          if (privilege === 3) {
            next()
            return Promise.resolve()
          }

          // if admin privilege is required
          if (admin && (privilege < 3)) {
            res.status(403)
            let error = new Error('Only admin accounts are authorized')
            next(error)
            return Promise.resolve()
          }

          // only staff is allowed
          if (staff && !user && (privilege < 2)) {
            res.status(403)
            let error = new Error('Only hosting company\'s staff accounts are authorizded')
            next(error)
            return Promise.resolve()
          }

          // if only user is allowed
          if (user && !staff) {
            // prevent staff account accessing private user features
            if (privilege === 2) {
              res.status(403)
              let error = new Error('Private user features are not accessible to staff accounts')
              next(error)
              return Promise.resolve()
            }
            // check user account
            if (privilege === 1) {
              // parse contactId from either req.params or req.body
              let parsedContactId = 'contactId' in req.params
                ? req.params.contactId.toUpperCase()
                : 'contactId' in req.body
                  ? req.body.contactId.toUpperCase()
                  : null

              // contactId parsed from payload does not match request designated contactId
              if (decodedToken.id !== parsedContactId) {
                res.status(403)
                let error = new Error('Attempt to access other user\'s information')
                next(error)
                return Promise.resolve()
              }

              // token payload contactId does not match the account id
              if (decodedToken.id !== contact.id) {
                res.status(401)
                let error = new Error('Token tempering detected')
                next(error)
                return Promise.resolve()
              }

              // make sure the user is a client account
              if ((contact.companyId !== null) && (contact.company.host !== false)) {
                res.status(401)
                let error = new Error('Only client account is allowed access')
                next(error)
                return Promise.resolve()
              }
            }
          }
          // all restriction had been applied or only general privilege is required
          next()
          return Promise.resolve()
        })
        .catch((error) => next(error))
    })
  }
}
