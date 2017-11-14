const express = require('express')

const notImplemented = require('../middlewares/notImplemented')

// route handlers
const getSeries = require('./series/getSeries')
const getSeriesById = require('./series/getSeriesById')
const insertSeries = require('./series/insertSeries')
const updateSeries = require('./series/updateSeries')
const removeSeries = require('./series/removeSeries')

module.exports = express.Router()
  .get('/', ...getSeries) // get series dataset
  .post('/', notImplemented)
  .put('/', notImplemented)
  .patch('/', notImplemented)
  .delete('/', notImplemented)
  .get('/name/:name', notImplemented)
  .post('/name/:name', ...insertSeries) // create new series record
  .put('/name/:name', notImplemented)
  .patch('/name/:name', notImplemented)
  .delete('/name/:name', notImplemented)
  .get('/:seriesId', ...getSeriesById) // get series by id
  .post('/:seriesId', notImplemented)
  .put('/:seriesId', ...updateSeries) // update multiple series fields by id
  .patch('/:seriesId', notImplemented)
  .delete('/:seriesId', ...removeSeries) // delete series by id
