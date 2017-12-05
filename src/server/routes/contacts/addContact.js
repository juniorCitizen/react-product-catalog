const jwt = require('jsonwebtoken')
const multer = require('multer')

const db = require('../../controllers/database')
const encryption = require('../../controllers/encryption')
const eVars = require('../../config/eVars')

const botPrevention = require('../../middlewares/botPrevention')
const validateJwt = require('../../middlewares/validateJwt')

module.exports = [
  multer().none(),
  botPrevention,
  // validate password format,
  // empty string '' is also valid at registration, otherwise must be 8~20 chars in length
  (req, res, next) => {
    if (!('password' in req.body)) {
      res.status(400)
      let error = new Error('Password missing')
      return next(error)
    } else if (req.body.password === '') {
      if (!adminValue(req)) return next()
      res.status(400)
      let error = new Error('Password is required for admin account registration')
      return next(error)
    } else if ((req.body.password.length < 8) || (req.body.password.length > 20)) {
      res.status(400)
      let error = new Error('Illegal password length')
      error.message = 'Password should be 8 to 20 characters long'
      return next(error)
    }
    return next()
  },
  // registration of an admin account requires a valid jwt with admin privilege
  // admin === true, a admin level middleware validation will be activated
  (req, res, next) => {
    // validate jwt if the client request is attempting to register an admin contact
    return adminValue(req)
      ? validateJwt({ admin: true })(req, res, next)
      : next()
  },
  (req, res, next) => {
    // start transaction
    return db.sequelize
      .transaction(trx => {
        let companyData = {
          countryId: req.body.countryId || 'twn',
          title: req.body.company,
          address: req.body.address || undefined,
          telephone: req.body.telephone || undefined,
          fax: req.body.fax || undefined,
          website: req.body.website || undefined
          // host: false // not implemented
        }
        return db.Companies
          .create(companyData, { transaction: trx })
          .then(newCompany => {
            let encryptedPassword = req.body.password !== ''
              ? encryption.sha512(req.body.password, encryption.saltGen(16))
              : { hashedPassword: null, salt: null }
            let contactData = {
              email: req.body.email.toLowerCase(),
              name: req.body.name,
              mobile: req.body.mobile || undefined,
              hashedPassword: encryptedPassword.hashedPassword,
              salt: encryptedPassword.salt,
              admin: adminValue(req),
              companyId: newCompany.id
            }
            return db.Contacts
              .create(contactData, { transaction: trx })
          })
      })
      .then(newContact => db.Contacts.findOne({ where: { email: newContact.email } }))
      .then(contact => {
        req.resJson = {
          data: contact.hashedPassword
            ? jwt.sign({
              id: contact.id,
              name: contact.name,
              email: contact.email,
              admin: contact.admin
            }, eVars.PASS_PHRASE, { expiresIn: '24h' })
            : undefined,
          message: (() => {
            return !contact.hashedPassword
              ? `Contact record for '${contact.email}' without login privilege is created`
              : `${contact.admin ? 'Admin' : 'User'} account '${contact.email}' registered successfully. Privilege is supplied for 24 hours`
          })()
        }
        next()
        return Promise.resolve()
      })
      .catch(error => next(error))
  }
]

function adminValue (req) {
  return 'admin' in req.body
    ? req.is('application/json')
      ? req.body.admin === true
      : req.body.admin === 'true'
    : false
}
