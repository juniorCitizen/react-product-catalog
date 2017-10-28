import db from '../../controllers/database/database'
import encryption from '../../controllers/encryption'
import routerResponse from '../../controllers/routerResponse'

module.exports = (req, res) => {
    let encryptedPassword =
        encryption.sha512(
            req.body.password,
            encryption.saltGen(16)
        )
    db.Users
        .upsert({
            email: req.body.email.toLowerCase(),
            name: req.body.name,
            loginId: req.body.loginId,
            password: encryptedPassword.passwordHash,
            salt: encryptedPassword.salt
        })
        .then(() => {
            return routerResponse.json({
                pendingResponse: res,
                originalRequest: req,
                statusCode: 200,
                success: true
            })
        })
        .catch((error) => {
            console.log(error.name)
            console.log(error.message)
            console.log(error.stack)
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
