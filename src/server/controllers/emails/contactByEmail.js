import hbs from 'nodemailer-express-handlebars'
import path from 'path'

import emailTransporter from '../../config/email'
import eVars from '../../config/environment'

module.exports = (registrationRecord) => {
  let websiteUrl = `${eVars.HOST}/${eVars.SYS_REF}`
  let apiUrl = `${eVars.HOST}/${eVars.SYS_REF}/api`
  emailTransporter.use('compile', hbs({
    viewEngin: {
      defaultLayout: 'main',
      extname: '.hbs',
      layoutsDir: path.join(__dirname, '../../views/layouts'),
      partialsDir: path.join(__dirname, '../../views/partials')
    },
    viewPath: path.join(__dirname, '../../views'),
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
