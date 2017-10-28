import hbs from 'nodemailer-express-handlebars'
import path from 'path'

import emailTransporter from '../../config/email'
import eVars from '../../config/environment'

module.exports = (registrationRecord) => {
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
