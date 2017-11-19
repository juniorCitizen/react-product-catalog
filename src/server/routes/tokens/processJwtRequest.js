const jwt = require('jsonwebtoken')

const eVars = require('../../config/eVars')

const db = require('../../controllers/database')
const encryption = require('../../controllers/encryption')
const routerResponse = require('../../controllers/routerResponse')

const botPrevention = require('../../middlewares/botPrevention')
const loginInfoPresence = require('../../middlewares/loginInfoPresence')

module.exports = (() => {
  return [
    loginInfoPresence,
    botPrevention,
    (req, res) => {
      return db.Users.findOne({
        where: { email: req.body.email, loginId: req.body.loginId, admin: true }
      }).then((apiUser) => {
        if (!apiUser) {
          // reject the request if such user does not exist
          return routerResponse.json({
            req, res, statusCode: 401, message: 'incorrect login information'
          })
        }
        // hash the submitted password against the salt string
        let currentHash = encryption.sha512(req.body.password, apiUser.salt).passwordHash
        // compare with the stored hash
        if (currentHash === apiUser.password) { // hash verified
          let payload = {
            email: req.body.email,
            loginId: req.body.loginId
          }
          return routerResponse.json({
            req,
            res,
            statusCode: 200,
            data: jwt.sign(payload, eVars.PASS_PHRASE, { expiresIn: '24h' }),
            message: 'token is supplied for 24 hours'
          })
        } else { // hash verification failed
          return routerResponse.json({
            req, res, statusCode: 401, message: 'incorrect login information'
          })
        }
      }).catch(error => routerResponse.json({
        req, res, statusCode: 500, error, message: 'jwt request failure'
      }))
    }]
})()
