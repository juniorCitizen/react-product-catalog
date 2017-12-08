const multer = require('multer')
const Promise = require('bluebird')

const db = require('../../controllers/database')
const eVars = require('../../config/eVars')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = [
  multer().none(),
  validateJwt({ user: true }),
  // parsing request body data
  (req, res, next) => {
    req[eVars.SYS_REF].contactId = req.body.contactId.toUpperCase()
    req[eVars.SYS_REF].comments = req.body.comments.trim() || undefined
    req[eVars.SYS_REF].orderDetails = []
    JSON.parse(JSON.stringify(req.body.productIdList)).forEach((productId, index) => {
      req[eVars.SYS_REF].orderDetails.push({
        productId: productId.toUpperCase(),
        quantity: req.is('application/json')
          // Content-Type: application/json
          ? req.body.quantities[index]
          // Content-Type: multipart/form-data or x-www-form-urlencoded
          : parseInt(req.body.quantities[index])
      })
    })
    return next()
  },
  (req, res, next) => {
    return db.sequelize
      .transaction(trx => {
        return db.PurchaseOrders
          .create({ // insert blank purchase order
            contactId: req[eVars.SYS_REF].contactId,
            comments: req[eVars.SYS_REF].comments || undefined
          }, { transaction: trx })
          .then(purchaseOrder => Promise // insert products
            .all(req[eVars.SYS_REF].orderDetails.map(orderDetail => {
              return db.OrderDetails.create({
                purchaseOrderId: purchaseOrder.id,
                productId: orderDetail.productId,
                quantity: orderDetail.quantity
              }, { transaction: trx })
            }))
            .then(orderDetails => Promise.resolve(purchaseOrder.id))
          )
      })
      .then(purchaseOrderId => db.PurchaseOrders
        .findById(purchaseOrderId, {
          attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
          include: [{
            model: db.Contacts,
            attributes: { exclude: ['hashedPassword', 'salt', 'admin'] },
            include: [{ model: db.Companies }]
          }, {
            model: db.OrderDetails,
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
            include: [{ model: db.Products }]
          }]
        }))
      .then(data => {
        req.resJson = { data }
        next()
        return Promise.resolve()
      })
      .catch(error => next(error))
  }
]
