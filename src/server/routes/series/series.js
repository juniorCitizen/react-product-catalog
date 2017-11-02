const express = require('express')

const router = express.Router()

router
  .get('/',
    require('./getSeries').preventDoubleQueryParameters,
    require('./getSeries').getSeries)
  .post('/', insert)
  .put('/', update)
  .delete('/', remove)

module.exports = router

function insert (req, res) {
  return res.status(200).end()
}

function update (req, res) {
  return res.status(200).end()
}

function remove (req, res) {
  return res.status(200).end()
}
