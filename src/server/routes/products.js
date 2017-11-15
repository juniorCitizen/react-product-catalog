const express = require('express')

const notImplemented = require('../middlewares/notImplemented')

// route handlers
const getProducts = require('./products/getProducts')
const getProductById = require('./products/getProductById')
const insertProduct = require('./products/insertProduct')
const updateProduct = require('./products/updateProduct')
const deleteProduct = require('./products/deleteProduct')
const assignToSeries = require('./products/assignToSeries')

module.exports = express.Router()
  .get('/', ...getProducts) // get product dataset
  .post('/', ...insertProduct) // create new product complete with optional photos and tags
  .put('/', notImplemented)
  .patch('/', notImplemented)
  .delete('/', notImplemented)
  .get('/:productId', ...getProductById) // get product record by id
  .post('/:productId', notImplemented)
  .put('/:productId', ...updateProduct) // update multiple product fields by id
  .patch('/:productId', notImplemented)
  .delete('/:productId', ...deleteProduct) // delete product by id
  .get('/:productId/series/:seriesId', notImplemented)
  .post('/:productId/series/:seriesId', notImplemented)
  .put('/:productId/series/:seriesId', notImplemented)
  .patch('/:productId/series/:seriesId', ...assignToSeries) // assign a product to a series
  .delete('/:productId/series/:seriesId', notImplemented)
