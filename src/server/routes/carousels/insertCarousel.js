const fs = require('fs-extra')
const uploads = require('multer')({ dest: require('path').resolve('./upload') })

const db = require('../../controllers/database')
const logging = require('../../controllers/logging')
const routerResponse = require('../../controllers/routerResponse')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = (() => {
  return [
    validateJwt,
    uploads.single('image'),
    prepImageData,
    (req, res) => {
      return db.Carousels
        .create(req.imageData)
        .then(newCarousel => routerResponse.json({
          req,
          res,
          statusCode: 200,
          data: {
            id: newCarousel.id,
            order: newCarousel.order,
            primary: newCarousel.primary,
            originalName: newCarousel.originalName,
            encoding: newCarousel.encoding,
            mimeType: newCarousel.mimeType,
            size: newCarousel.size
          }
        }))
        .catch(error => routerResponse.json({
          req, res, statusCode: 500, error
        }))
    }]
})()

function prepImageData (req, res, next) {
  let uploadedImage = req.file
  return fs
    .readFile(uploadedImage.path)
    .then(async bufferedImage => {
      fs.remove(uploadedImage.path)
      req.imageData = {
        id: await nextAvailableId(),
        order: await nextAvailableValueInSequence(),
        primary: false,
        originalName: uploadedImage.originalname,
        encoding: uploadedImage.encoding,
        mimeType: uploadedImage.mimetype,
        size: uploadedImage.size,
        data: bufferedImage
      }
      next()
      return Promise.resolve()
    })
    .catch(error => {
      routerResponse.json({
        req, res, statusCode: 500, error
      })
      return next('CAROUSEL_PREPERATION_FAILURE')
    })
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
    .catch(logging.reject('error getting the next available id value'))
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
    .catch(logging.reject('error getting the next available order value'))
}
