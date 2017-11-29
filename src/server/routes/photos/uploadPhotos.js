const del = require('del')
const fs = require('fs-extra')
const piexif = require('piexifjs')
const Promise = require('bluebird')
const uploads = require('multer')({
  dest: require('path').resolve('./uploads'),
  fileFilter: (req, file, cb) => {
    if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|gif|svg|bmp)$/)) {
      return cb(new Error('Only image files are allowed!'), false)
    } else if (file.size > 500000) {
      return cb(new Error('Image size limited to 500kb each'), false)
    }
    return cb(null, true)
  }
})

const uuidV4 = require('uuid/v4')

const db = require('../../controllers/database')
const eVars = require('../../config/eVars')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = [
  validateJwt({ admin: true }),
  uploads.array('photos', eVars.SECONDARY_PHOTO_COUNT_CEILING + 1),
  (req, res, next) => {
    let photoIdList = []
    return db.sequelize.transaction(trx => Promise
      .each(req.files.map(photo => {
        return fs
          .readFile(photo.path)
          .then(bufferedPhoto => Promise.resolve(processExif(bufferedPhoto)))
      }), (photoData, index) => {
        photoIdList.push(uuidV4().toUpperCase())
        return db.Photos
          .create({
            id: photoIdList[index],
            originalName: req.files[index].originalname,
            encoding: req.files[index].encoding,
            mimeType: req.files[index].mimetype,
            size: req.files[index].size,
            data: photoData
          }, { transaction: trx }).catch(error => next(error))
      }))
      .then(() => db.Photos.findAll({ where: { id: { [db.Sequelize.Op.in]: photoIdList } } }))
      .map(photo => photo.id)
      .then(data => {
        req.resJson = { data }
        next()
        return del(['./uploads/*'])
      }).catch(error => next(error))
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
