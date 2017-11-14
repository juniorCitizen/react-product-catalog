const express = require('express')

const notImplemented = require('../middlewares/notImplemented')

module.exports = express.Router()
  .get('/', (req, res) => notImplemented) // get all carousel **
  .post('/', (req, res) => notImplemented) // add a carousel image **
  .put('/', (req, res) => notImplemented)
  .patch('/', (req, res) => notImplemented)
  .delete('/', (req, res) => notImplemented)
  .get('/:id', (req, res) => notImplemented) // get one carousel **
  .post('/:id', (req, res) => notImplemented)
  .put('/:id', (req, res) => notImplemented)
  .patch('/:id', (req, res) => notImplemented)
  .delete('/:id', (req, res) => notImplemented) // remove a carousel image **
  .get('/:id/order/:order', (req, res) => notImplemented)
  .post('/:id/order/:order', (req, res) => notImplemented)
  .put('/:id/order/:order', (req, res) => notImplemented)
  .patch('/:id/order/:order', (req, res) => notImplemented) // update order **
  .delete('/:id/order/:order', (req, res) => notImplemented)
  .get('/:id/primary', (req, res) => notImplemented)
  .post('/:id/primary', (req, res) => notImplemented)
  .put('/:id/primary', (req, res) => notImplemented)
  .patch('/:id/primary', (req, res) => notImplemented) // switch primary status **
  .delete('/:id/primary', (req, res) => notImplemented)
