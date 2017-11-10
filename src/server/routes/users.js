const express = require('express')

const localhostOnly = require('../middlewares/localhostOnly')
const validatePasswordFormat = require('../middlewares/validatePasswordFormat')

const addUser = require('./users/addUser')

module.exports = express.Router()
  .post('/addUser', localhostOnly, validatePasswordFormat, addUser)
