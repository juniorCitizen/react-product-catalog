const jwt = require('jsonwebtoken')

const db = require('../controllers/database/database')
const eVars = require('../config/eVars')
const logging = require('../controllers/logging')
const routerResponse = require('../controllers/routerResponse')

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
      jwt.verify(accessToken, eVars.PASS_PHRASE, (error, decodedToken) => {
        if (error) {
          logging.warning('UNAUTHORIZED TOKEN DETECTED!!!')
          return routerResponse.json({
            req: req,
            res: res,
            statusCode: 401,
            error: error,
            message: 'unauthorized token'
          })
        }
        return db.Users.findOne({
          where: {
            email: decodedToken.email.toLowerCase(),
            loginId: decodedToken.loginId,
            admin: true
          }
        }).then((user) => {
          if (user) {
            return next()
          } else {
            logging.warning('UNAUTHORIZED USER LOGIN DETECTED!!!')
            return routerResponse.json({
              req: req,
              res: res,
              statusCode: 401,
              message: 'unauthorized user'
            })
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
