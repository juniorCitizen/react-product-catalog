const express = require('express')
const jwt = require('jsonwebtoken')

const db = require('../controllers/database')
const encryption = require('../controllers/encryption')
const eVars = require('../config/eVars')
const routerResponse = require('../controllers/routerResponse')

const botPrevention = require('../middlewares/botPrevention')
const notImplemented = require('../middlewares/notImplemented')

module.exports = express.Router()
  .get('/', notImplemented)
  .post('/', ...processJwtRequest()) // verify against user credentials and provide a jwt upon success
  .put('/', notImplemented)
  .patch('/', notImplemented)
  .delete('/', notImplemented)

function processJwtRequest () {
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
}

function loginInfoPresence (req, res, next) {
  let expectedFields = ['email', 'loginId', 'password', 'botPrevention']
  expectedFields.forEach((fieldName) => {
    if (!req.body.hasOwnProperty(fieldName)) {
      routerResponse.json({
        req, res, statusCode: 401, message: 'login info is incomplete'
      })
      return next('LOGIN_INFO_IMCOMPLETE')
    }
  })
  next()
}
