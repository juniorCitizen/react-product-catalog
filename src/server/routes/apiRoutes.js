const express = require('express')
const jwt = require('jsonwebtoken')

const db = require('../controllers/database')
const encryption = require('../controllers/encryption')
const eVars = require('../config/eVars')
const routerResponse = require('../controllers/routerResponse')

const botPrevention = require('../middlewares/botPrevention')
const notImplemented = require('../middlewares/notImplemented')

const API_ROUTER = express.Router()

// SERIES
const getSeries = require('./series/getSeries')
const getSeriesById = require('./series/getSeriesById')
const insertSeries = require('./series/insertSeries')
const updateSeries = require('./series/updateSeries')
const removeSeries = require('./series/removeSeries')

API_ROUTER
  .get('/series', ...getSeries) // get series dataset
  .post('/series', notImplemented)
  .put('/series', notImplemented)
  .patch('/series', notImplemented)
  .delete('/series', notImplemented)
  .get('/series/name/:name', notImplemented)
  .post('/series/name/:name', ...insertSeries) // create new series record
  .put('/series/name/:name', notImplemented)
  .patch('/series/name/:name', notImplemented)
  .delete('/series/name/:name', notImplemented)
  .get('/series/:seriesId', ...getSeriesById) // get series by id
  .post('/series/:seriesId', notImplemented)
  .put('/series/:seriesId', ...updateSeries) // update multiple series fields by id
  .patch('/series/:seriesId', notImplemented)
  .delete('/series/:seriesId', ...removeSeries) // delete series by id

// CAROUSELS
const getCarousel = require('./carousels/getCarousel')
const insertCarousel = require('./carousels/insertCarousel')
const toggleCarouselPrimaryStatus = require('./carousels/toggleCarouselPrimaryStatus')
const removeCarousel = require('./carousels/removeCarousel')
const updateCarouselOrder = require('./carousels/updateCarouselOrder')

API_ROUTER
  .get('/carousels', notImplemented)
  .post('/carousels', ...insertCarousel) // add a carousel image
  .put('/carousels', notImplemented)
  .patch('/carousels', notImplemented)
  .delete('/carousels', notImplemented)
  .get('/carousels/:carouselId', ...getCarousel) // get one carousel
  .post('/carousels/:carouselId', notImplemented)
  .put('/carousels/:carouselId', notImplemented)
  .patch('/carousels/:carouselId', notImplemented)
  .delete('/carousels/:carouselId', ...removeCarousel) // remove a carousel image
  .get('/carousels/:carouselId/order/:order', notImplemented)
  .post('/carousels/:carouselId/order/:order', notImplemented)
  .put('/carousels/:carouselId/order/:order', notImplemented)
  .patch('/carousels/:carouselId/order/:order', ...updateCarouselOrder) // update order of carousels
  .delete('/carousels/:carouselId/order/:order', notImplemented)
  .get('/carousels/:carouselId/primary', notImplemented)
  .post('/carousels/:carouselId/primary', notImplemented)
  .put('/carousels/:carouselId/primary', notImplemented)
  .patch('/carousels/:carouselId/primary', ...toggleCarouselPrimaryStatus) // switch primary status
  .delete('/carousels/:carouselId/primary', notImplemented)

// REGIONS
API_ROUTER
  .get('/regions', ...getRegions()) // get regions
  .post('/regions', notImplemented)
  .put('/regions', notImplemented)
  .patch('/regions', notImplemented)
  .delete('/regions', notImplemented)

function getRegions () {
  return [(req, res) => {
    return db.Countries
      .findAll({
        attributes: ['region'],
        group: 'region'
      })
      .then(data => routerResponse.json({
        req, res, statusCode: 200, data
      }))
      .catch(error => routerResponse.json({
        req, res, statusCode: 500, error, message: 'get region failed'
      }))
  }]
}

// COUNTRIES
const getCountries = require('./countries/getCountries')
const getFlagByCountryId = require('./countries/getFlagByCountryId')

