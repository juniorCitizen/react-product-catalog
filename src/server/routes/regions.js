const express = require('express')

const db = require('../controllers/database')
const routerResponse = require('../controllers/routerResponse')

const notImplemented = require('../middlewares/notImplemented')

module.exports = express.Router()
  .get('/', ...getRegions()) // get regions
  .post('/', notImplemented)
  .put('/', notImplemented)
  .patch('/', notImplemented)
  .delete('/', notImplemented)

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
