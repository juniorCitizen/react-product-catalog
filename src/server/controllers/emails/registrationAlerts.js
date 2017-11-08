const hbs = require('nodemailer-express-handlebars')
const path = require('path')

require('dotenv').config()

const accessPath = process.env.NODE_ENV === 'development'
  ? path.resolve('./src/server')
  : path.resolve('./dist')

const emailTransporter = require(path.join(accessPath, 'config/email'))
const eVars = require(path.join(accessPath, 'config/eVars'))

module.exports = (registrationRecord) => {
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
    to: [eVars.ADMIN_EMAIL],
    subject: '客戶網頁註冊通知',
    template: 'emailNotification',
    context: {
      createdAt: registrationRecord.createdAt,
      id: registrationRecord.id,
      company: registrationRecord.company,
      name: registrationRecord.name,
      email: registrationRecord.email,
      country: registrationRecord.country,
      comments: registrationRecord.comments,
      products: registrationRecord.products
    }
  }
  return emailTransporter.sendMail(emailOptions)
}
