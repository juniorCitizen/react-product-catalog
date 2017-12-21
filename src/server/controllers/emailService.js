// how to use nodemailer with gmail
// https://www.youtube.com/watch?v=JJ44WA_eV8E
// nodemailer with template emails
// https://www.youtube.com/watch?v=9zPZ9yJML6E

const cron = require('node-cron')
const hbs = require('nodemailer-express-handlebars')
const path = require('path')

const emailTransporter = require('../config/email')
const eVars = require('../config/eVars')

const db = require('./database')
const logging = require('./logging')

// how often to trigger email sendig actions
// const BROADCAST_FREQUENCY = '0 * * * * *' // every 1 minute
// const BROADCAST_FREQUENCY = '*/30 * * * * *' // every 30 seconds
// const BROADCAST_FREQUENCY = '*/15 * * * * *' // every 15 seconds
// const BROADCAST_FREQUENCY = '*/10 * * * * *' // every 10 seconds
const BROADCAST_FREQUENCY = '*/5 * * * * *' // every 5 seconds
// const BROADCAST_FREQUENCY = '* * * * * *' // every second

// how often to trigger finding email actions
// const CHECK_FREQUENCY = '0 * * * * *' // every 1 minute
const CHECK_FREQUENCY = '*/30 * * * * *' // every 30 seconds
// const CHECK_FREQUENCY = '*/15 * * * * *' // every 15 seconds
// const CHECK_FREQUENCY = '*/10 * * * * *' // every 10 seconds
// const CHECK_FREQUENCY = '*/5 * * * * *' // every 5 seconds
// const CHECK_FREQUENCY = '* * * * * *' // every second

emailTransporter.use('compile', hbs({
  viewEngin: {
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, '../../server/views/layouts'),
    partialsDir: path.join(__dirname, '../../server/views/partials')
  },
  viewPath: path.join(__dirname, '../../server/views'),
  extName: '.hbs'
}))

let emailQueue = []

let broadcasting = cron.schedule(BROADCAST_FREQUENCY, broadcastByEmail, false)
let checking = cron.schedule(CHECK_FREQUENCY, checkPendingPurchaseOrders, false)

module.exports = {
  initialize: () => {
    checkPendingPurchaseOrders()
    checking.start()
    broadcasting.start()
    return Promise.resolve('訂單通知服務已啟動')
  }
}

function broadcastByEmail () {
  logging.warning('sending email...')
  if (emailQueue.length === 0) return Promise.resolve()
  return emailQueue[0]
    .sendAction
    .then(response => {
      let markComplete = Promise.resolve()
      // let markComplete = emailQueue[0].type === 'notified'
      //   ? db.PurchaseOrders.update({ notified: true }, { where: { id: emailQueue[0].purchaseOrderId } })
      //   : db.PurchaseOrders.update({ contacted: true }, { where: { id: emailQueue[0].purchaseOrderId } })
      return markComplete
        .then(() => {
          emailQueue.shift()
          logging.warning(response)
          logging.warning(`${emailQueue.length} email(s) left to process`)
          return Promise.resolve()
        })
        .catch(error => Promise.reject(error))
    })
    .catch(error => {
      logging.error(error)
      return Promise.reject(error)
    })
}

function checkPendingPurchaseOrders () {
  logging.warning('checking emails')
  // look for pending orders ('contacted' or 'notified' is false)
  return db.PurchaseOrders
    .scope({ method: ['pending'] })
    .findAll({ where: { id: { [db.Sequelize.Op.notIn]: getPurchaseOrderIdLists() } } })
    .then(pendingPurchaseOrders => {
      // go through each pending order
      pendingPurchaseOrders.forEach(purchaseOrder => {
        if (!purchaseOrder.notified) {
          // generate staff notification if not notified
          emailQueue.push({
            type: 'notified',
            purchaseOrderId: purchaseOrder.id,
            sendAction: createNotificationEmail(purchaseOrder)
          })
        }
        if (!purchaseOrder.contacted) {
          // generate customer notification if not contacted
          emailQueue.push({
            type: 'contacted',
            purchaseOrderId: purchaseOrder.id,
            sendAction: createContactEmail(purchaseOrder)
          })
        }
      })
      return Promise.resolve()
    })
    .then(() => {
      logging.warning(`${emailQueue.length} email(s) left to process`)
      return Promise.resolve()
    })
    .catch(logging.reject)
}

function getPurchaseOrderIdLists () {
  return emailQueue.map(queuedItem => {
    return queuedItem.purchaseOrderId
  })
}

function createContactEmail (purchaseOrder) {
  let emailOptions = {
    from: `"${eVars.ADMIN}" <${eVars.ADMIN_EMAIL}>`,
    replyTo: eVars.ADMIN_EMAIL,
    to: [eVars.devMode ? eVars.ADMIN_EMAIL : purchaseOrder.contact.email],
    subject: `有關 ${eVars.SYS_REF} 訂單編號: ${purchaseOrder.id}`,
    text: JSON.stringify(purchaseOrder), // temporary
    // template: 'contactEmail',
    // context: {
    //   name: purchaseOrder.contact.name,
    //   websiteUrl: `${eVars.HOST}/${eVars.SYS_REF}`,
    //   apiUrl: `${eVars.HOST}/${eVars.SYS_REF}/api`,
    //   createdAt: purchaseOrder.createdAt,
    //   comments: purchaseOrder.comments,
    //   products: purchaseOrder.products,
    //   issuedDate: (new Date()).toISOString().substring(0, 10)
    // },
    attachments: [{
      path: eVars.devMode
        ? path.join(__dirname, '../../client/assets/images/logos/gentryLogoSmall.png')
        : path.resolve('./dist/public/gentryLogoSmall.png')
    }, {
      path: eVars.devMode
        ? path.join(__dirname, '../../client/assets/brouchure/brouchure.pdf')
        : path.resolve('./dist/public/brouchure.pdf')
    }]
  }
  return emailTransporter.sendMail(emailOptions)
}

function createNotificationEmail (purchaseOrder) {
  let emailOptions = {
    from: `"${eVars.ADMIN}" <${eVars.ADMIN_EMAIL}>`,
    to: [eVars.ADMIN_EMAIL],
    subject: `${eVars.SYS_REF} 網頁下單通知 - 訂單編號: ${purchaseOrder.id}`,
    template: 'staffNotification',
    context: {
      createdAt: purchaseOrder.createdAt,
      id: purchaseOrder.id,
      company: purchaseOrder.contact.company.title,
      name: purchaseOrder.contact.name,
      email: purchaseOrder.contact.email,
      country: purchaseOrder.contact.company.country.name,
      comments: purchaseOrder.comments,
      products: purchaseOrder.products
    }
  }
  return emailTransporter.sendMail(emailOptions)
}
