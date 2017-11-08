const nodemailer = require('nodemailer')
const path = require('path')

require('dotenv').config()

const accessPath = process.env.NODE_ENV === 'development'
  ? path.resolve('./src/server')
  : path.resolve('./dist')

const eVars = require(path.join(accessPath, 'config/eVars'))

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
