const jwt = require('jsonwebtoken')

const db = require('../../controllers/database')
const encryption = require('../../controllers/encryption')
const eVars = require('../../config/eVars')

const botPrevention = require('../../middlewares/botPrevention')
const validateJwt = require('../../middlewares/validateJwt')
const validatePasswordFormat = require('../../middlewares/validatePasswordFormat')

module.exports = [
  botPrevention,
  validatePasswordFormat,
  // registration of an admin account requires a valid jwt with admin privilege
  // admin === true, a admin level middleware validation will be activated
  (req, res, next) => {
    // client attempted to register a admin account
    return (('admin' in req.body) && (req.body.admin === 'true'))
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
          address: req.body.address,
          telephone: req.body.telephone,
          fax: req.body.fax,
          website: req.body.website,
          host: false
        }
        for (let props in companyData) {
          if (companyData[props] === '') delete companyData[props]
        }
        return db.Companies
          .create(companyData, { transaction: trx })
          .then(newCompany => {
            let encryptedPassword = encryption.sha512(req.body.password, encryption.saltGen(16))
            let contactData = {
              email: req.body.email.toLowerCase(),
              name: req.body.name,
              mobile: req.body.mobile || null,
              hashedPassword: encryptedPassword.hashedPassword,
              salt: encryptedPassword.salt,
              admin: (() => {
                if ('admin' in req.body) {
                  return req.body.admin === 'true'
                } else {
                  return false
                }
              })(),
              companyId: newCompany.id
            }
            for (let props in contactData) {
              if (contactData[props] === '') delete contactData[props]
            }
            return db.Contacts
              .create(contactData, { transaction: trx })
          })
      })
      .then(newContact => {
        return db.Contacts
          .findAll({ where: { email: newContact.email } })
      })
      .then(contact => {
        let token = jwt.sign({
          name: contact[0].name,
          email: contact[0].email,
          admin: contact[0].admin
        }, eVars.PASS_PHRASE, { expiresIn: '24h' })
        req.resJson = {
          data: token,
          message: `${contact[0].admin ? 'Admin' : 'User'} account '${contact[0].email}' registered successfully. Privilege is supplied for 24 hours`
        }
        next()
        return Promise.resolve()
      })
      .catch(error => next(error))
  }
]
