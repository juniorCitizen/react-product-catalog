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
