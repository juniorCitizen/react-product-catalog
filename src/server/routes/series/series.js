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

router
  .get('/', preventDoubleQueryParameters, getSeries)
  .post('/', validateJwt, insertSeries)
  .put('/', updateSeries)
  .delete('/', validateJwt, ensureSingleQueryParameter, removeSeries)

module.exports = router

function updateSeries (req, res) {
  return res.status(200).end()
}
