const express = require('express')

const db = require('../controllers/database')
const routerResponse = require('../controllers/routerResponse')

const botPrevention = require('../middlewares/botPrevention')
const notImplemented = require('../middlewares/notImplemented')
const responseHandler = require('../middlewares/responseHandler')

const API_ROUTER = express.Router()

// /////////////////////////////////////////////////////
// Utilities
// /////////////////////////////////////////////////////
API_ROUTER.get('/recordCount/:modelReference', ...require('./utilities/getTotalRecordCount'))

// /////////////////////////////////////////////////////
// Carousels
// /////////////////////////////////////////////////////
API_ROUTER.route('/carousels')
  .get(notImplemented)
  .post(...require('./carousels/insertCarousel')) // add a carousel image
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)
API_ROUTER.route('/carousels/:carouselId')
  .get(...require('./carousels/getCarouselById')) // get one carousel
  .post(notImplemented)
  .put(notImplemented)
  .patch(notImplemented)
  .delete(...require('./carousels/removeCarousel')) // remove a carousel image
API_ROUTER.route('/carousels/:carouselId/order/:order')
  .get(notImplemented)
  .post(notImplemented)
  .put(notImplemented)
  .patch(...require('./carousels/updateCarouselOrder')) // update order of carousels
  .delete(notImplemented)
API_ROUTER.route('/carousels/:carouselId/primary')
  .get(notImplemented)
  .post(notImplemented)
  .put(notImplemented)
  .patch(...require('./carousels/toggleCarouselPrimaryStatus')) // switch primary status
  .delete(notImplemented)

// /////////////////////////////////////////////////////
// Countries
// /////////////////////////////////////////////////////
const getCountries = require('./countries/getCountries')
const getFlagByCountryId = require('./countries/getFlagByCountryId')
API_ROUTER.route('/countries')
  .get(...getCountries) // get countries
  .post(notImplemented)
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)
API_ROUTER.route('/countries/count')
  .get(notImplemented)
  .post(notImplemented)
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)
API_ROUTER.route('/countries/:countryId/flag')
  .get(...getFlagByCountryId) // get flag from countryId
  .post(notImplemented)
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)

// /////////////////////////////////////////////////////
// Offices **
// /////////////////////////////////////////////////////
API_ROUTER.route('/offices')
  .get(...require('./offices/getOffices')) // get office dataset complete with country and staff info
  .post(notImplemented)
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)
API_ROUTER.route('/offices/:officeId')
  .get(notImplemented)
  .post(notImplemented)
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)
API_ROUTER.route('/offices/:officeId/user')
  .get(notImplemented)
  .post(notImplemented)
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)
API_ROUTER.route('/offices/:officeId/user/:userId')
  .get(notImplemented)
  .post(notImplemented)
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
API_ROUTER.route('/products/count')
  .get(notImplemented)
  .post(notImplemented)
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
  .post('/', botPrevention, registration)

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
// series
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
  .post(...require('./tokens/processJwtRequest')) // verify against user credentials and provide a jwt upon success
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)

// /////////////////////////////////////////////////////
// Users
// /////////////////////////////////////////////////////
API_ROUTER.route('/users')
  .get(notImplemented) // get users **
  .post(...require('./users/addUser')) // add a user to the system
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented)
API_ROUTER.route('/users/:userId')
  .get(notImplemented) // get user by id **
  .post(notImplemented)
  .put(notImplemented)
  .patch(notImplemented)
  .delete(notImplemented) // delete user by id **
API_ROUTER.route('/users/:userId/offices/:officeId')
  .get(notImplemented)
  .post(notImplemented)
  .put(notImplemented)
  .patch(notImplemented) // assign user to an office **
  .delete(notImplemented)
API_ROUTER.route('/users/:userId/password')
  .get(notImplemented)
  .post(notImplemented)
  .put(notImplemented)
  .patch(notImplemented) // change password **
  .delete(notImplemented)
API_ROUTER.route('/users/:userId/admin')
  .get(notImplemented)
  .post(notImplemented)
  .put(notImplemented)
  .patch(notImplemented) // admin status toggle **
  .delete(notImplemented)
API_ROUTER.route('/users/:userId/name/:name')
  .get(notImplemented)
  .post(notImplemented)
  .put(notImplemented)
  .patch(notImplemented) // change name **
  .delete(notImplemented)

// /////////////////////////////////////////////////////
// API router specific post route processing middlewares
// /////////////////////////////////////////////////////
API_ROUTER.use(responseHandler.file)
API_ROUTER.use(responseHandler.image)
API_ROUTER.use(responseHandler.json)
API_ROUTER.use(responseHandler.template)
API_ROUTER.use(notImplemented) // catch all api calls that fell through
API_ROUTER.use(responseHandler.error) // router specific error handler

module.exports = API_ROUTER
