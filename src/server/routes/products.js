const express = require('express')

// route handlers
const getProducts = require('./products/getProducts')
const insertProduct = require('./products/insertProduct')
const updateProduct = require('./products/updateProduct')
const deleteProduct = require('./products/deleteProduct')
const notImplemented = require('../middlewares/notImplemented')

// const upload = multer({ dest: path.join(__dirname, '../../upload/') })

module.exports = express.Router()
  .get('/', ...getProducts)
  .post('/', ...insertProduct)
  .put('/', ...updateProduct)
  .patch('/', notImplemented)
  .delete('/', ...deleteProduct)
  .get('/:id/photos', notImplemented)
  .post('/:id/photos', notImplemented) // add a photo to a product
  .put('/:id/photos', notImplemented)
  .patch('/:id/photos', notImplemented) // publish a photo
  .delete('/:id/photos', notImplemented) // remove a photo from a product
  .get('/:id/tags', notImplemented)
  .post('/:id/tags', notImplemented) // add a tag to a product
  .put('/:id/tags', notImplemented)
  .patch('/:id/tags', notImplemented)
  .delete('/:id/tags', notImplemented) // remove a tag from a product
