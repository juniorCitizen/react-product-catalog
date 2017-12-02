const del = require('del')
const fs = require('fs-extra')
const piexif = require('piexifjs')
const uploads = require('multer')({
  dest: require('path').resolve('./uploads'),
  fileFilter: (req, file, cb) => {
    if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|gif|svg|bmp)$/)) {
      return cb(new Error('Only image files are allowed!'), false)
    } else if (file.size > 5000000) {
      return cb(new Error('Image size limited to 5mb each'), false)
    }
    return cb(null, true)
  }
})

const db = require('../../controllers/database')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = [
  validateJwt({ admin: true }),
  uploads.single('image'),
  (req, res, next) => {
    return db.Carousels
      .findAndCountAll()
      .then(results => {
        let uploadedImage = req.file
        return fs
          .readFile(uploadedImage.path)
          .then(bufferedImage => Promise.resolve(processExif(bufferedImage)))
          .then(async photoData => db.Carousels.create({
            id: await nextAvailableId(),
            displaySequence: await nextAvailableValueInSequence(),
            originalName: uploadedImage.originalname,
            encoding: uploadedImage.encoding,
            mimeType: uploadedImage.mimetype,
            size: uploadedImage.size,
            data: photoData,
            active: true
          }))
      })
      .then(newCarousel => {
        req.resJson = {
          data: {
            id: newCarousel.id,
            displaySequence: newCarousel.displaySequence,
            originalName: newCarousel.originalName,
            encoding: newCarousel.encoding,
            mimeType: newCarousel.mimeType,
            size: newCarousel.size,
            active: newCarousel.active
          }
        }
        next()
        return del(['./uploads/*'])
      })
      .catch(error => next(error))
  }
]

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

function nextAvailableId () {
  let nextAvailableId = 0
  return db.Carousels
    .findAll()
    .map(carousels => carousels.id)
    .then(carouselIds => {
      // loop through and find the next available unused id
      while (carouselIds.indexOf(nextAvailableId) !== -1) {
        nextAvailableId++
      }
      return Promise.resolve(nextAvailableId)
    })
    .catch(error => Promise.reject(error))
}

function nextAvailableValueInSequence () {
  return db.Carousels
    .findAndCountAll()
    .then(result => Promise.resolve(result.count))
    .catch(error => Promise.reject(error))
  // deprecated
  //   let nextAvailableValueInSequence = 0
  //   return db.Carousels
  //     .findAll()
  //     .map(carousels => carousels.displaySequence)
  //     .then(sequenceList => {
  //       // loop through and find the next available displaySequence value
  //       while (sequenceList.indexOf(nextAvailableValueInSequence) !== -1) {
  //         nextAvailableValueInSequence++
  //       }
  //       return Promise.resolve(nextAvailableValueInSequence)
  //     })
  //     .catch(error => Promise.reject(error))
}

// deprecated
// function prepImageData (req, res, next) {
//   let uploadedImage = req.file
//   if (!uploadedImage) {
//     res.status(400)
//     let error = new Error('No image uploaded')
//     return next(error)
//   }
//   return fs
//     .readFile(uploadedImage.path)
//     .then(async bufferedImage => {
//       fs.remove(uploadedImage.path)
//         .catch(error => logging.error(error, 'carousel temp file removal failure...'))
//       req.imageData = {
//         id: await nextAvailableId(),
//         displaySequence: await nextAvailableValueInSequence(),
//         primary: false,
//         originalName: uploadedImage.originalname,
//         encoding: uploadedImage.encoding,
//         mimeType: uploadedImage.mimetype,
//         size: uploadedImage.size,
//         data: Buffer.from(piexif.remove(bufferedImage.toString('binary')), 'binary')
//       }
//       next()
//       return Promise.resolve()
//     })
//     .catch(error => next(error))
// }