API_ROUTER
  .get('/countries', ...getCountries) // get countries
  .post('/countries', notImplemented)
  .put('/countries', notImplemented)
  .patch('/countries', notImplemented)
  .delete('/countries', notImplemented)
  .get('/countries/:countryId/flag', ...getFlagByCountryId) // get flag from countryId
  .post('/countries/:countryId/flag', notImplemented)
  .put('/countries/:countryId/flag', notImplemented)
  .patch('/countries/:countryId/flag', notImplemented)
  .delete('/countries/:countryId/flag', notImplemented)

// OFFICES **
API_ROUTER
  .get('/offices', ...getOffices()) // get office dataset complete with country and staff info
  .post('/offices', notImplemented)
  .put('/offices', notImplemented)
  .patch('/offices', notImplemented)
  .delete('/offices', notImplemented)
  .get('/offices/:officeId', notImplemented)
  .post('/offices/:officeId', notImplemented)
  .put('/offices/:officeId', notImplemented)
  .patch('/offices/:officeId', notImplemented)
  .delete('/offices/:officeId', notImplemented)
  .get('/offices/:officeId/user', notImplemented)
  .post('/offices/:officeId/user', notImplemented)
  .put('/offices/:officeId/user', notImplemented)
  .patch('/offices/:officeId/user', notImplemented)
  .delete('/offices/:officeId/user', notImplemented)
  .get('/offices/:officeId/user/:userId', notImplemented)
  .post('/offices/:officeId/user/:userId', notImplemented)
  .put('/offices/:officeId/user/:userId', notImplemented)
  .patch('/offices/:officeId/user/:userId', notImplemented)
  .delete('/offices/:officeId/user/:userId', notImplemented)

function getOffices () {
  return [(req, res) => {
    return db.offices.findAll({
      include: [{
        model: db.Countries
      }, {
        model: db.Users,
        attributes: { exclude: ['loginId', 'password', 'salt'] }
      }]
    }).then(data => routerResponse.json({
      req, res, statusCode: 200, data
    })).catch(error => routerResponse.json({
      req, res, statusCode: 500, error
    }))
  }]
}

// PHOTOS
const getPhotoById = require('./photos/getPhotoById')
const insertPhoto = require('./photos/insertPhoto')
const removePhoto = require('./photos/removePhoto')
const togglePhotoPublishState = require('./photos/togglePhotoPublishState')
const assignPhotoToSeries = require('./photos/assignPhoto').toSeries
const assignPhotoToProduct = require('./photos/assignPhoto').toProduct

API_ROUTER
  .get('/photos', notImplemented)
  .post('/photos', ...insertPhoto) // batch insert photos
  .put('/photos', notImplemented)
  .patch('/photos', notImplemented)
  .delete('/photos/photos', notImplemented)
  .get('/photos/:photoId', ...getPhotoById) // get photo by id
  .post('/photos/:photoId', notImplemented)
  .put('/photos/:photoId', notImplemented)
  .patch('/photos/:photoId', ...togglePhotoPublishState) // publish/unpublish a photo
  .delete('/photos/:photoId', ...removePhoto) // remove photo by id
  .get('/photos/:photoId/products/:productId', notImplemented)
  .post('/photos/:photoId/products/:productId', notImplemented)
  .put('/photos/:photoId/products/:productId', notImplemented)
  .patch('/photos/:photoId/products/:productId', ...assignPhotoToProduct) // assign a photo to a product
  .delete('/photos/:photoId/products/:productId', notImplemented)
  .get('/photos/:photoId/series/:seriesId', notImplemented)
  .post('/photos/:photoId/series/:seriesId', notImplemented)
  .put('/photos/:photoId/series/:seriesId', notImplemented)
  .patch('/photos/:photoId/series/:seriesId', ...assignPhotoToSeries) // assign a photo to a series
  .delete('/photos/:photoId/series/:seriesId', notImplemented)

// PRODUCTS
const getProducts = require('./products/getProducts')
const getProductById = require('./products/getProductById')
const insertProduct = require('./products/insertProduct')
const updateProduct = require('./products/updateProduct')
const deleteProduct = require('./products/deleteProduct')
const assignToSeries = require('./products/assignToSeries')

