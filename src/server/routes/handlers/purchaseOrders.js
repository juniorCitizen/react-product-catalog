const multer = require('multer')
const Promise = require('bluebird')

const db = require('../../controllers/database')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = {
  readOne: [ // GET /purchaseOrders/:purcahseOrderId
    validateJwt({ user: true }),
    rejectInvalidTarget,
    rejectNonPropriators,
    sendTargetData
  ],
  create: [ // POST /contacts/:contactId/purchaseOrders
    multer().none(),
    validateJwt({ user: true }),
    parseProductRequestData,
    insertRecord,
    findTarget('created', true),
    sendTargetData
  ],
  // utilities
  getRecordCount, // get the record count
  // common middlewares
  autoFindTarget, // find target purchase order specified by :purchaseOrderId
  findTarget, // find the target purchase order
  rejectInvalidTarget, // reject :purchaseOrderId request that does not yeild valid instance
  sendTargetData, // include req.TargetPurchaseOrder in response to client
  // specialized middlewares
  insertRecord, // create a new purchase order and insert product requests
  parseProductRequestData, // parse product request data from req.body
  rejectNonPropriators // reject users from accessing PO's that are not issued by the users' company
}

function autoFindTarget (req, res, next, purchaseOrderId) {
  let targetPurchaseOrderId = purchaseOrderId.toUpperCase()
  return db.PurchaseOrders
    .scope({ method: ['detailed'] })
    .findById(purchaseOrderId)
    .then(targetPurchaseOrder => {
      req.targetPurchaseOrderId = targetPurchaseOrderId
      req.targetPurchaseOrder = targetPurchaseOrder
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}

function findTarget (source = 'params', failIfNotExist = false, failIfUndeclared = false) {
  return (req, res, next) => {
    let targetPurchaseOrderId = null
    if (!('purchaseOrderId' in req[source])) {
      if (failIfUndeclared) {
        res.status(400)
        let error = new Error(`Target purchaseOrderId must be declared at req.${source}`)
        return next(error)
      }
      req.targetPurchaseOrderId = null
      req.targetPurchaseOrder = null
      return next()
    } else {
      targetPurchaseOrderId = req[source].purchaseOrderId.toUpperCase()
      return db.PurchaseOrders
        .scope({ method: ['detailed'] })
        .findById(targetPurchaseOrderId)
        .then(targetPurchaseOrder => {
          if (!targetPurchaseOrder && failIfNotExist) {
            res.status(400)
            let error = new Error(`Target purchaseOrder (id: ${targetPurchaseOrderId}) does not exist`)
            return Promise.reject(error)
          }
          req.targetPurchaseOrderId = targetPurchaseOrder ? targetPurchaseOrder.id : null
          req.targetPurchaseOrder = targetPurchaseOrder || null
          next()
          return Promise.resolve()
        })
        .catch(error => next(error))
    }
  }
}

function getRecordCount (includeDeleted = false) {
  return includeDeleted
    ? db.PurchaseOrders.findAndCountAll({ paranoid: false })
    : db.PurchaseOrders.findAndCountAll()
      .then(result => Promise.resolve(result.count))
      .catch(error => Promise.reject(error))
}

function insertRecord (req, res, next) {
  return db.sequelize.transaction(transaction => {
    // insert blank purchase order
    return db.PurchaseOrders.create({
      contactId: req.registeredUser.id,
      comments: req.body.comments || null
    }, { transaction })
      .then(purchaseOrder => {
        // insert products concurrently
        return Promise
          .all(req.orderDetails.map(orderDetail => {
            return db.OrderDetails
              .create({
                purchaseOrderId: purchaseOrder.id,
                productId: orderDetail.productId,
                quantity: orderDetail.quantity
              }, { transaction })
              .catch(error => next(error))
          }))
          .then(() => {
            req.created = { purchaseOrderId: purchaseOrder.id }
            return Promise.resolve()
          })
          .catch(error => next(error))
      })
      .catch(error => next(error))
  }).then(() => {
    next()
    return Promise.resolve()
  }).catch(error => next(error))
}

function rejectInvalidTarget (req, res, next) {
  if (!req.targetPurchaseOrder) {
    res.status(400)
    let error = new Error(`Target purchaseOrder (id: ${req.params.tagId.toUpperCase()}) does not exist`)
    return next(error)
  }
}

function rejectNonPropriators (req, res, next) {
  let orderPropriator = req.targetPurchaseOrder.contact.company
  if (req.userPrivilege >= 2) return next()
  else if (orderPropriator.hasContacts(req.registeredUser)) {
    return next()
  } else {
    let error = new Error('Regular users does not have access privilege')
    return next(error)
  }
}

function parseProductRequestData (req, res, next) {
  let parsedList = JSON.parse(JSON.stringify(req.body.productIdList))
  if (parsedList.length === 0) {
    res.status(400)
    let error = new Error('No product request information found')
    return next(error)
  }
  req.orderDetails = []
  parsedList.forEach((productId, index) => {
    req.orderDetails.push({
      productId: productId.toUpperCase(),
      quantity: !req.is('application/json')
        ? parseInt(req.body.quantities[index])
        : req.body.quantities[index]
    })
  })
  return next()
}

function sendTargetData (req, res, next) {
  req.resJson = { data: req.targetPurchaseOrder }
  return next()
}
