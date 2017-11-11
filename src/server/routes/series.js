const express = require('express')

const notImplemented = require('../middlewares/notImplemented')

// route handlers
const getSeries = require('./series/getSeries')
const insertSeries = require('./series/insertSeries')
const updateSeries = require('./series/updateSeries')
const removeSeries = require('./series/removeSeries')

module.exports = express.Router()
  .get('/', ...getSeries())
  .post('/', ...insertSeries())
  .put('/', ...updateSeries())
  .patch('/', notImplemented)
  .delete('/', ...removeSeries())
