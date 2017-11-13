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
  .get('/:seriesId', ...getSeriesById) // get series by id
  .post('/:seriesId', notImplemented)
  .put('/:seriesId', ...updateSeries) // update multiple series field by id
  .patch('/:seriesId', notImplemented)
  .delete('/:seriesId', ...removeSeries) // delete series by id
  .get('/:seriesId/photos', notImplemented)
  .post('/:seriesId/photos', notImplemented) // add a photo and associate to a series
  .put('/:seriesId/photos', notImplemented)
  .patch('/:seriesId/photos', notImplemented) // publish/unpublish a photo
  .delete('/:seriesId/photos', notImplemented) // disassociate a photo from a series
  .get('/:seriesId/products', notImplemented)
  .post('/:seriesId/products', notImplemented)
  .put('/:seriesId/products', notImplemented)
  .patch('/:seriesId/products', notImplemented)
  .delete('/:seriesId/products', notImplemented)
