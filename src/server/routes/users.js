const express = require('express')

const notImplemented = require('../middlewares/notImplemented')

const addUser = require('./users/addUser')

module.exports = express.Router()
  .get('/', notImplemented) // get users **
  .post('/', ...addUser) // add a user to the system
  .put('/', notImplemented)
  .patch('/', notImplemented)
  .delete('/', notImplemented)
  .get('/:userId', notImplemented) // get user by id **
  .post('/:userId', notImplemented)
  .put('/:userId', notImplemented)
  .patch('/:userId', notImplemented)
  .patch('/:userId', notImplemented)
  .patch('/:userId', notImplemented)
  .delete('/:userId', notImplemented) // delete user by id **
  .get('/:userId/offices/:officeId', notImplemented)
  .post('/:userId/offices/:officeId', notImplemented)
  .put('/:userId/offices/:officeId', notImplemented)
  .patch('/:userId/offices/:officeId', notImplemented) // assign user to an office **
  .delete('/:userId/offices/:officeId', notImplemented)
  .patch('/:userId/password', notImplemented) // change password **
  .patch('/:userId/admin', notImplemented) // admin status toggle **
  .patch('/:userId/name/:name', notImplemented) // change name **
