const express = require('express')

const notImplemented = require('../middlewares/notImplemented')

module.exports = express.Router()
  .get('/', (req, res) => notImplemented)
  .post('/', (req, res) => notImplemented)
  .put('/', (req, res) => notImplemented)
  .patch('/', (req, res) => notImplemented)
  .delete('/', (req, res) => notImplemented)
