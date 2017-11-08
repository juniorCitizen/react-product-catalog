const express = require('express')
const path = require('path')

const router = express.Router()

// route handlers
const getSeries = require(path.join(__dirname, 'series/getSeries'))
const insertSeries = require(path.join(__dirname, 'series/insertSeries'))
const updateSeries = require(path.join(__dirname, 'series/updateSeries'))
const removeSeries = require(path.join(__dirname, 'series/removeSeries'))

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
