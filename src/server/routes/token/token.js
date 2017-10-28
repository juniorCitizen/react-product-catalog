import express from 'express'
import jwt from 'jsonwebtoken'

import db from '../../controllers/database/database'
import encryption from '../../controllers/encryption'
import eVars from '../../config/environment'
import routerResponse from '../../controllers/routerResponse'

const router = express.Router()

router.post('/', loginInfoPresence, require('../../middlewares/botPrevention'), tokenRequest)

module.exports = router

function tokenRequest(req, res) {
    db.Users
        .findOne({
            where: {
                email: req.body.email,
                loginId: req.body.loginId
            }
        })
        .then((apiUser) => {
            if (apiUser === null) { // reject the request if such user does not exist
                let error = new Error('no such user')
                error.name = 'invalidLogin'
                return routerResponse.json({
                    pendingResponse: res,
                    originalRequest: req,
                    statusCode: 401,
                    success: false,
                    error: error.name,
                    message: error.message
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
                    pendingResponse: res,
                    originalRequest: req,
                    statusCode: 200,
                    success: true,
                    data: {
                        token: jwt.sign(payload, eVars.PASS_PHRASE, { expiresIn: '24h' })
                    },
                    message: 'token is supplied for 24 hours'
                })
            } else { // hash verification failed
                let error = new Error('password did not verify')
                error.name = 'invalidPassword'
                return routerResponse.json({
                    pendingResponse: res,
                    originalRequest: req,
                    statusCode: 401,
                    error: error.name,
                    message: error.message
                })
            }
        })
        .catch((error) => {
            return routerResponse.json({
                pendingResponse: res,
                originalRequest: req,
                statusCode: 500,
                success: false,
                error: error.name,
                message: error.message,
                data: error.stack
            })
        })
}

function loginInfoPresence(req, res, next) {
    if (
        (req.body === undefined) ||
        (req.body.loginId === undefined) ||
        (req.body.password === undefined) ||
        (req.body.botPrevention === undefined)
    ) {
        let error = new Error('required login information missing')
        error.name = 'missingLoginInfo'
        return routerResponse.json({
            pendingResponse: res,
            originalRequest: req,
            statusCode: 401,
            success: false,
            error: error.name,
            message: error.message
        })
    }
    next()
}
