import express from 'express'
import multer from 'multer'
import path from 'path'

import db from '../../controllers/database/database'
import routerResponse from '../../controllers/routerResponse'
import validateJwt from '../../middlewares/validateJwt'

const router = express.Router()
const upload = multer({ dest: path.join(__dirname, '../../upload/') })

router
  .get('/', products)
  .get('/series', require('./series'))
  .get('/searchByCode', require('./searchByCode'))
  .post('/',
    validateJwt,
    upload.fields([
      { name: 'primaryPhoto', maxCount: 1 },
      { name: 'secondaryPhotos', maxCount: 15 }
    ]),
    require('./insert'))
  .put('/',
    validateJwt,
    upload.fields([
      { name: 'primaryPhoto', maxCount: 1 },
      { name: 'secondaryPhotos', maxCount: 15 }
    ]),
    require('./update'))
  .delete('/', validateJwt, require('./delete'))

module.exports = router

function products (req, res) {
  let queryFilter = {
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt']
    },
    include: [{
      model: db.Descriptions,
      attributes: {
        exclude: [
          'createdAt',
          'updatedAt',
          'deletedAt'
        ]
      }
    }, {
      model: db.Photos,
      attributes: {
        exclude: [
          'data',
          'createdAt',
          'updatedAt',
          'deletedAt'
        ]
      }
    }],
    order: [
      ['code'],
      [db.Photos, 'primary', 'DESC']
    ]
  }
  return db.Products.findAll(queryFilter)
    .then((productRecords) => {
      return routerResponse.json({
        pendingResponse: res,
        originalRequest: req,
        statusCode: 200,
        success: true,
        data: productRecords
      })
    })
    .catch((error) => {
      return routerResponse.json({
        pendingResponse: res,
        originalRequest: req,
        statusCode: 500,
        success: false,
        error: error.name,
        message: error.message,
        data: error.stack
      })
    })
}
