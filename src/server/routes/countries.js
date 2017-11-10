const express = require('express')

const db = require('../controllers/database')
const routerResponse = require('../controllers/routerResponse')

const regions = require('./countries/regions')
const flags = require('./countries/flags')
const officeLocations = require('./countries/officeLocations')

const router = express.Router()

router
  .get('/', (req, res) => {
    return db.Countries
      .findAll({ order: [['name']] })
      .then((data) => {
        return routerResponse.json({
          res: res,
          req: req,
          statusCode: 200,
          data: data
        })
      })
      .catch((error) => {
        return routerResponse.json({
          req: req,
          res: res,
          statusCode: 500,
          error: error,
          message: 'database access error'
        })
      })
  })
  .get('/regions', regions)
  .get('/flags', flags)
  .get('/officeLocations', officeLocations)

module.exports = router