API_ROUTER
  .get('/products', ...getProducts) // get product dataset
  .post('/products', ...insertProduct) // create new product complete with optional photos and tags
  .put('/products', notImplemented)
  .patch('/products', notImplemented)
  .delete('/products', notImplemented)
  .get('/products/:productId', ...getProductById) // get product record by id
  .post('/products/:productId', notImplemented)
  .put('/products/:productId', ...updateProduct) // update multiple product fields by id
  .patch('/products/:productId', notImplemented)
  .delete('/products/:productId', ...deleteProduct) // delete product by id
  .get('/products/:productId/series/:seriesId', notImplemented)
  .post('/products/:productId/series/:seriesId', notImplemented)
  .put('/products/:productId/series/:seriesId', notImplemented)
  .patch('/products/:productId/series/:seriesId', ...assignToSeries) // assign a product to a series
  .delete('/products/:productId/series/:seriesId', notImplemented)

// TOKENS
API_ROUTER
  .get('/tokens', notImplemented)
  .post('/tokens', ...processJwtRequest()) // verify against user credentials and provide a jwt upon success
  .put('/tokens', notImplemented)
  .patch('/tokens', notImplemented)
  .delete('/tokens', notImplemented)

function processJwtRequest () {
  return [
    loginInfoPresence,
    botPrevention,
    (req, res) => {
      return db.Users.findOne({
        where: { email: req.body.email, loginId: req.body.loginId, admin: true }
      }).then((apiUser) => {
        if (!apiUser) {
          // reject the request if such user does not exist
          return routerResponse.json({
            req, res, statusCode: 401, message: 'incorrect login information'
          })
        }
        // hash the submitted password against the salt string
        let currentHash = encryption.sha512(req.body.password, apiUser.salt).passwordHash
        // compare with the stored hash
        if (currentHash === apiUser.password) { // hash verified
          let payload = {
            email: req.body.email,
            loginId: req.body.loginId
          }
          return routerResponse.json({
            req,
            res,
            statusCode: 200,
            data: jwt.sign(payload, eVars.PASS_PHRASE, { expiresIn: '24h' }),
            message: 'token is supplied for 24 hours'
          })
        } else { // hash verification failed
          return routerResponse.json({
            req, res, statusCode: 401, message: 'incorrect login information'
          })
        }
      }).catch(error => routerResponse.json({
        req, res, statusCode: 500, error, message: 'jwt request failure'
      }))
    }]
}

function loginInfoPresence (req, res, next) {
  let expectedFields = ['email', 'loginId', 'password', 'botPrevention']
  expectedFields.forEach((fieldName) => {
    if (!req.body.hasOwnProperty(fieldName)) {
      routerResponse.json({
        req, res, statusCode: 401, message: 'login info is incomplete'
      })
      return next('LOGIN_INFO_IMCOMPLETE')
    }
  })
  next()
}

// REGISTRATIONS
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

// USERS
const addUser = require('./users/addUser')

API_ROUTER
  .get('/users', notImplemented) // get users **
  .post('/users', ...addUser) // add a user to the system
  .put('/users', notImplemented)
  .patch('/users', notImplemented)
  .delete('/users', notImplemented)
  .get('/users/:userId', notImplemented) // get user by id **
  .post('/users/:userId', notImplemented)
  .put('/users/:userId', notImplemented)
  .patch('/users/:userId', notImplemented)
  .patch('/users/:userId', notImplemented)
  .patch('/users/:userId', notImplemented)
  .delete('/users/:userId', notImplemented) // delete user by id **
  .get('/users/:userId/offices/:officeId', notImplemented)
  .post('/users/:userId/offices/:officeId', notImplemented)
  .put('/users/:userId/offices/:officeId', notImplemented)
  .patch('/users/:userId/offices/:officeId', notImplemented) // assign user to an office **
  .delete('/users/:userId/offices/:officeId', notImplemented)
  .patch('/users/:userId/password', notImplemented) // change password **
  .patch('/users/:userId/admin', notImplemented) // admin status toggle **
  .patch('/users/:userId/name/:name', notImplemented) // change name **

module.exports = API_ROUTER