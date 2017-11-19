const fs = require('fs-extra')
const Promise = require('bluebird')
const uploads = require('multer')({ dest: require('path').resolve('./upload') })

const db = require('../../controllers/database')
const eVars = require('../../config/eVars')
const logging = require('../../controllers/logging')

const validateJwt = require('../../middlewares/validateJwt')
const filterBodyDataProperties = require('../../middlewares/filterBodyDataProperties')('photos')

module.exports = (() => {
  return [
    validateJwt,
    uploads.array('photos', eVars.SECONDARY_PHOTO_COUNT_CEILING + 1),
    filterBodyDataProperties,
    prepPhotoData,
    (req, res, next) => {
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
        .then((data) => {
          req.resJson = { data }
          next()
          return Promise.resolve()
        })
        .catch(error => next(error))
    }]
})()

function prepPhotoData (req, res, next) {
  // prepares a photo object - req.photoData for db insertion
  // insertion is done in the next route handler
  let uploadedPhotos = req.files
  req.photoData = []
  if (uploadedPhotos.length > 0) {
    db.sequelize.transaction(trx => {
      // read the multer'ed photo array and push
      // into res.photoData object 'in sequence'
      return Promise
        .each(
        // 用.map()將上傳圖檔的array編排成:
        // 1. fs.readFile
        // 2. fs.remove
        // 3. promise.resolve(bufferedPhoto) 的promise chain
          uploadedPhotos.map(photo => {
            return fs
              .readFile(photo.path)
              .then((bufferedPhoto) => {
              // photo removal isn't critical operation
              // failure is only logged but does not halt operation
                fs.remove(photo.path)
                  .catch(error => logging.error(error, 'photo temp files removal failure...'))
                // return the read photos into the next thenable chain
                return Promise.resolve(bufferedPhoto)
              })
              .catch(error => next(error))
          }),
          (bufferedPhoto, index) => {
          // push the read photos into req.photoData object
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
        ).catch(error => next(error))
    }).then(() => {
      next()
      return Promise.resolve()
    }).catch(error => next(error))
  } else { // no photo were uploaded with the request
    res.status(400)
    let error = new Error('No photos were found in the request')
    return next(error)
  }
}
