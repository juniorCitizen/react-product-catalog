const del = require('del')
const fs = require('fs-extra')
const piexif = require('piexifjs')
const Promise = require('bluebird')
const multer = require('multer')({
  dest: require('path').resolve('./uploads'),
  fileFilter: (req, file, cb) => {
    if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|gif|svg|bmp)$/)) {
      return cb(new Error('Only image files are allowed!'), false)
    }
    return cb(null, true)
  },
  limits: { fileSize: 500000 }
})

const uuidV4 = require('uuid/v4')

const db = require('../../controllers/database')
const eVars = require('../../config/eVars')

const validateJwt = require('../../middlewares/validateJwt')
const products = require('./products')
const series = require('./series')

// free icons from https://icons8.com/icon/pack/free-icons/all
// return svg for missing photo substitue
const placeHolderSvg = `<?xml version="1.0" encoding="utf-8"?>
  <!-- Generator: Adobe Illustrator 18.1.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 32 32" enable-background="new 0 0 32 32" xml:space="preserve" width="96px" height="96px">
  <rect x="3" y="6" fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" width="26" height="20"/>
  <polyline fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" points="3,22.3 11,14.3 22.5,25.9 "/>
  <polyline fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" points="17.4,20.9 22,16.3 28.9,23.2 "/>
  <circle cx="24" cy="11" r="2"/>
  </svg>`

module.exports = {
  upload: [ // POST /photos
    validateJwt({ staff: true }),
    multer.array('photos', eVars.SECONDARY_PHOTO_COUNT_CEILING + 1),
    preparePhotoDataReadingActions,
    sequentialPhotoInsert,
    deleteTempPhotos,
    supplyNewPhotoIdListSummary
  ],
  readOne: [ // GET /photos/:photoId
    getPhotoImageById
  ],
  patch: [ // PATCH /photos/:photoId
    validateJwt({ staff: true }),
    products.findTarget('query', true, false),
    series.findTarget('query', true, false),
    determineProxyTarget,
    findTarget('params', true),
    sendPhotoData
  ],
  delete: [ // DELETE /photos/:photos
    validateJwt({ staff: true }),
    deletePhotoRecord
  ],
  // common middlewares
  autoFindTarget,
  findTarget,
  // specialized middlewares
  clearPhotoAssociations,
  getPhotoImageById,
  deleteTempPhotos
}

