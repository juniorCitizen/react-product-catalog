const express = require('express')

const eVars = require('../config/eVars')

const db = require('../controllers/database')
const logging = require('../controllers/logging')
const routerResponse = require('../controllers/routerResponse')

const botPrevention = require('../middlewares/botPrevention')
// const notImplemented = require('../middlewares/notImplemented')
const responseHandlers = require('../middlewares/responseHandlers')

const API_ROUTER = express.Router()

// /////////////////////////////////////////////////////
// working API endpoints
// /////////////////////////////////////////////////////
API_ROUTER.route('/carousels')
  .post(...require('./carousels/insertCarousel')) // insert a carousel image
API_ROUTER.route('/carousels/:displaySequence')
  .get(...require('./carousels/getCarouselBySequence')) // get a carousel image data by displaySequence
API_ROUTER.route('/carousels/:carouselId')
  .patch(...require('./carousels/patchCarousel')) // patching carousel record property
  .delete(...require('./carousels/deleteCarouselById')) // remove a carousel image by id
API_ROUTER.route('/carousels/:carouselId/displaySequence/:displaySequence')
  .patch(...require('./carousels/updateDisplaySequenceById')) // update displaySequence of carousels
API_ROUTER.route('/carousels/:carouselId/primary')
  .patch(...require('./carousels/updatePrimaryStateById')) // set primary state of one carousel to true

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
// Registrations **
// /////////////////////////////////////////////////////
API_ROUTER
  .post('/', botPrevention, registration)
  .get('/', (req, res) => {
    db.Registrations
      .findAll({ order: ['name'] })
      .then((registrationRecords) => {
        return routerResponse.json({
          req: req,
          res: res,
          statusCode: 200,
          data: registrationRecords
        })
      })
      .catch((error) => {
        return routerResponse.json({
          req: req,
          res: res,
          statusCode: 500,
          error: error,
          message: 'GET /api/registration errored'
        })
      })
  })
  .get('/byCountryId', (req, res) => {
    let queryFilter = {
      where: { id: req.query.countryId },
      include: [{ model: db.Registrations }],
      order: [[db.Registrations, 'name']]
    }
    db.Countries
      .findAll(queryFilter)
      .then((regRecordsByCountry) => {
        return routerResponse.json({
          req: req,
          res: res,
          statusCode: 200,
          data: regRecordsByCountry
        })
      })
      .catch((error) => {
        return routerResponse.json({
          req: req,
          res: res,
          statusCode: 500,
          error: error,
          message: 'GET /api/registration/byCountryId errored'
        })
      })
  })
  .post('/productRequest', botPrevention, productRequest)

function registration (req, res) {
  db.Registrations
    .create(req.body)
    .then((registration) => {
      return routerResponse.json({
        req: req,
        res: res,
        statusCode: 200,
        data: registration
      })
    })
    .catch((error) => {
      return routerResponse.json({
        req: req,
        res: res,
        statusCode: 500,
        error: error,
        message: 'POST /api/registration'
      })
    })
}

function productRequest (req, res) {
  return db.sequelize
    .transaction((trx) => {
      let trxObj = { transaction: trx }
      return db.Registrations
        .create(req.body, trxObj)
        .then((newRegistrationRecord) => {
          let insertProductInfoRequestRecords = []
          req.body.interestedProducts.map((interestedProductId) => {
            insertProductInfoRequestRecords.push(
              db.InterestedProducts.create({
                registrationId: newRegistrationRecord.id,
                productId: interestedProductId
              }, trxObj)
            )
          })
          return Promise
            .all(insertProductInfoRequestRecords)
            .then(() => {
              return db.Registrations.findById(newRegistrationRecord.id, trxObj)
            })
            .catch((error) => {
              console.log(error.name)
              console.log(error.message)
              console.log(error.stack)
              return Promise.reject(error)
            })
        })
        .catch((error) => {
          console.log(error.name)
          console.log(error.message)
          console.log(error.stack)
          return Promise.reject(error)
        })
    })
    .then((newRegistrationRecord) => {
      return routerResponse.json({
        pendingResponse: res,
        originalRequest: req,
        statusCode: 200,
        success: true,
        data: newRegistrationRecord
      })
    })
    .catch((error) => {
      console.log(error.name)
      console.log(error.message)
      console.log(error.stack)
      return routerResponse.json({
        pendingResponse: res,
        originalRequest: req,
        statusCode: 500,
        success: false,
        error: error
      })
    })
}

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
