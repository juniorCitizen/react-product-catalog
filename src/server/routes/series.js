const express = require('express')
const path = require('path')

const router = express.Router()

// route handlers
const getSeries = require(path.join(__dirname, 'series/getSeries'))
const insertSeries = require(path.join(__dirname, 'series/insertSeries'))
const updateSeries = require(path.join(__dirname, 'series/updateSeries'))
const removeSeries = require(path.join(__dirname, 'series/removeSeries'))

module.exports = router
  .get(...getSeries.complete())
  .get(...getSeries.byId())
  .get(...getSeries.byName())
  .post(...insertSeries.byName())
  .put(...updateSeries.updateById())
  .patch(...updateSeries.updateNameById())
  .patch(...updateSeries.updateOrderById())
  .delete(...removeSeries.byId())
  .delete(...removeSeries.byName())
