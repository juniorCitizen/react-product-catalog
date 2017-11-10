const express = require('express')

// route handlers
const getSeries = require('./series/getSeries')
const insertSeries = require('./series/insertSeries')
const updateSeries = require('./series/updateSeries')
const removeSeries = require('./series/removeSeries')

module.exports = express.Router()
  .get(...getSeries.complete())
  .get(...getSeries.byId())
  .get(...getSeries.byName())
  .post(...insertSeries.byName())
  .put(...updateSeries.updateById())
  .patch(...updateSeries.updateNameById())
  .patch(...updateSeries.updateOrderById())
  .delete(...removeSeries.byId())
  .delete(...removeSeries.byName())
