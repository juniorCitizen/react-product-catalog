const db = require('../../controllers/database')
const encryption = require('../../controllers/encryption')
const routerResponse = require('../../controllers/routerResponse')

const validateJwt = require('../../middlewares/validateJwt')
const validatePasswordFormat = require('../../middlewares/validatePasswordFormat')

module.exports = (() => {
  return [
    validateJwt,
    validatePasswordFormat,
    (req, res) => {
      let encryptedPassword = encryption.sha512(req.body.password, encryption.saltGen(16))
      db.Contacts
        .create({
          email: req.body.email.toLowerCase(),
          name: req.body.name,
          loginId: req.body.loginId,
          password: encryptedPassword.passwordHash,
          salt: encryptedPassword.salt,
          admin: false
        })
        .then(() => { return db.Contacts.findById('loginId') })
        .then((data) => {
          return routerResponse.json({ req, res, statusCode: 200, data })
        })
        .catch((error) => {
          return routerResponse.json({ req, res, statusCode: 500, error })
        })
    }]
})()
