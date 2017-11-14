const jwt = require('jsonwebtoken')

const db = require('../controllers/database')
const eVars = require('../config/eVars')
const logging = require('../controllers/logging')
const routerResponse = require('../controllers/routerResponse')

module.exports = (req, res, next) => {
  if (!eVars.ENFORCE_VALIDATION) {
    logging.warning('SYSTEM IS CONFIGURED TO SKIP TOKEN VALIDATION !!!')
    next()
  } else {
    let accessToken = req.get('x-access-token')
    if (accessToken) { // if a token is found
      return jwt.verify(accessToken, eVars.PASS_PHRASE, (error, decodedToken) => {
        if (error) { // if decoding error is encountered
          return routerResponse.json({
            req,
            res,
            statusCode: 401,
            error,
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
              routerResponse.json({
                req,
                res,
                statusCode: 401,
                message: 'unauthorized credential'
              })
              return Promise.reject(new Error('UNAUTHORIZED_CREDENTIAL'))
            }
          }).catch((error) => {
            return routerResponse.json({
              req,
              res,
              statusCode: 500,
              error
            })
          })
        }
      })
    } else { // if there is no token, return an error
      return routerResponse.json({
        req,
        res,
        statusCode: 401,
        message: 'missing token'
      })
    }
  }
}
