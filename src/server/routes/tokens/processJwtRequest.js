const jwt = require('jsonwebtoken')

const eVars = require('../../config/eVars')

const db = require('../../controllers/database')
const encryption = require('../../controllers/encryption')

module.exports = [loginInfoPresence, botPrevention, accountDiscovery, checkPassword]

function loginInfoPresence (req, res, next) {
  if (
    !('email' in req.body) ||
    !('loginId' in req.body) ||
    !('password' in req.body) ||
    !('botPrevention' in req.body)
  ) {
    res.status(400)
    let error = new Error('incomplete login information')
    return next(error)
  }
  return next()
}

function botPrevention (req, res, next) {
  if (req.body.botPrevention === '') return next()
  res.status(401)
  let error = new Error('Bot-like activity detected')
  return next(error)
}

function accountDiscovery (req, res, next) {
  // find the account
  return db.Contacts.findOne({
    where: {
      email: req.body.email.toLowerCase(),
      loginId: req.body.loginId
    }
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
      name: req.accountData.name,
      email: req.accountData.email,
      loginId: req.accountData.loginId,
      admin: req.accountData.admin
    }, eVars.PASS_PHRASE, { expiresIn: '24h' })
    req.resJson = {
      data: token,
      message: `account token with ${(req.accountData.admin) ? 'admin' : 'user'} privilege is supplied for 24 hours`
    }
    return next()
  } else {
    // hash verification failed
    res.status(403)
    let error = new Error('Forbidden')
    return next(error)
  }
}
