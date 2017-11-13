const express = require('express')

const notImplemented = require('../middlewares/notImplemented')

// route handlers
const getSeries = require('./series/getSeries')
const insertSeries = require('./series/insertSeries')
const updateSeries = require('./series/updateSeries')
const removeSeries = require('./series/removeSeries')

module.exports = express.Router()
  .get('/', ...getSeries)
  .post('/', ...insertSeries)
  .put('/', ...updateSeries)
  .patch('/', notImplemented)
  .delete('/', ...removeSeries)
  .get('/:id/photos', notImplemented)
  .post('/:id/photos', notImplemented) // add a photo to a series
  .put('/:id/photos', notImplemented)
  .patch('/:id/photos', notImplemented) // publish/unpublish a photo
  .delete('/:id/photos', notImplemented) // disassociate a photo from a series
  .get('/:id/products', notImplemented)
  .post('/:id/products', notImplemented)
  .put('/:id/products', notImplemented)
  .patch('/:id/products', notImplemented)
  .delete('/:id/products', notImplemented)
