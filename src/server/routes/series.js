const express = require('express')

const notImplemented = require('../middlewares/notImplemented')

// route handlers
const getSeries = require('./series/getSeries')
const getSeriesById = require('./series/getSeriesById')
const insertSeries = require('./series/insertSeries')
const updateSeries = require('./series/updateSeries')
const removeSeries = require('./series/removeSeries')

module.exports = express.Router()
  .get('/', ...getSeries) // set series
  .post('/', ...insertSeries) // create new series
  .put('/', notImplemented)
  .patch('/', notImplemented)
  .delete('/', notImplemented)
  .get('/:id', ...getSeriesById) // get series by id
  .post('/:id', notImplemented)
  .put('/:id', ...updateSeries) // update multiple series field by id
  .patch('/:id', notImplemented)
  .delete('/:id', ...removeSeries) // delete series by id
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
