import chalk from 'chalk'
import jwt from 'jsonwebtoken'

import db from '../controllers/database/database'
import eVars from '../config/environment'
import routerResponse from '../controllers/routerResponse'

module.exports = (request, response, next) => {
  if (!eVars.ENFORCE_VALIDATION) {
    console.log(chalk.red('SYSTEM IS CONFIGURED TO SKIP TOKEN VALIDATION !!!'))
    next()
  } else {
    let accessToken =
      (request.body && request.body.accessToken) ||
      (request.query && request.query.accessToken) ||
      request.headers['x-access-token']
    if (accessToken) { // if a token is found
      jwt.verify(accessToken, eVars.PASS_PHRASE, (error, decodedToken) => {
        if (error) {
          console.log('401 Forbidden (unrecognized token)')
          return routerResponse.json({
            pendingResponse: response,
            originalRequest: request,
            statusCode: 401,
            success: false,
            error: error.name,
            message: error.message,
            data: error.stack
          })
        }
        return db.Users.findOne({
          where: {
            email: decodedToken.email.toLowerCase(),
            loginId: decodedToken.loginId
          }
        }).then((user) => {
          if (user) {
            return next()
          } else {
            let error = new Error('401 Forbidden (unrecognized user)')
            error.name = 'userNotExist'
            return routerResponse.json({
              pendingResponse: response,
              originalRequest: request,
              statusCode: 401,
              success: false,
              error: error.name,
              message: error.message
            })
          }
        }).catch((error) => {
          return routerResponse.json({
            pendingResponse: response,
            originalRequest: request,
            statusCode: 401,
            success: false,
            error: error.name,
            message: error.message,
            data: error.stack
          })
        })
      })
    } else { // if there is no token, return an error
      let error = new Error('401 Forbidden (token missing)')
      error.name = 'tokenMissing'
      return routerResponse.json({
        pendingResponse: response,
        originalRequest: request,
        statusCode: 401,
        success: false,
        error: error.name,
        message: error.message
      })
    }
  }
}
