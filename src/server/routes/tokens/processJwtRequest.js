const jwt = require('jsonwebtoken')
const multer = require('multer')

const db = require('../../controllers/database')
const encryption = require('../../controllers/encryption')
const eVars = require('../../config/eVars')

const botPrevention = require('../../middlewares/botPrevention')
const enforceBodyFieldPresence = require('../../middlewares/enforceBodyFieldPresence')
const validatePasswordFormat = require('../../middlewares/validatePasswordFormat')

module.exports = [
  multer().none(),
  enforceBodyFieldPresence(['email', 'password', 'botPrevention']),
  validatePasswordFormat,
  botPrevention,
  accountDiscovery,
  checkPassword
]

function accountDiscovery (req, res, next) {
  // find the account
  return db.Contacts.findOne({
    where: { email: req.body.email.toLowerCase() },
    include: { model: db.Companies }
  }).then(contact => {
    if (!contact) { // account isn't found
      res.status(401)
      let error = new Error('Unauthorized')
      return next(error)
    }
    req.accountData = Object.assign({}, contact.dataValues)
    next()
    return Promise.resolve()
  }).catch(error => next(error))
}

function checkPassword (req, res, next) {
  // hash the submitted password against the salt string
  let hashedPasswordToCheck = encryption
    .sha512(req.body.password, req.accountData.salt)
    .hashedPassword
  // compare with the stored hash
  if (hashedPasswordToCheck === req.accountData.hashedPassword) {
    // hash checks out
    let token = jwt.sign({
      id: req.accountData.id,
      name: req.accountData.name,
      email: req.accountData.email,
      admin: req.accountData.admin
    }, eVars.PASS_PHRASE, { expiresIn: '24h' })
    let status = req.accountData.admin
      ? 'admin'
      : req.accountData.company.host
        ? 'staff'
        : 'user'
    req.resJson = {
      data: token,
      message: `account token with ${status} privilege is supplied for 24 hours`
    }
    return next()
  } else {
    // hash verification failed
    res.status(403)
    let error = new Error('Forbidden')
    return next(error)
  }
}
