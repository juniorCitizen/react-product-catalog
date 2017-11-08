const jwt = require('jsonwebtoken')
const path = require('path')

require('dotenv').config()

const accessPath = process.env.NODE_ENV === 'development'
  ? path.resolve('./src/server')
  : path.resolve('./dist')

const db = require(path.join(accessPath, 'controllers/database'))
const eVars = require(path.join(accessPath, 'config/eVars'))
const logging = require(path.join(accessPath, 'controllers/logging'))
const routerResponse = require(path.join(accessPath, 'controllers/routerResponse'))

module.exports = (req, res, next) => {
  if (!eVars.ENFORCE_VALIDATION) {
    logging.warning('SYSTEM IS CONFIGURED TO SKIP TOKEN VALIDATION !!!')
    next()
  } else {
    let accessToken =
      (req.body && req.body.accessToken) ||
      (req.query && req.query.accessToken) ||
      req.headers['x-access-token']
    if (accessToken) { // if a token is found
      return jwt.verify(accessToken, eVars.PASS_PHRASE, (error, decodedToken) => {
        // if decoding error is encountered
        if (error) {
          logging.warning('UNAUTHORIZED TOKEN DETECTED!!!')
          return routerResponse.json({
            req: req,
            res: res,
            statusCode: 401,
            error: error,
            message: 'unauthorized token'
          })
        } else { // successfully decoded
          return db.Users.findOne({
            where: {
              email: decodedToken.email.toLowerCase(),
              loginId: decodedToken.loginId,
              admin: true
            }
          }).then((user) => {
            if (user) {
              next()
              return Promise.resolve()
            } else {
              logging.warning('UNAUTHORIZED USER LOGIN DETECTED!!!')
              routerResponse.json({
                req: req,
                res: res,
                statusCode: 401,
                message: 'unauthorized user login detected'
              })
              let error = new Error('UNAUTHORIZED_USER')
              error.name = 'UNAUTHORIZED_USER'
              error.message = 'unauthorized user login detected'
              return Promise.reject(error)
            }
          }).catch((error) => {
            logging.error(error, 'middlewares/validateJwt.js jwt.verify() errored')
            return routerResponse.json({
              req: req,
              res: res,
              statusCode: 500,
              error: error
            })
          })
        }
      })
    } else { // if there is no token, return an error
      return routerResponse.json({
        req: req,
        res: res,
        statusCode: 401,
        message: 'missing token'
      })
    }
  }
}