// find target photo record indicated by the request route.param() with :photoId
function autoFindTarget (req, res, next, photoId) {
  let targetPhotoId = photoId.toUpperCase()
  return db.Photos
    .findById(targetPhotoId)
    .then(targetPhoto => {
      req.targetPhotoId = targetPhotoId
      req.targetPhoto = targetPhoto
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}

// check if photo is associated with a product, error out if true
function clearPhotoAssociations (req, res, next) {
  if (!req.targetPhoto) return next()
  return req.targetPhoto
    .update({ seriesId: null, productId: null })
    .then(() => {
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}

// delete photo record
function deletePhotoRecord (req, res, next) {
  return db.Photos
    .destroy({ where: { id: req.targetPhotoId } })
    .then(data => {
      req.resJson = {
        data,
        message: data === 1 ? `photo (id: ${req.targetPhotoId}) deleted` : undefined
      }
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}

// delete files from the upload request
function deleteTempPhotos (req, res, next) {
  let tempPhotoPaths = req.files.map(photo => photo.path)
  return del(tempPhotoPaths)
    .then(paths => {
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}

// patch route proxy function
function determineProxyTarget (req, res, next) {
  let urlQuery = Object.keys(req.query)[0]
  let error = new Error(`unidentified url query element: '${urlQuery}'`)
  switch (urlQuery) {
    case 'primary':
      return patchPhotoPrimaryStatus(req, res, next)
    case 'productId':
      return setProductAssociation(req, res, next)
    case 'seriesId':
      return setSeriesAssociation(req, res, next)
    default:
      res.status(400)
      return next(error)
  }
}

// route photo image
function getPhotoImageById (req, res, next) {
  if (!req.targetPhoto) {
    res.status(404)
    req.resImage = { mimeType: 'image/svg+xml', data: placeHolderSvg }
    return next()
  } else {
    return db.Photos
      .scope({ method: ['imageOnly'] })
      .findById(req.targetPhoto.id)
      .then(photo => {
        req.resImage = { mimeType: photo.mimeType, data: Buffer.from(photo.data) }
        next()
        return Promise.resolve()
      })
      .catch(error => next(error))
  }
}

// get the target photo
function findTarget (source = 'params', failIfNotExist = false, failIfUndeclared = false) {
  return (req, res, next) => {
    let targetPhotoId = null
    if (!('photoId' in req[source])) {
      if (failIfUndeclared) {
        res.status(400)
        let error = new Error(`Target photoId must be declared at req.${source}`)
        return next(error)
      }
      req.targetPhotoId = null
      req.targetPhoto = null
      return next()
    } else {
      targetPhotoId = req[source].photoId.toUpperCase()
      return db.Photos
        .findById(targetPhotoId)
        .then(targetPhoto => {
          if (!targetPhoto && failIfNotExist) {
            res.status(400)
            let error = new Error(`Target product (id: ${targetPhotoId}) does not exist`)
            return Promise.reject(error)
          }
          req.targetPhotoId = targetPhoto ? targetPhotoId : null
          req.targetPhoto = targetPhoto || null
          next()
          return Promise.resolve()
        })
        .catch(error => next(error))
    }
  }
}

// patch primary field value
function patchPhotoPrimaryStatus (req, res, next) {
  let newPrimaryState = req.query.primary === 'true'
  let targetPhoto = req.targetPhoto
  return db.sequelize.transaction(transaction => {
    if (newPrimaryState) {
      // set all siblings as secondary if target is to become the primary
      let queryOptions = { where: { productId: targetPhoto.productId }, transaction }
      return db.Photos
        .update({ primary: false }, queryOptions)
        .then(() => targetPhoto.update({ primary: newPrimaryState }, { transaction }))
    } else {
      // only set target to secondary, siblings are not affected
      return targetPhoto.update({ primary: newPrimaryState }, { transaction })
    }
  }).then(() => {
    next()
    return Promise.resolve()
  }).catch(error => next(error))
}

// prepare an array of photo data from upload photos
// photos are stripped of Exif information
function preparePhotoDataReadingActions (req, res, next) {
  req.photoDataReadActions = req.files.map(photo => {
    return fs
      .readFile(photo.path)
      .then(bufferedPhoto => Promise.resolve(processExif(bufferedPhoto)))
      .catch(error => Promise.reject(error))
  })
  return next()
}

// check buffered photo for Exif data and strips it from the photo
function processExif (bufferedPhoto) {
  let data = null
  try {
    data = Buffer.from(piexif.remove(bufferedPhoto.toString('binary')), 'binary')
    return data
  } catch (e) {
    // caught exception due to missing EXIF
    return bufferedPhoto
  }
}

// send photo data in the server response 'data' property
function sendPhotoData (req, res, next) {
  req.resJson = { data: req.targetPhoto }
  return next()
}

// insert photos sequentially
function sequentialPhotoInsert (req, res, next) {
  return db.sequelize.transaction(transaction => {
    let newPhotoIdList = []
    // write photo record sequentially in transaction
    return Promise
      .each(req.photoDataReadActions, (photoData, index) => {
        newPhotoIdList.push(uuidV4().toUpperCase())
        let indexedFileInfo = req.files[index]
        // should not separate/refactor this from the photo reading action
        // may take up too much memory if photos are batch read first
        return db.Photos.create({
          id: newPhotoIdList[index],
          originalName: indexedFileInfo.originalname,
          encoding: indexedFileInfo.encoding,
          mimeType: indexedFileInfo.mimetype,
          size: indexedFileInfo.size,
          data: photoData
        }, { transaction }).catch(error => next(error))
      })
      .then(() => Promise.resolve(newPhotoIdList))
      .catch(error => next(error))
  }).then(newPhotoIdList => {
    req.newPhotoIdList = newPhotoIdList
    next()
    return Promise.resolve()
  }).catch(error => next(error))
}

// set product association (patching productId)
function setProductAssociation (req, res, next) {
  let targetProductId = req.targetProductId
  let targetPhoto = req.targetPhoto
  // set photo/product association
  return targetPhoto
    .update({ productId: targetProductId })
    .then(() => {
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}

// set series association (patching seriesId)
function setSeriesAssociation (req, res, next) {
  let targetSeriesId = req.targetSeriesId
  let targetPhoto = req.targetPhoto
  return db.sequelize.transaction(transaction => {
    return db.Photos.update(
      { seriesId: null },
      { where: { seriesId: targetSeriesId }, transaction }
    ).then(() => {
      return db.Photos.update(
        { seriesId: targetSeriesId },
        { where: { id: targetPhoto.id }, transaction }
      ).catch(error => Promise.reject(error))
    }).catch(error => Promise.reject(error))
  }).then(() => {
    next()
    return Promise.resolve()
  }).catch(error => next(error))
}

// put the new photo id's into the req.resJson object
function supplyNewPhotoIdListSummary (req, res, next) {
  req.resJson = {
    data: req.newPhotoIdList,
    message: `${req.newPhotoIdList.length} photos uploaded`
  }
  return next()
}
