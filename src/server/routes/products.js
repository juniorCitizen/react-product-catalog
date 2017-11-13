const express = require('express')

const notImplemented = require('../middlewares/notImplemented')

// route handlers
const getProducts = require('./products/getProducts')
const insertProduct = require('./products/insertProduct')
const updateProduct = require('./products/updateProduct')
const deleteProduct = require('./products/deleteProduct')

module.exports = express.Router()
  .get('/', ...getProducts)
  .post('/', ...insertProduct)
  .put('/', ...updateProduct)
  .patch('/', notImplemented)
  .delete('/', ...deleteProduct)
  .get('/:productId', notImplemented)
  .post('/:productId', notImplemented)
  .put('/:productId', notImplemented)
  .patch('/:productId', notImplemented)
  .delete('/:productId', notImplemented)
  .get('/:productId/photos', notImplemented)
  .post('/:productId/photos', notImplemented) // add a photo to a product
  .put('/:productId/photos', notImplemented)
  .patch('/:productId/photos', notImplemented) // publish/unpublish a photo
  .delete('/:productId/photos', notImplemented) // disassociate a photo from a product
  .get('/:productId/tags', notImplemented)
  .post('/:productId/tags', notImplemented) // add a tag to a product
  .put('/:productId/tags', notImplemented)
  .patch('/:productId/tags', notImplemented)
  .delete('/:productId/tags', notImplemented) // disassociate a tag from a product
