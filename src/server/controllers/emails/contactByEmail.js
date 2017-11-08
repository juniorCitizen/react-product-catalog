const hbs = require('nodemailer-express-handlebars')
const path = require('path')

require('dotenv').config()

const accessPath = process.env.NODE_ENV === 'development'
  ? path.resolve('./src/server')
  : path.resolve('./dist')

const emailTransporter = require(path.join(accessPath, 'config/email'))
const eVars = require(path.join(accessPath, 'config/eVars'))

module.exports = (registrationRecord) => {
  let websiteUrl = `${eVars.protocol}://${eVars.DOMAIN}:${eVars.PORT}/${eVars.SYS_REF}`
  let apiUrl = `${eVars.HOST}/${eVars.SYS_REF}/api`
  emailTransporter.use('compile', hbs({
    viewEngin: {
      defaultLayout: 'main',
      extname: '.hbs',
      layoutsDir: path.join(accessPath, 'views/layouts'),
      partialsDir: path.join(accessPath, 'views/partials')
    },
    viewPath: path.join(accessPath, 'views'),
    extName: '.hbs'
  }))
  let emailOptions = {
    from: `"${eVars.ADMIN}" <${eVars.ADMIN_EMAIL}>`,
    replyTo: [eVars.ADMIN_EMAIL],
    to: registrationRecord.email,
    subject: 'Thank you message from Gentry Way',
    template: 'contactEmail',
    context: {
      name: registrationRecord.name,
      websiteUrl: websiteUrl,
      apiUrl: apiUrl,
      createdAt: registrationRecord.createdAt,
      comments: registrationRecord.comments,
      products: registrationRecord.products,
      issuedDate: (new Date()).toISOString().substring(0, 10)
    },
    attachments: [{
      path: path.join(__dirname, '../../client/assets/gentryLogoSmall.png')
    }, {
      path: path.join(__dirname, '../../client/assets/gentry_way_brouchure.pdf')
    }]
  }
  return emailTransporter.sendMail(emailOptions)
}
