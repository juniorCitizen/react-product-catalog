const express = require('express')

// route handlers
const getProducts = require('./products/getProducts')
const insertProduct = require('./products/insertProduct')
const updateProduct = require('./products/updateProduct')
const notImplemented = require('../middlewares/notImplemented')

// const upload = multer({ dest: path.join(__dirname, '../../upload/') })

module.exports = express.Router()
  .get('/', ...getProducts)
  .post('/', ...insertProduct)
  .put('/', ...updateProduct)
  .patch('/', notImplemented)
  .delete('/', notImplemented)
// .get('/series', require('./series'))
// .get('/searchByCode', require('./products/searchByCode'))
// .post('/',
//   validateJwt,
//   upload.fields([
//     { name: 'primaryPhoto', maxCount: 1 },
//     { name: 'secondaryPhotos', maxCount: 15 }
//   ]),
//   require('./products/insert'))
// .put('/',
//   validateJwt,
//   upload.fields([
//     { name: 'primaryPhoto', maxCount: 1 },
//     { name: 'secondaryPhotos', maxCount: 15 }
//   ]),
//   require('./products/update'))
// .delete('/', validateJwt, require('./products/delete'))

// function products (req, res) {
//   let queryFilter = {
//     attributes: {
//       exclude: ['createdAt', 'updatedAt', 'deletedAt']
//     },
//     include: [{
//       model: db.Descriptions,
//       attributes: {
//         exclude: [
//           'createdAt',
//           'updatedAt',
//           'deletedAt'
//         ]
//       }
//     }, {
//       model: db.Photos,
//       attributes: {
//         exclude: [
//           'data',
//           'createdAt',
//           'updatedAt',
//           'deletedAt'
//         ]
//       }
//     }],
//     order: [
//       ['code'],
//       [db.Photos, 'primary', 'DESC']
//     ]
//   }
//   return db.Products.findAll(queryFilter)
//     .then((productRecords) => {
//       return routerResponse.json({
//         pendingResponse: res,
//         originalRequest: req,
//         statusCode: 200,
//         success: true,
//         data: productRecords
//       })
//     })
//     .catch((error) => {
//       return routerResponse.json({
//         pendingResponse: res,
//         originalRequest: req,
//         statusCode: 500,
//         success: false,
//         error: error.name,
//         message: error.message,
//         data: error.stack
//       })
//     })
// }
