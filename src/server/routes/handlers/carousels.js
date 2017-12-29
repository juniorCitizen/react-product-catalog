const del = require('del')
const fs = require('fs-extra')
const multer = require('multer')({
  dest: require('path').resolve('./uploads'),
  fileFilter: (req, file, cb) => {
    if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|gif|svg|bmp)$/)) {
      return cb(new Error('Only image files are allowed!'), false)
    }
    return cb(null, true)
  },
  limits: { fileSize: 2500000 }
})
const piexif = require('piexifjs')
const Promise = require('bluebird')

const db = require('../../controllers/database')

const pagination = require('../../middlewares/pagination')
const validateJwt = require('../../middlewares/validateJwt')

const Op = db.Sequelize.Op

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
  read: [ // GET /carousels
    pagination(getRecordCount),
    getCarouselDataOrImage
  ],
  insert: [ // POST /carousels
    validateJwt({ staff: true }),
    multer.single('image'),
    nextAvailableId,
    insertRecord,
    deleteTempPhoto,
    findTarget('created', true),
    sendTargetData
  ],
  patch: [ // PATCH /carousels/:carouselId
    ensureValidTargetCarousel,
    validateJwt({ staff: true }),
    findOriginalPosition,
    findTargetPosition,
    determineProxyTarget,
    findTarget('params', true),
    sendTargetData
  ],
  delete: [ // DELETE /carousels/:carouselId
    ensureValidTargetCarousel,
    validateJwt({ staff: true }),
    deleteRecord
  ],
  // utilities
  getRecordCount,
  // common middlewares
  autoFindTarget,
  findTarget,
  sendTargetData,
  // specialized middlewares
  deleteTempPhoto
}

