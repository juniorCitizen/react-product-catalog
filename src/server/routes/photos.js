const express = require('express')

const notImplemented = require('../middlewares/notImplemented')

const getPhotoById = require('./photos/getPhotoById')
const insertPhoto = require('./photos/insertPhoto')
const removePhoto = require('./photos/removePhoto')
const togglePhotoPublishState = require('./photos/togglePhotoPublishState')

module.exports = express.Router()
  .get('/', notImplemented)
  .post('/', ...insertPhoto) // batch insert photos
  .put('/', notImplemented)
  .patch('/', notImplemented)
  .delete('/', notImplemented)
  .get('/:photoId', ...getPhotoById) // get photo by id
  .post('/:photoId', notImplemented)
  .put('/:photoId', notImplemented)
  .patch('/:photoId', ...togglePhotoPublishState) // publish/unpublish a photo
  .delete('/:photoId', ...removePhoto) // remove photo by id
  .get('/:photoId/products/:productId', notImplemented)
  .post('/:photoId/products/:productId', notImplemented)
  .put('/:photoId/products/:productId', notImplemented)
  .patch('/:photoId/products/:productId', notImplemented)
  .delete('/:photoId/products/:productId', notImplemented)
  .get('/:photoId/series/:seriesId', notImplemented)
  .post('/:photoId/series/:seriesId', notImplemented)
  .put('/:photoId/series/:seriesId', notImplemented)
  .patch('/:photoId/series/:seriesId', notImplemented)
  .delete('/:photoId/series/:seriesId', notImplemented)

// deal with photo uploads and place inside the database (unused, pending deprecation)
// import del from 'del'
// import fs from 'fs'
// import multer from 'multer'
// import path from 'path'
// const upload = multer({ dest: path.resolve('./dist/server/upload/') })
// router.post('/', upload.array('prod-photo', null), processPhotoUploads)
// function processPhotoUploads(req, res) {
//     let dbQueries = [] // array to hold queries that writes photo to database
//     req.files.forEach((file) => { // place all uploads into the array
//         dbQueries.push(
//             db.Photos.create({ // sequelize insert query
//                 originalName: file.originalname,
//                 encoding: file.encoding,
//                 mimeType: file.mimetype,
//                 size: file.size,
//                 photoData: fs.readFileSync(file.path) // write photo data to the blob field
//             })
//         )
//     })
//     // remove all unregistered photos
//     return db.Photos.destroy({ where: { productId: null } })
//         .then(() => {
//             // run the photo insert queries
//             return Promise.all(dbQueries)
//         })
//         .then((dbQueryResult) => {
//             // remove all the left over photos
//             req.files.forEach((file) => {
//                 del.sync(file.path)
//             })
//             return routerResponse.json({ // return a successful photo upload
//                 pendingResponse: res,
//                 originalRequest: req,
//                 statusCode: 200,
//                 success: true,
//                 data: dbQueryResult // actual data return by the insert queries about the photo records
//             })
//         })
//         .catch((error) => {
//             return routerResponse.json({ // return error object to the frontend when the photo upload had failed
//                 pendingResponse: res,
//                 originalRequest: req,
//                 statusCode: 500,
//                 success: false,
//                 error: error,
//                 message: 'photo upload error'
//             })
//         })
// }
