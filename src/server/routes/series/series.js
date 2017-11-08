const express = require('express')

const router = express.Router()

// route handlers
const getSeries = require('./getSeries')
const insertSeries = require('./insertSeries')
const updateSeries = require('./updateSeries')
const removeSeries = require('./removeSeries')

router
  .get(...getSeries.complete())
  .get(...getSeries.completeWithProducts())
  .get(...getSeries.byId())
  .get(...getSeries.byIdWithProducts())
  .get(...getSeries.byName())
  .get(...getSeries.byNameWithProducts())
  .post(...insertSeries.byName())
  .put(...updateSeries.updateById())
  .patch(...updateSeries.updateNameById())
  .patch(...updateSeries.updateOrderById())
  .delete(...removeSeries.byId())
  .delete(...removeSeries.byName())

module.exports = router
