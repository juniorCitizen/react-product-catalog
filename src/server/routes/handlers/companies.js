const db = require('../../controllers/database')
const multer = require('multer')

const pagination = require('../../middlewares/pagination')
const validateJwt = require('../../middlewares/validateJwt')

module.exports = {
  readAll: [ // GET /companies
    validateJwt({ staff: true }),
    pagination(getRecordCount),
    getRecords
  ],
  readOne: [ // GET /companies/:companyId
    validateJwt({ staff: true, user: true }),
    getRecordById
  ],
  readHosts: [ // GET /hostingCompanies
    getHostingCompanies
  ],
  insert: [ // POST /companies
    multer().none(),
    validateJwt({ admin: true }),
    insertRecord,
    findTarget('created', true),
    sendTargetCompanyData
  ],
  delete: [ // DELETE /companies/:companyId
    validateJwt({ admin: true }),
    deleteRecord
  ],
  update: [ // PUT /companies/:companyId
    multer().none(),
    validateJwt({ staff: true, user: true }),
    filterBodyData,
    updateRecord,
    findTarget('params', true),
    sendTargetCompanyData
  ],
  // utilities
  getRecordCount,
  // common middlewares
  autoFindTarget,
  findTarget
  // specialized middlewares
}

// route handler DELETE /companies/:companyId
function deleteRecord (req, res, next) {
  let targetCompanyId = req.targetCompanyId
  return db.Companies
    .scope({ method: ['withContactDetails'] })
    .findById(targetCompanyId)
    .then(targetCompany => {
      if (targetCompany.contacts.length > 0) {
        res.status(400)
        let error = new Error('Cannot delete company record while existing contacts are still associated')
        return Promise.reject(error)
      } else {
        let message = `record of ${targetCompany.title} (id: ${targetCompanyId}) deleted...`
        return db.Companies
          .destroy({ where: { id: targetCompanyId } })
          .then(data => {
            req.resJson = { data, message }
            return Promise.resolve()
          })
          .catch(error => Promise.reject(error))
      }
    })
    .then(() => {
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}

// find target company record indicated by the request route.param() with :companyId
function autoFindTarget (req, res, next, companyId) {
  let targetCompanyId = companyId.toUpperCase()
  return db.Companies
    .findById(targetCompanyId)
    .then(targetCompany => {
      req.targetCompanyId = targetCompanyId
      req.targetCompany = targetCompany
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}

// filter req.body and return an object containing only editable fields
function filterBodyData (req, res, next) {
  // return a list of editable fields for respective access privilege
  let editableList = req.userPrivilege === 3
    ? ['title', 'address', 'telephone', 'fax', 'website', 'host', 'countryId'] // admins
    : req.userPrivilege === 2
      ? ['title', 'address', 'telephone', 'fax', 'website', 'countryId'] // staffs
      : ['title', 'address', 'telephone', 'fax', 'website', 'countryId'] // users themselves
  let editableBodyProps = Object.keys(req.body).filter(bodyProp => {
    return editableList.indexOf(bodyProp) !== -1
  })
  let submittedCompanyData = {}
  editableBodyProps.forEach(prop => { submittedCompanyData[prop] = req.body[prop] })
  req.submittedCompanyData = submittedCompanyData
  return next()
}

// get the target company record
function findTarget (source = 'params', failIfNotExist = false, failIfUndeclared = false) {
  return (req, res, next) => {
    let targetCompanyId = null
    if (!('companyId' in req[source])) {
      if (failIfUndeclared) {
        res.status(400)
        let error = new Error(`Target companyId must be declared at req.${source}`)
        return next(error)
      }
      req.targetCompanyId = null
      req.targetCompany = null
      return next()
    } else {
      targetCompanyId = req[source].companyId.toUpperCase()
      return db.Companies
        .scope({ method: ['detailed'] })
        .findById(targetCompanyId)
        .then(targetCompany => {
          if (!targetCompany && failIfNotExist) {
            res.status(400)
            let error = new Error(`Target company (id: ${targetCompanyId}) does not exist`)
            return Promise.reject(error)
          }
          req.targetCompanyId = targetCompany ? targetCompany.id : null
          req.targetCompany = targetCompany || null
          next()
          return Promise.resolve()
        })
        .catch(error => next(error))
    }
  }
}

// route handler GET /hostingCompanies
function getHostingCompanies (req, res, next) {
  return db.Companies
    .scope({ method: ['detailed'] })
    .findAll({ where: { host: true } })
    .then(data => {
      req.resJson = { data }
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}

// route handler GET /companies/:companyId
function getRecordById (req, res, next) {
  let targetCompany = req.targetCompany
  let isAdminOrStaff = req.userPrivilege >= 2
  let userIsCompanyContact = req.registeredUser.company
    ? req.registeredUser.company.id === targetCompany.id
    : false
  if (isAdminOrStaff || userIsCompanyContact) {
    req.resJson = { data: targetCompany }
    return next()
  } else {
    res.status(403)
    let error = new Error('Regular users does not have full access')
    return Promise.reject(error)
  }
}

// get record count of full records
function getRecordCount () {
  return db.Companies.findAndCountAll()
    .then(results => Promise.resolve(results.count))
    .catch(error => Promise.reject(error))
}

// get company dataset
function getRecords (req, res, next) {
  return db.Companies
    .scope({ method: ['detailed'] })
    .findAll(req.queryOptions)
    .then(data => {
      req.resJson = { data }
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}

// insert company record
function insertRecord (req, res, next) {
  return db.Companies.create({
    countryId: req.body.countryId || undefined,
    title: req.body.title,
    address: req.body.address || undefined,
    telephone: req.body.telephone || undefined,
    fax: req.body.fax || undefined,
    website: req.body.website || undefined,
    host: !req.is('application/json')
      ? req.body.host === 'true'
      : req.body.host
  }).then(newCompany => {
    req.created = Object.assign({ companyId: newCompany.id }, newCompany)
    next()
    return Promise.resolve()
  }).catch(error => next(error))
}

// send target company data in the server response 'data' property
function sendTargetCompanyData (req, res, next) {
  req.resJson = { data: req.targetCompany }
  return next()
}

// update company record
function updateRecord (req, res, next) {
  let targetCompany = req.targetCompany
  let submittedCompanyData = req.submittedCompanyData
  return targetCompany
    .update(submittedCompanyData)
    .then(() => {
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}
