const express = require('express')

const notImplemented = require('../middlewares/notImplemented')

const getPhotoById = require('./photos/getPhotoById')
const insertPhoto = require('./photos/insertPhoto')
const removePhoto = require('./photos/removePhoto')
const togglePhotoPublishState = require('./photos/togglePhotoPublishState')
const assignPhotoToSeries = require('./photos/assignPhoto').toSeries
const assignPhotoToProduct = require('./photos/assignPhoto').toProduct

module.exports = express.Router()
  .get('/', notImplemented)
  .post('/', ...insertPhoto) // batch insert photos
  .put('/', notImplemented)
  .patch('/', notImplemented)
  .delete('/', notImplemented)
  .get('/:photoId', ...getPhotoById) // get photo by id
  .post('/:photoId', notImplemented)
  .put('/:photoId', notImplemented)
  .patch('/:photoId', ...togglePhotoPublishState) // publish/unpublish a photo
  .delete('/:photoId', ...removePhoto) // remove photo by id
  .get('/:photoId/products/:productId', notImplemented)
  .post('/:photoId/products/:productId', notImplemented)
  .put('/:photoId/products/:productId', notImplemented)
  .patch('/:photoId/products/:productId', ...assignPhotoToProduct) // assign a photo to a product
  .delete('/:photoId/products/:productId', notImplemented)
  .get('/:photoId/series/:seriesId', notImplemented)
  .post('/:photoId/series/:seriesId', notImplemented)
  .put('/:photoId/series/:seriesId', notImplemented)
  .patch('/:photoId/series/:seriesId', ...assignPhotoToSeries) // assign a photo to a series
  .delete('/:photoId/series/:seriesId', notImplemented)
