const express = require('express')

const eVars = require('../config/eVars')

const db = require('../controllers/database')
const logging = require('../controllers/logging')
const routerResponse = require('../controllers/routerResponse')

const botPrevention = require('../middlewares/botPrevention')
const notImplemented = require('../middlewares/notImplemented')
const responseHandlers = require('../middlewares/responseHandlers')

const API_ROUTER = express.Router()

// //////////////////////////////////////////////////////
// API router specific pre-routing processing middlewares
// //////////////////////////////////////////////////////
API_ROUTER.use(require('../middlewares/routingRecorder/init'))

// /////////////////////////////////////////////////////
// Utilities
// /////////////////////////////////////////////////////
API_ROUTER.get('/recordCount/:modelReference', ...require('./utilities/getTotalRecordCount'))

// /////////////////////////////////////////////////////
// Carousels
// /////////////////////////////////////////////////////
API_ROUTER.route('/carousels')
  .get(notImplemented)
  .post(...require('./carousels/insert')) // insert a carousel image
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)
API_ROUTER.route('/carousels/:carouselId')
  .get(...require('./carousels/selectById')) // get a carousel image data by id
  .post(notImplemented)
  .put(notImplemented)
  .patch(notImplemented)
  .delete(...require('./carousels/deleteById')) // remove a carousel image by id
API_ROUTER.route('/carousels/:carouselId/order/:order')
  .get(notImplemented)
  .post(notImplemented)
  .put(notImplemented)
  .patch(...require('./carousels/updateOrderById')) // update order of carousels
  .delete(notImplemented)
API_ROUTER.route('/carousels/:carouselId/primary')
  .get(notImplemented)
  .post(notImplemented)
  .put(notImplemented)
  .patch(...require('./carousels/updatePrimaryStateById')) // set primary state of one carousel to true
  .delete(notImplemented)

// /////////////////////////////////////////////////////
// Companies **
// /////////////////////////////////////////////////////
API_ROUTER.route('/companies')
  .get(...require('./companies/getCompanies')) // get company dataset complete with country and staff info
  .post(notImplemented)
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)
API_ROUTER.route('/companies/:companyId')
  .get(notImplemented)
  .post(notImplemented)
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)
API_ROUTER.route('/companies/:companyId/contacts')
  .get(notImplemented)
  .post(notImplemented)
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)
API_ROUTER.route('/companies/:companyId/contacts/:contactId')
  .get(notImplemented)
  .post(notImplemented)
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)

// /////////////////////////////////////////////////////
// Countries
// /////////////////////////////////////////////////////
API_ROUTER.route('/countries')
  .get(...require('./countries/getCountries')) // get countries
  .post(notImplemented)
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)
API_ROUTER.route('/countries/:countryId/flag')
  .get(...require('./countries/getFlagByCountryId')) // get flag from countryId
  .post(notImplemented)
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)

// /////////////////////////////////////////////////////
// Flags
// /////////////////////////////////////////////////////
API_ROUTER.route('/flags')
  .get(notImplemented)
  .post(...require('./flags/insert')) // insert new flag
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)

// ///////////////////////////////////////////////////////////////
// Photos
// ///////////////////////////////////////////////////////////////
API_ROUTER.route('/photos')
  .get(notImplemented)
  .post(...require('./photos/insertPhotos')) // batch insert photos
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)

API_ROUTER.route('/photos/:photoId')
  .get(...require('./photos/getPhotoById')) // get photo by id
  .post(notImplemented)
  .put(notImplemented)
  .patch(...require('./photos/togglePhotoPublishState')) // publish/unpublish a photo
  .delete(...require('./photos/removePhotoById')) // remove photo by id

API_ROUTER.route('/photos/:photoId/products/:productId')
  .get(notImplemented)
  .post(notImplemented)
  .put(notImplemented)
  .patch(...require('./photos/assignPhoto').toProduct) // assign a photo to a product
  .delete(notImplemented)

API_ROUTER.route('/photos/:photoId/series/:seriesId')
  .get(notImplemented)
  .post(notImplemented)
  .put(notImplemented)
  .patch(...require('./photos/assignPhoto').toSeries) // assign a photo to a series
  .delete(notImplemented)

