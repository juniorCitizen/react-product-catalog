const nodemailer = require('nodemailer')

const eVars = require('./eVars')

module.exports = (() => {
  return nodemailer.createTransport({
    host: eVars.EMAIL_HOST,
    port: eVars.EMAIL_PORT,
    secure: true,
    auth: {
      user: eVars.ADMIN_EMAIL,
      pass: eVars.ADMIN_EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  })
})()
