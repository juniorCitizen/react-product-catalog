const db = require('../../controllers/database')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = {
  toSeries: assignPhotoToSeries(),
  toProduct: assignPhotoToProduct()
}

function assignPhotoToProduct () {
  return [validateJwt, (req, res, next) => {
    return db.Photos
      .findById(req.params.photoId.toUpperCase())
      .then(targetRecord => {
        return targetRecord.update({ productId: req.params.productId.toUpperCase() })
      })
      .then(updatedRecord => {
        let data = updatedRecord.dataValues
        delete data.data
        req.resJson = { data }
        next()
        return Promise.resolve()
      })
      .catch(error => next(error))
  }]
}

function assignPhotoToSeries () {
  return [validateJwt, (req, res, next) => {
    return db.Photos
      .findById(req.params.photoId.toUpperCase())
      .then(targetRecord => {
        return targetRecord.update({ seriesId: parseInt(req.params.seriesId) })
      })
      .then(updatedRecord => {
        let data = updatedRecord.dataValues
        delete data.data
        req.resJson = { data }
        next()
        return Promise.resolve()
      })
      .catch(error => next(error))
  }]
}