// /////////////////////////////////////////////////////
// Products
// /////////////////////////////////////////////////////
API_ROUTER.route('/products')
  .get(...require('./products/getProducts')) // get product dataset
  .post(...require('./products/insertProduct')) // create new product complete with optional photos and tags
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)
API_ROUTER.route('/products/:productId')
  .get(...require('./products/getProductById')) // get product record by id
  .post(notImplemented)
  .put(...require('./products/updateProduct')) // update multiple product fields by id
  .patch(notImplemented)
  .delete(...require('./products/deleteProduct')) // delete product by id
API_ROUTER.route('/products/:productId/series/:seriesId')
  .get(notImplemented)
  .post(notImplemented)
  .put(notImplemented)
  .patch(...require('./products/assignToSeries')) // assign a product to a series
  .delete(notImplemented)

// /////////////////////////////////////////////////////
// Regions
// /////////////////////////////////////////////////////
API_ROUTER.route('/regions')
  .get(...require('./countries/getRegions')) // get regions
  .post(notImplemented)
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)

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
API_ROUTER.route('/series')
  .get(...require('./series/getSeries')) // get series dataset
  .post(notImplemented)
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)
API_ROUTER.route('/series/name/:name')
  .get(notImplemented)
  .post(...require('./series/insertSeries')) // create new series record
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)
API_ROUTER.route('/series/:seriesId')
  .get(...require('./series/getSeriesById')) // get series by id
  .post(notImplemented)
  .put(...require('./series/updateSeries')) // update multiple series fields by id
  .patch(notImplemented)
  .delete(...require('./series/removeSeries')) // delete series by id

// /////////////////////////////////////////////////////
// Tokens
// /////////////////////////////////////////////////////
API_ROUTER.route('/tokens')
  .get(notImplemented)
  .post(...require('./tokens/processJwtRequest')) // provides jwt's based on credentials validity
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)

// /////////////////////////////////////////////////////
// Contacts
// /////////////////////////////////////////////////////
API_ROUTER.route('/contacts')
  .get(notImplemented) // get contacts **
  .post(...require('./contacts/addContact')) // add a contact to the system
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)
API_ROUTER.route('/contacts/:contactId')
  .get(notImplemented) // get contact by id **
  .post(notImplemented)
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented) // delete contact by id **
API_ROUTER.route('/contacts/:contactId/companies/:companyId')
  .get(notImplemented)
  .post(notImplemented)
  .put(notImplemented)
  .patch(notImplemented) // assign contact to a company **
  .delete(notImplemented)
API_ROUTER.route('/contacts/:contactId/password')
  .get(notImplemented)
  .post(notImplemented)
  .put(notImplemented)
  .patch(notImplemented) // change password **
  .delete(notImplemented)
API_ROUTER.route('/contacts/:contactId/admin')
  .get(notImplemented)
  .post(notImplemented)
  .put(notImplemented)
  .patch(notImplemented) // admin status toggle **
  .delete(notImplemented)
API_ROUTER.route('/contacts/:contactId/name/:name')
  .get(notImplemented)
  .post(notImplemented)
  .put(notImplemented)
  .patch(notImplemented) // change name **
  .delete(notImplemented)

// ///////////////////////////////////////////////////////
// API router specific post-routing processing middlewares
// ///////////////////////////////////////////////////////
API_ROUTER.use(require('../middlewares/routingRecorder/reporting'))
API_ROUTER.use(responseHandlers.file)
API_ROUTER.use(responseHandlers.image)
API_ROUTER.use(responseHandlers.json)
API_ROUTER.use(responseHandlers.redirect)
API_ROUTER.use(responseHandlers.template)
API_ROUTER.use((req, res, next) => {
  logging.warning(`客戶端要求不存在的 API 端點: ${eVars.HOST}${req.path}`)
  res.status(404)
  return res.json({
    method: req.method.toLowerCase(),
    endpoint: `${eVars.HOST}${req.path}`,
    message: '端點不存在'
  })
}) // catch all api calls that fell through
API_ROUTER.use(responseHandlers.error) // router specific error handler

module.exports = API_ROUTER
