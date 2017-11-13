const express = require('express')

const notImplemented = require('../middlewares/notImplemented')

// route handlers
const getSeries = require('./series/getSeries')
const getSeriesById = require('./series/getSeriesById')
const insertSeries = require('./series/insertSeries')
const updateSeries = require('./series/updateSeries')
const removeSeries = require('./series/removeSeries')

module.exports = express.Router()
  .get('/', ...getSeries) // get series
  .post('/', ...insertSeries) // create new series
  .put('/', notImplemented)
  .patch('/', notImplemented)
  .delete('/', notImplemented)
  .get('/:seriesId', ...getSeriesById) // get series by id
  .post('/:seriesId', notImplemented)
  .put('/:seriesId', ...updateSeries) // update multiple series field by id
  .patch('/:seriesId', notImplemented)
  .delete('/:seriesId', ...removeSeries) // delete series by id
