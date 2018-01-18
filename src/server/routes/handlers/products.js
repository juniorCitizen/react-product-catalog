const multer = require('multer')
const Promise = require('bluebird')

const db = require('../../controllers/database')

const pagination = require('../../middlewares/pagination')
const validateJwt = require('../../middlewares/validateJwt')

const series = require('./series')
const tags = require('./tags')

const Op = db.Sequelize.Op

module.exports = {
  delete: [ // DELETE /products/:productId
    validateJwt({ staff: true }),
    findTarget('params', true),
    disassociateAndDelete
  ],
  create: [ // POST /products
    multer().none(),
    validateJwt({ staff: true }),
    series.findTarget('body', true, false),
    insertRecord,
    findTarget('created', true),
    sendTargetData
  ],
  patch: [ // PATCH /products/:productId
    validateJwt({ staff: true }),
    series.findTarget('query', false, false),
    tags.findTarget('query', false, false),
    determineProxyTarget,
    findTarget('params', true),
    sendTargetData
  ],
  readAll: [ // GET /products
    pagination(getRecordCount),
    getRecords
  ],
  readOne: [ // GET /products/:productId
    findTarget('params', true),
    sendTargetData
  ],
  search: [ // GET /productSearch
    textSearch
  ],
  update: [ // PUT /products/:productId
    multer().none(),
    validateJwt({ staff: true }),
    updateRecord,
    findTarget('params', true),
    sendTargetData
  ],
  // utilities
  getRecordCount,
  // common middlewares
  autoFindTarget,
  findTarget,
  rejectInvalidTargetProduct,
  sendTargetData
  // specialized middlewares
}

// reject request if target product does not exist
function rejectInvalidTargetProduct (req, res, next) {
  if (!req.targetProduct) {
    let error = new Error('Target product must be valid')
    error.status = 400
    return next(error)
  }
  return next()
}

