import express from 'express'

import db from '../../controllers/database/database'
import routerResponse from '../../controllers/routerResponse'

const router = express.Router()

router
  .get('/', (req, res) => {
    return db.Countries
      .findAll({
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        order: [
          ['name']
        ]
      })
      .then((data) => {
        return routerResponse.json({
          pendingResponse: res,
          originalRequest: req,
          statusCode: 200,
          success: true,
          data: data
        })
      })
      .catch((error) => {
        return routerResponse.json({
          pendingResponse: res,
          originalRequest: req,
          statusCode: 500,
          success: false,
          error: error,
          message: 'database access error'
        })
      })
  })
  .get('/regions', require('./regions'))
  .get('/flags', require('./flags'))
  .get('/officeLocations', require('./officeLocations'))

module.exports = router
