const jwt = require('jsonwebtoken')
const multer = require('multer')
const Promise = require('bluebird')
const uuidV4 = require('uuid/v4')

const db = require('../../controllers/database')
const encryption = require('../../controllers/encryption')
const eVars = require('../../config/eVars')

const validateJwt = require('../../middlewares/validateJwt')

const Op = db.sequelize.Op

module.exports = {
  // route handlers
  login: [ // POST /login
    multer().none(),
    validatePasswordFormat,
    accountDiscovery,
    rejectPasswordlessAccounts,
    checkPassword,
    provideToken,
    loginMessage
  ],
  create: [ // POST /contacts
    multer().none(),
    validatePasswordFormat,
    activateAdminPrivilegeCheck,
    parseCompanyData,
    parseContactData,
    parsePurchaseOrderData,
    createAccountAndPurchaseOrder,
    accountDiscovery,
    provideToken,
    accountCreationMessage
  ],
  readOne: [ // GET /contacts/:contactId
    validateJwt({ staff: true, user: true }),
    findTarget('params', true),
    verifyContactInfoAccessPrivilege,
    sendTargetData
  ],
  update: [ // PUT /contacts/:contactId
    multer().none(),
    validateJwt({ staff: true, user: true }),
    validatePasswordFormat,
    findTarget('params', true),
    verifyContactInfoAccessPrivilege,
    filterBodyData,
    updateTargetContact,
    findTarget('params', true),
    sendTargetData
  ],
  delete: [ // DELETE /contacts/:contactId
    validateJwt({ staff: true, user: true }),
    findTarget('params', true),
    verifyContactInfoAccessPrivilege,
    destroyTargetRecord
  ],
  search: [ // GET /contactSearch
    validateJwt({ staff: true }),
    textSearch
  ],
  // utilities
  getRecordCount,
  // common middlewares
  activateAdminPrivilegeCheck,
  autoFindTarget,
  findTarget,
  sendTargetData,
  // specialized middlewares
  accountDiscovery,
  checkPassword,
  rejectPasswordlessAccounts,
  validatePasswordFormat
}

// create res message when 'accountRegistration' end point is hit
function accountCreationMessage (req, res, next) {
  let registeredUser = req.registeredUser
  let status = registeredUser.admin ? 'admin' : registeredUser.company.host ? 'staff' : 'user'
  req.resJson.message = !registeredUser.hashedPassword
    ? `Contact record for '${registeredUser.email}' without login privilege is created`
    : `${status} account '${registeredUser.email}' registered successfully. Privilege is supplied for 24 hours`
  return next()
}