// find target carousel record indicated by the request route.param() with :carouselId
function autoFindTarget (req, res, next, carouselId) {
  let targetCarouselId = parseInt(carouselId)
  return db.Carousels
    .findById(targetCarouselId)
    .then(targetCarousel => {
      req.targetCarouselId = targetCarouselId
      req.targetCarousel = targetCarousel
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}

// find original displaySequence position
function findOriginalPosition (req, res, next) {
  if ('displaySequence' in req.query) {
    req.originalPosition = req.targetCarousel.displaySequence
  }
  return next()
}

// find target displaySequence position and make sure it's within valid range (displaySequence to set)
function findTargetPosition (req, res, next) {
  return getRecordCount()
    .then(recordCount => {
      if ('displaySequence' in req.query) {
        let targetPosition = parseInt(req.query.displaySequence)
        if (targetPosition >= recordCount) targetPosition = recordCount - 1
        if (targetPosition < 0) targetPosition = 0
        if (targetPosition === req.originalPosition) {
          res.status(400)
          let error = new Error('No change in displaySequence')
          return Promise.reject(error)
        } else {
          req.targetPosition = targetPosition
          next()
          return Promise.resolve()
        }
      } else {
        next()
        return Promise.resolve()
      }
    })
    .catch(error => next(error))
}

// route handler GET /carousels
function getCarouselDataOrImage (req, res, next) {
  let scope = 'linkHeader' in req ? { method: ['imageOnly'] } : 'defaultScope'
  return db.Carousels
    .scope(scope)
    .findAll(req.queryOptions)
    .then(data => {
      if ('linkHeader' in req) {
        // only send one photo if pagination url query is found
        req.resImage = data.length === 0
          ? { mimeType: 'image/svg+xml', data: placeHolderSvg }
          : { mimeType: data[0].mimeType, data: Buffer.from(data[0].data) }
      } else {
        // send a list of existing carousel without photo data
        req.resJson = { data }
      }
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}

// delete record
function deleteRecord (req, res, next) {
  return db.sequelize.transaction(transaction => {
    let originalPosition = req.targetCarousel.displaySequence
    return db.Carousels
      .update({
        displaySequence: db.sequelize.literal('`displaySequence`-1')
      }, {
        where: { displaySequence: { [Op.gt]: originalPosition } },
        transaction
      })
      .then(() => {
        return db.Carousels
          .destroy({
            where: { id: req.targetCarouselId },
            transaction
          }).catch(error => Promise.reject(error))
      }).catch(error => Promise.reject(error))
  }).then(data => {
    req.resJson = { data }
    next()
    return Promise.resolve()
  }).catch(error => next(error))
}

// delete files from the upload request
function deleteTempPhoto (req, res, next) {
  let tempPhotoPaths = [req.file.path]
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
    case 'displaySequence':
      return patchDisplaySequence(req, res, next)
    default:
      res.status(400)
      return next(error)
  }
}

// make sure the target carousel record existed
function ensureValidTargetCarousel (req, res, next) {
  if (!req.targetCarousel) {
    res.status(400)
    let error = new Error(`Target carousel (id: ${parseInt(req.params.carouselId)}) does not exist`)
    return next(error)
  }
  return next()
}

// get record count of full records
function getRecordCount () {
  return db.Carousels.findAndCountAll()
    .then(results => Promise.resolve(results.count))
    .catch(error => Promise.reject(error))
}

// get the target carousel
function findTarget (source = 'params', failIfNotExist = false, failIfUndeclared = false) {
  return (req, res, next) => {
    let targetCarouselId = null
    if (!('carouselId' in req[source])) {
      if (failIfUndeclared) {
        res.status(400)
        let error = new Error(`Target carouselId must be declared at req.${source}`)
        return next(error)
      }
      req.targetCarouselId = null
      req.targetCarousel = null
      return next()
    } else {
      targetCarouselId = parseInt(req[source].carouselId)
      return db.Carousels
        .findById(targetCarouselId)
        .then(targetCarousel => {
          if (!targetCarousel && failIfNotExist) {
            res.status(400)
            let error = new Error(`Target product (id: ${targetCarouselId}) does not exist`)
            return Promise.reject(error)
          }
          req.targetCarouselId = targetCarousel ? targetCarouselId : null
          req.targetCarousel = targetCarousel || null
          next()
          return Promise.resolve()
        })
        .catch(error => next(error))
    }
  }
}

// insert one carousel image and data
function insertRecord (req, res, next) {
  let uploadedImage = req.file
  // get the necessary data first
  return Promise.all([
    fs.readFile(uploadedImage.path)
      .catch(error => Promise.reject(error)),
    getRecordCount()
      .catch(error => Promise.reject(error))
  ]).spread((bufferedImage, recordCount) => {
    // create carousel from data
    return db.Carousels.create({
      id: req.nextAvailableId,
      displaySequence: recordCount,
      originalName: uploadedImage.originalname,
      encoding: uploadedImage.encoding,
      mimeType: uploadedImage.mimetype,
      size: uploadedImage.size,
      data: processExif(bufferedImage)
    }).catch(error => Promise.reject(error))
  }).then(newCarousel => {
    req.created = Object.assign({ carouselId: newCarousel.id }, newCarousel)
    next()
    return Promise.resolve()
  }).catch(error => next(error))
}

// find the next available id value in the carousel table (integer)
function nextAvailableId (req, res, next) {
  let nextAvailableId = 0
  return db.Carousels
    .findAll({ attributes: ['id'] })
    .map(carousels => carousels.id)
    .then(carouselIds => {
      // loop through and find the next available unused id
      while (carouselIds.indexOf(nextAvailableId) !== -1) {
        nextAvailableId++
      }
      req.nextAvailableId = nextAvailableId
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}

// patch displaySequence and adjust all affected siblings accordingly
function patchDisplaySequence (req, res, next) {
  let targetCarousel = req.targetCarousel
  let a = req.originalPosition
  let b = req.targetPosition
  return db.sequelize.transaction(transaction => {
    let trxObj = { transaction }
    // update the affected siblings
    return db.Carousels
      .update({
        displaySequence: a > b
          ? db.sequelize.literal('`displaySequence` + 1')
          : db.sequelize.literal('`displaySequence` - 1')
      }, {
        where: {
          id: { [Op.ne]: targetCarousel.id },
          displaySequence: { [Op.between]: [a > b ? b : a, a > b ? a : b] }
        },
        transaction
      })
      // update target
      .then(() => targetCarousel.update({ displaySequence: b }, trxObj))
      .catch(error => next(error))
  }).then(() => {
    next()
    return Promise.resolve()
  }).catch(error => next(error))
}

// remove exif data from image
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

// send target contact data in the server response 'data' property
function sendTargetData (req, res, next) {
  req.resJson = { data: req.targetCarousel }
  return next()
}
