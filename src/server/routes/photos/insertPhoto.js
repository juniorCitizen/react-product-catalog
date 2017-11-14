const fs = require('fs-extra')
const Promise = require('bluebird')
const uploads = require('multer')({ dest: require('path').resolve('./upload') })

const db = require('../../controllers/database')
const eVars = require('../../config/eVars')
const routerResponse = require('../../controllers/routerResponse')

const validateJwt = require('../../middlewares/validateJwt')
const filterBodyDataProperties = require('../../middlewares/filterBodyDataProperties')('photos')

module.exports = (() => {
  return [
    validateJwt,
    uploads.array('photos', eVars.SECONDARY_PHOTO_COUNT_CEILING + 1),
    filterBodyDataProperties,
    prepPhotoData,
    (req, res) => {
      return db.Photos
        .bulkCreate(req.photoData)
        .map(newPhotoRecords => {
          return {
            id: newPhotoRecords.id,
            primary: newPhotoRecords.primary,
            originalName: newPhotoRecords.originalName,
            encoding: newPhotoRecords.encoding,
            mimeType: newPhotoRecords.mimeType,
            size: newPhotoRecords.size,
            publish: newPhotoRecords.publish,
            seriesId: newPhotoRecords.seriesId,
            productId: newPhotoRecords.productId
          }
        })
        .then((data) => routerResponse.json({
          req, res, statusCode: 200, data
        }))
        .catch(error => routerResponse.json({
          req, res, statusCode: 500, error
        }))
    }]
})()

function prepPhotoData (req, res, next) {
  let uploadedPhotos = req.files
  req.photoData = []
  if (uploadedPhotos) {
    db.sequelize
      .transaction(trx => {
        return Promise
          .each(
            uploadedPhotos.map(photo => {
              return fs
                .readFile(photo.path)
                .then((bufferedPhoto) => {
                  fs.remove(photo.path)
                  return Promise.resolve(bufferedPhoto)
                })
            }),
            (bufferedPhoto, index) => {
              req.photoData.push(
                Object.assign({
                  originalName: uploadedPhotos[index].originalname,
                  encoding: uploadedPhotos[index].encoding,
                  mimeType: uploadedPhotos[index].mimetype,
                  size: uploadedPhotos[index].size,
                  data: bufferedPhoto
                }, req.filteredData)
              )
            }
          )
          .catch(error => {
            next(routerResponse.json({ req, res, statusCode: 500, error }))
          })
      })
      .then(() => {
        next()
        return Promise.resolve()
      })
      .catch(error => {
        next(routerResponse.json({ req, res, statusCode: 500, error }))
      })
  } else { // no photo were uploaded with the request
    next(routerResponse.json({ req, res, statusCode: 400 }))
  }
}