// find account credential information using req.body.emal
function accountDiscovery (req, res, next) {
  // find the account
  return db.Contacts
    .scope({ method: ['credentialsOnly'] })
    .findOne({ where: { email: req.body.email.toLowerCase() } })
    .then(contact => {
      if (!contact) { // account isn't found
        res.status(401)
        let error = new Error('Unauthorized')
        return next(error)
      }
      req.registeredUser = contact
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}

// triggers token validation if req.body.admin is true
function activateAdminPrivilegeCheck (req, res, next) {
  return (
    ('admin' in req.body && req.body.admin === 'true') ||
    !('password' in req.body)
  ) ? validateJwt({ admin: true })(req, res, next) : next()
}

// find target contact record indicated by the request route.param() with :contactId
function autoFindTarget (req, res, next, contactId) {
  let targetContactId = contactId.toUpperCase()
  return db.Contacts
    .findById(targetContactId)
    .then(targetContact => {
      req.targetContactId = targetContactId
      req.targetContact = targetContact
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}

// verify submitted password with stored credentials
function checkPassword (req, res, next) {
  let registeredUser = req.registeredUser
  // hashing the submitted password
  let hashedPasswordToCheck = encryption.sha512(req.body.password, registeredUser.salt).hashedPassword
  // compare with the hashing stored in the account record
  if (hashedPasswordToCheck === registeredUser.hashedPassword) {
    return next() // hash checks out
  } else {
    // hash verification failed
    res.status(403)
    let error = new Error('Forbidden')
    return next(error)
  }
}

// create purchase order and order details
function createAccountAndPurchaseOrder (req, res, next) {
  return db.sequelize.transaction(transaction => {
    let trxObj = { transaction }
    // find or insert company record (note how the company data is parsed)
    return db.Companies
      .findOrCreate({ where: req.companyData, transaction })
      .then(() => {
        // create contact record
        return db.Contacts
          .create(req.contactData, trxObj)
          .then(() => Promise.resolve())
          .catch(error => Promise.reject(error))
      })
      .then(() => {
        // create blank purchase order
        if (req.purchaseOrderData) {
          return db.PurchaseOrders
            .create(req.purchaseOrderData, trxObj)
            .then(() => {
              // insert products into purchase order in sequence
              return Promise
                .each(req.orderDetailData, orderDetail => {
                  return db.OrderDetails
                    .create(orderDetail, trxObj)
                    .then(() => Promise.resolve())
                    .catch(error => Promise.reject(error))
                }).catch(error => Promise.reject(error))
            }).catch(error => Promise.reject(error))
        } else { return Promise.resolve() }
      }).catch(error => Promise.reject(error))
  }).then(() => {
    next()
    return Promise.resolve()
  }).catch(error => next(error))
}

// destroy target contact
function destroyTargetRecord (req, res, next) {
  let targetContactId = req.targetContactId
  return req.targetContact
    .destroy()
    .then(() => {
      req.resJson = { message: `contact (id: ${targetContactId}) is deleted` }
      return next()
    })
    .catch(error => next(error))
}

// filter req.body and return an object containing only editable fields
function filterBodyData (req, res, next) {
  // return a list of editable fields for respective access privilege
  let editableList = req.userPrivilege === 3
    ? ['email', 'name', 'mobile', 'password', 'companyId', 'admin'] // admins
    : req.userPrivilege === 2
      ? ['email', 'name', 'mobile'] // staffs
      : ['email', 'name', 'mobile', 'password'] // users themselves
  let editableBodyProps = Object.keys(req.body).filter(bodyProp => {
    return editableList.indexOf(bodyProp) !== -1
  })
  let submittedContactData = {}
  editableBodyProps.forEach(prop => { submittedContactData[prop] = req.body[prop] })
  req.submittedContactData = submittedContactData
  return next()
}

// get the target purchase order
function findTarget (source = 'params', failIfNotExist = false, failIfUndeclared = false) {
  return (req, res, next) => {
    let targetContactId = null
    if (!('contactId' in req[source])) {
      if (failIfUndeclared) {
        res.status(400)
        let error = new Error(`Target contactId must be declared at req.${source}`)
        return next(error)
      }
      req.targetContactId = null
      req.targetContact = null
      return next()
    } else {
      targetContactId = req[source].contactId.toUpperCase()
      return db.Contacts
        .scope({ method: ['detailed'] })
        .findById(targetContactId)
        .then(targetContact => {
          if (!targetContact && failIfNotExist) {
            res.status(400)
            let error = new Error(`Target contact (id: ${targetContactId}) does not exist`)
            return Promise.reject(error)
          }
          req.targetContactId = targetContact ? targetContactId : null
          req.targetContact = targetContact || null
          next()
          return Promise.resolve()
        })
        .catch(error => next(error))
    }
  }
}

function getRecordCount (includeDeleted = false) {
  return includeDeleted
    ? db.Contacts.findAndCountAll({ paranoid: false })
    : db.Contacts.findAndCountAll()
      .then(result => Promise.resolve(result.count))
      .catch(error => Promise.reject(error))
}

// create res message when '\login' end point is hit
function loginMessage (req, res, next) {
  let status = req.registeredUser.admin ? 'admin' : req.registeredUser.company.host ? 'staff' : 'user'
  req.resJson.message = `account token with ${status} privilege is supplied for 24 hours`
  return next()
}

// parsing company data
function parseCompanyData (req, res, next) {
  let requestBody = req.body
  if ('companyId' in requestBody) {
    // use the detected company id instead
    req.companyData = { id: requestBody.companyId.toUpperCase() }
  } else {
    req.companyData = {
      id: uuidV4().toUpperCase(),
      countryId: requestBody.countryId || undefined,
      // user name is filled in if client app does not submit a company title
      title: requestBody.title || requestBody.name,
      address: requestBody.address || undefined,
      telephone: requestBody.telephone || undefined,
      fax: requestBody.fax || undefined,
      website: requestBody.website || undefined,
      host: false // req.body.host value is ignored
    }
    for (let key in req.companyData) {
      if (req.companyData[key] === undefined) delete req.companyData[key]
    }
  }
  return next()
}

// parsing contact data
function parseContactData (req, res, next) {
  let requestBody = req.body
  let encryptedPassword = 'password' in requestBody
    ? encryption.sha512(requestBody.password, encryption.saltGen(16))
    : { hashedPassword: null, salt: null }
  req.contactData = {
    id: uuidV4().toUpperCase(),
    email: requestBody.email.toLowerCase(),
    name: requestBody.name,
    mobile: requestBody.mobile || undefined,
    hashedPassword: encryptedPassword.hashedPassword,
    salt: encryptedPassword.salt,
    admin: req.body.admin || undefined,
    companyId: req.companyData.id
  }
  for (let key in req.contactData) {
    if (req.contactData[key] === undefined) delete req.contactData[key]
  }
  return next()
}

// parsing purchase order data
function parsePurchaseOrderData (req, res, next) {
  // skipped if no product inquiry is found
  if (!req.body.productIdList) return next()
  // product inquiry (purchase order) creation
  let productIdList = JSON.parse(JSON.stringify(req.body.productIdList))
  // check if products inquries are being submitted
  if (productIdList.length > 0) {
    // reject the submission is password is not set
    if (!req.contactData.hashedPassword === null) {
      res.status(400)
      let error = new Error('Inquiries cannot be submitted by creating a passwordless account')
      return next(error)
    } else {
      // prep purchase order record data
      req.purchaseOrderData = {
        id: uuidV4().toUpperCase(),
        contactId: req.contactData.id,
        comments: req.body.comments || null,
        contacted: false,
        notified: false
      }
      // prep order details data
      req.orderDetailData = []
      productIdList.forEach((productId, index) => {
        req.orderDetailData.push({
          purchaseOrderId: req.purchaseOrderData.id,
          productId,
          quantity: !req.is('application/json')
            ? parseInt(req.body.quantities[index]) || null
            : req.body.quantities[index] || null
        })
      })
      return next()
    }
  } else {
    // skips if no product inquiry found
    return next()
  }
}

// supply a self-signed token to authorized account user
function provideToken (req, res, next) {
  let registeredUser = req.registeredUser
  let token = registeredUser.hashedPassword
    ? jwt.sign({
      id: registeredUser.id,
      name: registeredUser.name,
      email: registeredUser.email,
      admin: registeredUser.admin
    }, eVars.PASS_PHRASE, { expiresIn: '24h' })
    : undefined
  req.resJson = { data: token }
  return next()
}

// reject login attempt by contacts that did not setup password
function rejectPasswordlessAccounts (req, res, next) {
  let registeredUser = req.registeredUser
  if (!registeredUser.hashedPassword || !registeredUser.salt) {
    res.status(403)
    let error = new Error('This account does not have login privileges')
    return next(error)
  }
  return next()
}

// send contact data in the server response 'data' property
function sendTargetData (req, res, next) {
  req.resJson = { data: req.targetContact }
  return next()
}

function textSearch (req, res, next) {
  let wildCard = `%${req.query.wildCard}%`
  let queryString = `SELECT DISTINCT a.id FROM companies AS a LEFT JOIN contacts AS b ON a.id=b.companyId WHERE a.title LIKE :wildCard OR b.name LIKE :wildCard;`
  return db.sequelize
    .query(queryString, { replacements: { wildCard } })
    .spread((results, metadata) => Promise.resolve(results))
    .map(result => result.id)
    .then(companyIdList => {
      let searchOptions = {
        where: { id: { [Op.in]: companyIdList } }
      }
      return db.Companies
        .scope({ method: ['detailed'] })
        .findAll(searchOptions)
        .catch(error => Promise.reject(error))
    })
    .then(data => {
      req.resJson = { data }
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}

// update contact record
function updateTargetContact (req, res, next) {
  let targetContact = req.targetContact
  let submittedContactData = req.submittedContactData
  return targetContact
    .update(submittedContactData)
    .then(() => next())
    .catch(error => next(error))
}

// validate password format
function validatePasswordFormat (req, res, next) {
  // let request proceed without a 'password' prop in the req body
  // used when registering an user without password.
  // If password is required in the following route handlers, this will cause failure
  if (!('password' in req.body)) {
    return next()
  } else if ((req.body.password.length < 8) || (req.body.password.length > 20)) {
    res.status(400)
    let error = new Error('Illegal password length')
    error.message = 'Password should be 8 to 20 characters long'
    return next(error)
  }
  return next()
}

// check if user has proper privilege to access the target contact information
function verifyContactInfoAccessPrivilege (req, res, next) {
  let targetContact = req.targetContact
  let isAdminOrStaff = req.userPrivilege >= 2
  let userIsContact = req.registeredUser.id === targetContact.id
  if (isAdminOrStaff || userIsContact) {
    return next()
  } else {
    res.status(403)
    let error = new Error('Regular users does not have full access')
    return next(error)
  }
}