// find target product record indicated by the request route.param() with :productId
function autoFindTarget (req, res, next, productId) {
  let targetProductId = productId.toUpperCase()
  return db.Products
    .scope({ method: ['detailed'] })
    .findById(targetProductId)
    .then(targetProduct => {
      req.targetProductId = targetProductId
      req.targetProduct = targetProduct
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}

// patch route proxy function
function determineProxyTarget (req, res, next) {
  let urlQuery = Object.keys(req.query)[0]
  let error = new Error(`unidentified url query element: '${urlQuery}'`)
  switch (urlQuery) {
    case 'seriesId':
      return setSeriesAssociation(req, res, next)
    case 'tagId':
      return toggleTagAssociation(req, res, next)
    default:
      res.status(400)
      return next(error)
  }
}

// disassociate from tags, photos and series, then soft delete product record
function disassociateAndDelete (req, res, next) {
  return db.sequelize.transaction(transaction => {
    // disassociate target product with all tags
    return req.targetProduct
      .setTags([], { transaction })
      // unassociate target product with all photos
      .then(() => req.targetProduct
        .setPhotos([], { transaction })
        .catch(error => Promise.reject(error)))
      // unassociate target product with associated series
      .then(() => req.targetProduct.series
        .removeProduct(req.targetProduct, { transaction })
        .catch(error => Promise.reject(error)))
      // remove product (soft delete)
      .then(() => db.Products
        .destroy({ where: { id: req.targetProductId }, transaction })
        .catch(error => Promise.reject(error)))
      .catch(error => Promise.reject(error))
  }).then(data => {
    req.resJson = {
      data,
      message: data === 1 ? `product (id: ${req.targetProductId}) deleted` : undefined
    }
    next()
    return Promise.resolve()
  }).catch(error => next(error))
}

function getRecordCount (includeDeleted = false) {
  return includeDeleted
    ? db.Products.findAndCountAll({ paranoid: false })
    : db.Products.findAndCountAll()
      .then(result => Promise.resolve(result.count))
      .catch(error => Promise.reject(error))
}

// route handler GET /products
function getRecords (req, res, next) {
  let query = 'details' in req.query
    ? db.Products.scope({ method: ['detailed'] }).findAll(req.queryOptions)
    : db.Products.findAll(req.queryOptions)
  return query.then(data => {
    req.resJson = { data }
    next()
    return Promise.resolve()
  }).catch(error => next(error))
}

// get the target product
function findTarget (source = 'params', failIfNotExist = false, failIfUndeclared = false) {
  return (req, res, next) => {
    let targetProductId = null
    if (!('productId' in req[source])) {
      if (failIfUndeclared) {
        res.status(400)
        let error = new Error(`Target productId must be declared at req.${source}`)
        return next(error)
      }
      req.targetProductId = null
      req.targetProduct = null
      return next()
    } else {
      targetProductId = req[source].productId.toUpperCase()
      return db.Products
        .scope({ method: ['detailed'] })
        .findById(targetProductId)
        .then(targetProduct => {
          if (!targetProduct && failIfNotExist) {
            res.status(400)
            let error = new Error(`Target product (id: ${targetProductId}) does not exist`)
            return Promise.reject(error)
          }
          req.targetProductId = targetProduct ? targetProductId : null
          req.targetProduct = targetProduct || null
          next()
          return Promise.resolve()
        })
        .catch(error => next(error))
    }
  }
}

// insert new record
function insertRecord (req, res, next) {
  let productData = {}
  let validFields = ['code', 'name', 'specification', 'description', 'seriesId']
  validFields.forEach(fieldName => {
    if (req.body[fieldName]) productData[fieldName] = req.body[fieldName]
  })
  return db.Products
    .create(productData)
    .then(newProduct => {
      req.created = Object.assign({ productId: newProduct.id }, newProduct)
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}

// send target contact data in the server response 'data' property
function sendTargetData (req, res, next) {
  req.resJson = { data: req.targetProduct }
  return next()
}

// set series association (patching seriesId)
function setSeriesAssociation (req, res, next) {
  let targetSeriesId = req.targetSeriesId
  let targetProduct = req.targetProduct
  return targetProduct
    .update({ seriesId: targetSeriesId })
    .then(() => {
      next()
      return Promise.resolve()
    }).catch(error => next(error))
}

// fuzzy search on product related data tables and columns
function textSearch (req, res, next) {
  let wildCard = `%${req.query.wildCard}%`
  let queryString = `SELECT DISTINCT a.id FROM products AS a LEFT JOIN series AS b ON a.seriesId=b.id LEFT JOIN labels AS c ON a.id=c.productId LEFT JOIN tags AS d ON c.tagId=d.id WHERE a.code LIKE :wildCard OR a.name LIKE :wildCard OR a.specification LIKE :wildCard OR a.description LIKE :wildCard OR b.name LIKE :wildCard OR d.name LIKE :wildCard;`
  return db.sequelize
    .query(queryString, { replacements: { wildCard } })
    .spread((results, metadata) => Promise.resolve(results))
    .map(result => result.id)
    .then(productIdList => {
      let productSearchOptions = {
        where: { id: { [Op.in]: productIdList } }
      }
      return db.Products
        .scope({ method: ['detailed'] })
        .findAll(productSearchOptions)
        .catch(error => Promise.reject(error))
    })
    .then(data => {
      req.resJson = { data }
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}

// toggle product/tag association
function toggleTagAssociation (req, res, next) {
  return req.targetProduct
    .hasTag(req.targetTag)
    .then(result => {
      return result
        ? req.targetProduct.removeTag(req.targetTag)
        : req.targetProduct.addTag(req.targetTag)
    })
    .then(() => {
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}

// update product record
function updateRecord (req, res, next) {
  let productData = {}
  let validFields = ['code', 'name', 'specification', 'description']
  validFields.forEach(fieldName => {
    if (req.body[fieldName]) productData[fieldName] = req.body[fieldName]
  })
  return req.targetProduct
    .update(productData)
    .then(() => {
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}
