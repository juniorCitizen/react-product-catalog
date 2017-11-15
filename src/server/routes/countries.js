const express = require('express')

const db = require('../controllers/database')
const routerResponse = require('../controllers/routerResponse')

const notImplemented = require('../middlewares/notImplemented')

module.exports = express.Router()
  .get('/', ...getCountries()) // get countries
  .post('/', notImplemented)
  .put('/', notImplemented)
  .patch('/', notImplemented)
  .delete('/', notImplemented)
  .get('/:countryId/flag', ...getFlagByCountryId()) // get flag from countryId
  .post('/:countryId/flag', notImplemented)
  .put('/:countryId/flag', notImplemented)
  .patch('/:countryId/flag', notImplemented)
  .delete('/:countryId/flag', notImplemented)

function getFlagByCountryId () {
  return [(req, res) => {
    return db.Flags
      .findById(req.params.countryId.toLowerCase())
      .then(svgData => routerResponse.imageBuffer({
        res,
        statusCode: 200,
        mimeType: 'image/svg+xml',
        dataBuffer: svgData.data
      }))
      .catch((error) => {
        return routerResponse.json({
          req,
          res,
          statusCode: 500,
          error,
          message: 'failure getting flag svg'
        })
      })
  }]
}

function getCountries () {
  return [(req, res) => {
    return db.Countries
      .findAll({ order: ['name'] })
      .then((data) => {
        return routerResponse.json({ res, req, statusCode: 200, data })
      })
      .catch((error) => {
        return routerResponse.json({
          req, res, statusCode: 500, error, message: 'failure getting country dataset'
        })
      })
  }]
}
