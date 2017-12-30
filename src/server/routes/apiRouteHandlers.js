const express = require('express')

const eVars = require('../config/eVars')

const logging = require('../controllers/logging')

// const notImplemented = require('../middlewares/notImplemented')
const responseHandlers = require('../middlewares/responseHandlers')

const API_ROUTER = express.Router()

const carousels = require('./handlers/carousels')
const companies = require('./handlers/companies')
const contacts = require('./handlers/contacts')
const countries = require('./handlers/countries')
const photos = require('./handlers/photos')
const products = require('./handlers/products')
const purchaseOrders = require('./handlers/purchaseOrders')
const series = require('./handlers/series')
const tags = require('./handlers/tags')

// /////////////////////////////////////////////////////
// Carousels
// /////////////////////////////////////////////////////
API_ROUTER.param('carouselId', carousels.autoFindTarget)
API_ROUTER.route('/carousels')
  .get(...carousels.read) // get carousel records
  .post(...carousels.insert) // insert a carousel image
API_ROUTER.route('/carousels/:carouselId')
  .patch(...carousels.patch) // update displaySequence of carousels
  .delete(...carousels.delete) // remove a carousel image by id

// /////////////////////////////////////////////////////
// Companies
// /////////////////////////////////////////////////////
API_ROUTER.param('companyId', companies.autoFindTarget)
API_ROUTER.route('/hostingCompanies')
  .get(...companies.readHosts) // get hosting company's information
API_ROUTER.route('/companies')
  .get(...companies.readAll) // get company dataset
  .post(...companies.insert) // insert a company
API_ROUTER.route('/companies/:companyId')
  .get(...companies.readOne) // get company by id
  .put(...companies.update) // update company information
  .delete(...companies.delete) // delete a company
API_ROUTER.route('/companies/:companyId/purchaseOrders')

// /////////////////////////////////////////////////////
// Contacts
// /////////////////////////////////////////////////////
API_ROUTER.param('contactId', contacts.autoFindTarget)
API_ROUTER.route('/login')
  .post(...contacts.login) // login by requesting a jwt with user credentials
API_ROUTER.route('/contacts')
  .post(contacts.create) // register a contact (optional company/order info creation or association)
API_ROUTER.route('/contacts/:contactId')
  .get(...contacts.readOne) // get contact by id
  .put(...contacts.update) // update a contact
  .delete(...contacts.delete) // delete contact by id
API_ROUTER.route('/contacts/:contact/purchaseOrders')
  .post(...purchaseOrders.create) // insert new purchase order
API_ROUTER.route('/contactSearch')
  .get(...contacts.search) // search contact

// /////////////////////////////////////////////////////
// Countries
// /////////////////////////////////////////////////////
API_ROUTER.param('countryId', countries.autoFindTarget)
API_ROUTER.route('/countries')
  .get(...countries.readAll) // get countries
API_ROUTER.route('/countries/:countryId')
  .get(...countries.readOne) // get flag
API_ROUTER.route('/regions')
  .get(...countries.readRegions) // get world regions

// /////////////////////////////////////////////////////
// Photos
// /////////////////////////////////////////////////////
API_ROUTER.param('photoId', photos.autoFindTarget)
API_ROUTER.route('/photos')
  .post(...photos.upload) // batch photo uploads
API_ROUTER.route('/photos/:photoId')
  .get(...photos.readOne) // get photo image by id
  .patch(...photos.patch) // patching record fields (primary, seriesId, productId)
  .delete(...photos.delete) // remove photo by id

// /////////////////////////////////////////////////////
// Products
// /////////////////////////////////////////////////////
API_ROUTER.param('productId', products.autoFindTarget)
API_ROUTER.route('/productSearch')
  .get(...products.search) // seach product listing
API_ROUTER.route('/products')
  .get(...products.readAll) // get product dataset
  .post(...products.create) // create new product record
API_ROUTER.route('/products/:productId')
  .get(...products.readOne) // get product record by id
  .put(...products.update) // update product general data
  .patch(...products.patch) // patch record fields (seriesId)
  .delete(...products.delete) // delete product by id

// /////////////////////////////////////////////////////
// Purchase Orders
// /////////////////////////////////////////////////////
API_ROUTER.param('purchaseOrderId', purchaseOrders.autoFindTarget)
API_ROUTER.route('/purchaseOrders/:purchaseOrderId')
  .get(...purchaseOrders.readOne) // get purchase order by purchaseOrderId
//   .delete(notImplemented)

// /////////////////////////////////////////////////////
// Series
// /////////////////////////////////////////////////////
API_ROUTER.param('seriesId', series.autoFindTarget)
API_ROUTER.route('/series')
  .get(...series.read) // get product listing by tree structure (root level)
  .post(...series.createRootNode) // insert new root series
API_ROUTER.route('/series/:seriesId')
  .get(...series.read) // get product listing by tree structure (at specific series node)
  .post(...series.createChildNode) // insert new child series
  .patch(...series.patch) // patch series properties
  .delete(...series.delete) // delete series by id

// /////////////////////////////////////////////////////
// Tags
// /////////////////////////////////////////////////////
API_ROUTER.param('tagId', tags.autoFindTarget)
API_ROUTER.route('/tags')
  .get(...tags.readAll) // get a list of tags
  .post(...tags.insert) // insert tag record
API_ROUTER.route('/tagColors')
  .get(...tags.availableColors) // get a list of text name of colors
API_ROUTER.route('/tags/:tagId')
  .patch(...tags.patch) // patch tag record
  .delete(...tags.delete) // delete tag

// /////////////////////////////////////////////////////
// Utilities
// /////////////////////////////////////////////////////

// ///////////////////////////////////////////////////////
// API router specific post-routing processing middlewares
// ///////////////////////////////////////////////////////
API_ROUTER.use(responseHandlers.file)
API_ROUTER.use(responseHandlers.image)
API_ROUTER.use(responseHandlers.json)
API_ROUTER.use(responseHandlers.redirect)
API_ROUTER.use(responseHandlers.template)
API_ROUTER.use((req, res, next) => {
  res.status(404)
  let error = new Error('端點不存在')
  error.message = `客戶端要求不存在的 API 端點: ${req.method.toLowerCase()} ${eVars.APP_ROUTE}${req.path}`
  return next(error)
}) // catch all api calls that fell through
API_ROUTER.use(responseHandlers.error) // router specific error handler

module.exports = API_ROUTER
