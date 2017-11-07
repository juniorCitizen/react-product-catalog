const express = require('express')

const router = express.Router()

// middlewares
const validateJwt = require('../../middlewares/validateJwt')
const preventDoubleQueryParameters = require('./middleware').preventDoubleQueryParameters
const ensureSingleQueryParameter = require('./middleware').ensureSingleQueryParameter

// route handlers
const getSeries = require('./getSeries')
const insertSeries = require('./insertSeries')
const removeSeries = require('./removeSeries')
const updateSeries = require('./updateSeries')

router
  .get('/', preventDoubleQueryParameters, getSeries)
  .post('/', validateJwt, insertSeries)
  .put('/', validateJwt, updateSeries)
  .delete('/', validateJwt, ensureSingleQueryParameter, removeSeries)

module.exports = router
