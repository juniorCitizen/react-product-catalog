const nodemailer = require('nodemailer')

const eVars = require('./eVars')

// const pop3 = {
//   host: eVars.EMAIL_HOST,
//   port: eVars.EMAIL_PORT,
//   secure: true,
//   auth: {
//     user: eVars.ADMIN_EMAIL,
//     pass: eVars.ADMIN_EMAIL_PASSWORD
//   },
//   tls: {
//     rejectUnauthorized: false
//   }
// }

const gmail = {
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: eVars.ADMIN_EMAIL,
    clientId: eVars.CLIENT_ID,
    clientSecret: eVars.CLIENT_SECRET,
    refreshToken: eVars.REFRESH_TOKEN,
    accessToken: eVars.ACCESS_TOKEN
  }
}

module.exports = (() => {
  return nodemailer.createTransport(gmail)
})()
