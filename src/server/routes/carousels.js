const express = require('express')

const notImplemented = require('../middlewares/notImplemented')

const getCarousel = require('./carousels/getCarousel')
const insertCarousel = require('./carousels/insertCarousel')
const toggleCarouselPrimaryStatus = require('./carousels/toggleCarouselPrimaryStatus')
const removeCarousel = require('./carousels/removeCarousel')
const updateCarouselOrder = require('./carousels/updateCarouselOrder')

module.exports = express.Router()
  .get('/', notImplemented)
  .post('/', ...insertCarousel) // add a carousel image
  .put('/', notImplemented)
  .patch('/', notImplemented)
  .delete('/', notImplemented)
  .get('/:carouselId', ...getCarousel) // get one carousel
  .post('/:carouselId', notImplemented)
  .put('/:carouselId', notImplemented)
  .patch('/:carouselId', notImplemented)
  .delete('/:carouselId', ...removeCarousel) // remove a carousel image
  .get('/:carouselId/order/:order', notImplemented)
  .post('/:carouselId/order/:order', notImplemented)
  .put('/:carouselId/order/:order', notImplemented)
  .patch('/:carouselId/order/:order', ...updateCarouselOrder) // update order of carousels
  .delete('/:carouselId/order/:order', notImplemented)
  .get('/:carouselId/primary', notImplemented)
  .post('/:carouselId/primary', notImplemented)
  .put('/:carouselId/primary', notImplemented)
  .patch('/:carouselId/primary', ...toggleCarouselPrimaryStatus) // switch primary status
  .delete('/:carouselId/primary', notImplemented)
