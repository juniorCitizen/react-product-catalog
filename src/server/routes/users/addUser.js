const db = require('../../controllers/database')
const encryption = require('../../controllers/encryption')
const routerResponse = require('../../controllers/routerResponse')

module.exports = (req, res) => {
  let encryptedPassword = encryption.sha512(req.body.password, encryption.saltGen(16))
  db.Users
    .upsert({
      email: req.body.email.toLowerCase(),
      name: req.body.name,
      loginId: req.body.loginId,
      password: encryptedPassword.passwordHash,
      salt: encryptedPassword.salt
    })
    .then(() => { return db.Users.findById('loginId') })
    .then((user) => {
      return routerResponse.json({ req: req, res: res, statusCode: 200, data: user })
    })
    .catch((error) => {
      return routerResponse.json({ req: req, res: res, statusCode: 500, error: error })
    })
}
