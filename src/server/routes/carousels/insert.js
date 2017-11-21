const fs = require('fs-extra')
const piexif = require('piexifjs')
const uploads = require('multer')({ dest: require('path').resolve('./upload') })

const db = require('../../controllers/database')
const logging = require('../../controllers/logging')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = (() => {
  return [
    validateJwt,
    uploads.single('image'),
    prepImageData,
    (req, res, next) => {
      return db.Carousels
        .create(req.imageData)
        .then(newCarousel => {
          req.resJson = {
            data: {
              id: newCarousel.id,
              order: newCarousel.order,
              primary: newCarousel.primary,
              originalName: newCarousel.originalName,
              encoding: newCarousel.encoding,
              mimeType: newCarousel.mimeType,
              size: newCarousel.size
            }
          }
          next()
          return Promise.resolve()
        })
        .catch(error => next(error))
    }]
})()

function prepImageData (req, res, next) {
  let uploadedImage = req.file
  if (!uploadedImage) {
    res.status(400)
    let error = new Error('No image uploaded')
    return next(error)
  }
  return fs
    .readFile(uploadedImage.path)
    .then(async bufferedImage => {
      fs.remove(uploadedImage.path)
        .catch(error => logging.error(error, 'carousel temp file removal failure...'))
      req.imageData = {
        id: await nextAvailableId(),
        order: await nextAvailableValueInSequence(),
        primary: false,
        originalName: uploadedImage.originalname,
        encoding: uploadedImage.encoding,
        mimeType: uploadedImage.mimetype,
        size: uploadedImage.size,
        data: Buffer.from(piexif.remove(bufferedImage.toString('binary')), 'binary')
      }
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}

function nextAvailableId () {
  let nextAvailableId = 0
  return db.Carousels
    .findAll()
    .map(carousels => carousels.id)
    .then((carouselIds) => {
      // loop through and find the next available unused id
      while (carouselIds.indexOf(nextAvailableId) !== -1) {
        nextAvailableId++
      }
      return Promise.resolve(nextAvailableId)
    })
    .catch(Promise.reject)
}

function nextAvailableValueInSequence () {
  let nextAvailableValueInSequence = 0
  return db.Carousels
    .findAll()
    .map(carousels => carousels.order)
    .then((orderSequence) => {
      // loop through and find the next available order sequence value
      while (orderSequence.indexOf(nextAvailableValueInSequence) !== -1) {
        nextAvailableValueInSequence++
      }
      return Promise.resolve(nextAvailableValueInSequence)
    })
    .catch(Promise.reject)
}
