const fs = require('fs-extra')
const uploads = require('multer')({ dest: require('path').resolve('./upload') })

const db = require('../../controllers/database')
const eVars = require('../../config/eVars')
const logging = require('../../controllers/logging')
const routerResponse = require('../../controllers/routerResponse')

const validateJwt = require('../../middlewares/validateJwt')

const productQueryParameters = require('../../models/ormQueryParameters/products')

function prepPhotoData (req, res, next) {
  req.photoData = { photos: [] }
  next()
}

function prepSecondaryPhotoData (req, res, next) {
  // check existence of secondary photos
  if (req.files.secondaryPhotos) {
    // only proceed if primaryPhoto existed
    if (req.files.primaryPhoto) {
      req.files.secondaryPhotos.forEach(async (secondaryPhoto) => {
        req.photoData.photos.push({
          primary: false,
          originalName: secondaryPhoto.originalname,
          encoding: secondaryPhoto.encoding,
          mimeType: secondaryPhoto.mimetype,
          size: secondaryPhoto.size,
          publish: false,
          data: await fs.readFile(secondaryPhoto.path)
        })
      })
      next()
    } else {
      // secondaryPhotos existed but not primaryPhoto
      return routerResponse.json({
        req,
        res,
        statusCode: 400,
        message: 'primaryPhoto must exist to insert secondaryPhotos'
      })
    }
  } else {
    next() // no secondary photos found
  }
}

function prepPrimaryPhotoData (req, res, next) {
  if (req.files.primaryPhoto) {
    // only process if primary photo existed in the request
    let primaryPhoto = req.files.primaryPhoto[0]
    // read the photo into the photoData object array
    return fs
      .readFile(primaryPhoto.path)
      .then(bufferedPhoto => {
        req.photoData.photos.splice(0, 0, {
          primary: true,
          originalName: primaryPhoto.originalname,
          encoding: primaryPhoto.encoding,
          mimeType: primaryPhoto.mimetype,
          size: primaryPhoto.size,
          publish: true,
          data: bufferedPhoto
        })
        return next()
      })
      // error occured while reading the primary photo
      .catch(error => routerResponse.json({
        req,
        res,
        statusCode: 500,
        error,
        message: 'error processing the primary photo'
      }))
  }
  next() // no primary photo found
}

function removeTempPhotoFiles (req, res, next) {
  // non-critical process
  // server will continue to operate even failure is encountered
  // app operation does not wait for this middleware to complete operation
  if (req.files.secondaryPhotos) {
    req.files.secondaryPhotos.forEach((photo) => {
      fs.remove(photo.path)
        .then(() => logging.warning(`temp file ${photo.originalname} removed...`))
        .catch(error => logging.error(error, 'temp secondaryPhotos files removal failure...'))
    })
  }
  if (req.files.primaryPhoto) {
    fs.remove(req.files.primaryPhoto[0].path)
      .then(() => logging.warning(`temp file ${req.files.primaryPhoto[0].originalname} removed...`))
      .catch(error => logging.error(error, 'temp primaryPhoto file removal failure...'))
  }
  next()
}

module.exports = ((req, res) => {
  return [
    validateJwt,
    uploads.fields([
      { name: 'primaryPhoto', maxCount: 1 },
      { name: 'secondaryPhotos', maxCount: eVars.SECONDARY_PHOTO_COUNT_CEILING }
    ]),
    prepPhotoData,
    prepSecondaryPhotoData,
    prepPrimaryPhotoData,
    removeTempPhotoFiles,
    (req, res) => {
      return db.sequelize
        .transaction(trx => {
          let productData = {
            code: req.body.code,
            name: req.body.name,
            specification: req.body.specification,
            description: req.body.description
          }
          let createOptions = { transaction: trx }
          if (req.photoData.photos.length > 0) {
            Object.assign(productData, req.photoData)
            Object.assign(createOptions, { include: [{ model: db.Photos }] })
          }
          return db.Products
            .create(productData, createOptions)
            .then(newProduct => {
              if (req.body.tags) {
                return Promise
                  .all(req.body.tags.map((tag) => {
                    return db.Labels
                      .create({ productId: newProduct.id, tagId: tag }, { transaction: trx })
                  }))
                  .then(() => Promise.resolve(newProduct))
              } else {
                return Promise.resolve(newProduct)
              }
            })
        })
        .then(newProduct => db.Products.findById(
          newProduct.id,
          req.query.hasOwnProperty('details')
            ? productQueryParameters.details()
            : productQueryParameters.simple()
        ))
        .then(data => routerResponse.json({
          req,
          res,
          statusCode: 200,
          data
        }))
        .catch(error => routerResponse.json({
          req,
          res,
          statusCode: 500,
          error,
          message: 'error inserting product record'
        }))
    }]
})()
