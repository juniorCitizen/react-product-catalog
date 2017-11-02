const express = require('express')

const router = express.Router()

router
  .get('/',
    require('./getSeries').preventDoubleQueryParameters,
    require('./getSeries').getSeries)
  .post('/',
    require('../../middlewares/validateJwt'),
    require('./insertSeries').insertSeries)
  .put('/', update)
  .delete('/', remove)

module.exports = router

function update (req, res) {
  return res.status(200).end()
}

function remove (req, res) {
  return res.status(200).end()
}
