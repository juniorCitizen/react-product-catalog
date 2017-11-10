const express = require('express')

const db = require('../controllers/database')
const routerResponse = require('../controllers/routerResponse')

const botPrevention = require('../middlewares/botPrevention')

module.exports = express.Router()
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
