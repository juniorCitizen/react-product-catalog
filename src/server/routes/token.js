const express = require('express')
const jwt = require('jsonwebtoken')
const path = require('path')

require('dotenv').config()

const accessPath = process.env.NODE_ENV === 'development'
  ? path.resolve('./src/server')
  : path.resolve('./dist')

const db = require(path.join(accessPath, 'controllers/database'))
const encryption = require(path.join(accessPath, 'controllers/encryption'))
const eVars = require(path.join(accessPath, 'config/eVars'))
const routerResponse = require(path.join(accessPath, 'controllers/routerResponse'))

const botPrevention = require(path.join(accessPath, 'middlewares/botPrevention'))

const router = express.Router()

router.post('/', loginInfoPresence, botPrevention, tokenRequest)

module.exports = router

function tokenRequest (req, res) {
  db.Users
    .findOne({
      where: {
        email: req.body.email,
        loginId: req.body.loginId,
        admin: true
      }
    })
    .then((apiUser) => {
      if (apiUser === null) { // reject the request if such user does not exist
        return routerResponse.json({
          req: req,
          res: res,
          statusCode: 401,
          message: 'incorrect login information'
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
          req: req,
          res: res,
          statusCode: 200,
          data: {
            token: jwt.sign(payload, eVars.PASS_PHRASE, { expiresIn: '24h' })
          },
          message: 'token is supplied for 24 hours'
        })
      } else { // hash verification failed
        return routerResponse.json({
          req: req,
          res: res,
          statusCode: 401,
          message: 'incorrect login information'
        })
      }
    })
    .catch((error) => {
      return routerResponse.json({
        req: req,
        res: res,
        statusCode: 500,
        error: error,
        message: 'routes/token/token.js tokenRequest() errored'
      })
    })
}

function loginInfoPresence (req, res, next) {
  if (
    (req.body === undefined) ||
    (req.body.email === undefined) ||
    (req.body.loginId === undefined) ||
    (req.body.password === undefined) ||
    (req.body.botPrevention === undefined)
  ) {
    return routerResponse.json({
      req: req,
      res: res,
      statusCode: 401,
      message: 'login info is incomplete'
    })
  }
  next()
}
