const express = require('express')

const router = express.Router()

// middlewares
const validateJwt = require('../../middlewares/validateJwt')
const ensureSingleQueryParameter = require('./middleware').ensureSingleQueryParameter

// route handlers
const getSeries = require('./getSeries')
const insertSeries = require('./insertSeries')
const updateSeries = require('./updateSeries')
const removeSeries = require('./removeSeries')

router
  .get(...getSeries.query())
  .get(...getSeries.queryWithProducts())
  .get(...getSeries.queryById())
  .get(...getSeries.queryByIdWithProducts())
  .get(...getSeries.queryByName())
  .get(...getSeries.queryByNameWithProducts())
  .post(...insertSeries.byName())
  .put(...updateSeries.updateById())
  .patch(...updateSeries.updateNameById())
  .patch(...updateSeries.updateOrderById())
  .delete(...removeSeries.byId())
  .delete(...removeSeries.byName())

module.exports = router
