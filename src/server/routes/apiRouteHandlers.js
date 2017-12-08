const express = require('express')

const eVars = require('../config/eVars')

const logging = require('../controllers/logging')

const notImplemented = require('../middlewares/notImplemented')
const responseHandlers = require('../middlewares/responseHandlers')

const API_ROUTER = express.Router()

API_ROUTER.use((req, res, next) => {
  req[eVars.SYS_REF] = {}
  next()
})

// /////////////////////////////////////////////////////
// working API endpoints
// /////////////////////////////////////////////////////
API_ROUTER.route('/carousels')
  .get(...require('./carousels/getCarousel')) // get a carousel image data by displaySequence
  .post(...require('./carousels/insertCarousel')) // insert a carousel image
API_ROUTER.route('/carousels/:carouselId')
  .delete(...require('./carousels/deleteCarouselById')) // remove a carousel image by id
  .patch(...require('./carousels/patchCarouselDisplaySequence')) // update displaySequence of carousels

API_ROUTER.route('/contacts')
  .post(...require('./contacts/addContact')) // add a contact with company information
API_ROUTER.route('/contacts/:contactId')
  .get(...require('./contacts/getContactById')) // get contact by id
API_ROUTER.route('/companies')
  .get(...require('./companies/getHostCompanies')) // get project hosting companies dataset complete with country and staff info

API_ROUTER.route('/countries')
  .get(...require('./countries/getCountries')) // get countries

API_ROUTER.route('/photos')
  .post(...require('./photos/uploadPhotos')) // batch upload photos
API_ROUTER.route('/photos/:photoId')
  .get(...require('./photos/getPhotoById')) // get photo by id
  .patch(...require('./photos/patchPhotoById')) // patching primary or active status
  .delete(...require('./photos/removePhotoById')) // remove photo by id
API_ROUTER.route('/photos/:photoId/products/:productId')
  .post(...require('./photos/assignPhotoAssociation').toProduct) // assign productId to a photo
  .delete(...require('./photos/removePhotoAssociation').fromProduct) // remove productId from a photo
API_ROUTER.route('/photos/:photoId/series/:seriesId')
  .post(...require('./photos/assignPhotoAssociation').toSeries) // assign seriesId to a photo
  .delete(...require('./photos/removePhotoAssociation').fromSeries) // remove seriesId from a photo

API_ROUTER.route('/products')
  .get(...require('./products/getProducts')) // get product dataset
  .post(...require('./products/insertProduct')) // create new product record
API_ROUTER.route('/products/:productId')
  .get(...require('./products/getProductById')) // get product record by id
  .delete(...require('./products/deleteProduct')) // delete product by id
API_ROUTER.route('/products/:productId/series/:seriesId')
  .post(...require('./products/assignProductAssociation').toSeries) // associate a product to a series
  .delete(...require('./products/removeProductAssociation').fromSeries) // disassociate a product from a series
API_ROUTER.route('/products/:productId/tags/:tagId')
  .post(...require('./products/assignProductAssociation').toTags) // tagging a product
  .delete(...require('./products/removeProductAssociation').fromTag) // untag a product

API_ROUTER.route('/productMenus')
  .get(...require('./productMenus/getProductMenus')) // get product listing by tree structure

API_ROUTER.route('/purchaseOrders')
  .post(...require('./purchaseOrders/insertPurchaseOrder')) // insert new purchase order
API_ROUTER.route('/contacts/:contactId/purchaseOrders/:purchaseOrderId')
  .get(...require('./purchaseOrders/getPurchaseOrderById')) // get purchase order by purchaseOrderId
  .delete(notImplemented)

API_ROUTER.route('/series')
  .get(...require('./series/getSeries')) // get product listing by tree structure (root level)
  .post(...require('./series/insertSeries')) // insert a new series
API_ROUTER.route('/series/:seriesId')
  .get(...require('./series/getSeriesById')) // get product listing by tree structure (with specified series as root)
  .patch(...require('./series/patchSeries')) // patching series properties
  .delete(...require('./series/removeSeries')) // delete series by id
API_ROUTER.route('/series/:seriesId/products')
  .post(...require('./products/insertProduct')) // insert product record and associate with seriesId

API_ROUTER.route('/model/:modelReference')
  .get(...require('./utilities/getRecordCount')) // get record count of a particular model/table
API_ROUTER.route('/model/:modelReference/field/:fieldReference')
  .patch(...require('./utilities/patchRecordField')) // common patching route for general data file update
API_ROUTER.route('/productSearch')
  .get(...require('./utilities/productSearch')) // seach product listing
API_ROUTER.route('/regions')
  .get(...require('./countries/getRegions')) // get world regions
API_ROUTER.route('/tokens')
  .post(...require('./tokens/processJwtRequest')) // login

// /////////////////////////////////////////////////////
// Carousels
// /////////////////////////////////////////////////////

// /////////////////////////////////////////////////////
// Companies
// /////////////////////////////////////////////////////

// /////////////////////////////////////////////////////
// Contacts
// /////////////////////////////////////////////////////

// /////////////////////////////////////////////////////
// Countries
// /////////////////////////////////////////////////////

// /////////////////////////////////////////////////////
// Photos
// /////////////////////////////////////////////////////

// /////////////////////////////////////////////////////
// Products
// /////////////////////////////////////////////////////

// /////////////////////////////////////////////////////
// Regions
// /////////////////////////////////////////////////////

// /////////////////////////////////////////////////////
// Registrations
// /////////////////////////////////////////////////////

// /////////////////////////////////////////////////////
// Series
// /////////////////////////////////////////////////////

// /////////////////////////////////////////////////////
// Tokens
// /////////////////////////////////////////////////////

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
  logging.warning(`客戶端要求不存在的 API 端點: ${req.method.toLowerCase()} ${eVars.APP_ROUTE}${req.path}`)
  res.status(404)
  return res.json({
    method: req.method.toLowerCase(),
    endpoint: `${eVars.APP_ROUTE}${req.path}`,
    message: '端點不存在'
  })
}) // catch all api calls that fell through
API_ROUTER.use(responseHandlers.error) // router specific error handler

module.exports = API_ROUTER
