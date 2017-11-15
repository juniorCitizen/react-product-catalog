const db = require('../../controllers/database')
const routerResponse = require('../../controllers/routerResponse')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = {
  toSeries: assignPhotoToSeries(),
  toProduct: assignPhotoToProduct()
}

function assignPhotoToProduct () {
  return [validateJwt, (req, res) => {
    return db.Photos
      .findById(req.params.photoId.toUpperCase())
      .then((targetRecord) => {
        return targetRecord.update({ productId: req.params.productId })
      })
      .then((updatedRecord) => {
        let data = updatedRecord.dataValues
        delete data.data
        return routerResponse.json({
          req, res, statusCode: 200, data
        })
      })
      .catch(error => routerResponse.json({
        req,
        res,
        statusCode: 500,
        error,
        message: `failure to assign photo to a product`
      }))
  }]
}

function assignPhotoToSeries () {
  return [validateJwt, (req, res) => {
    return db.Photos
      .findById(req.params.photoId.toUpperCase())
      .then((targetRecord) => {
        return targetRecord.update({ seriesId: req.params.seriesId })
      })
      .then((updatedRecord) => {
        let data = updatedRecord.dataValues
        delete data.data
        return routerResponse.json({
          req, res, statusCode: 200, data
        })
      })
      .catch(error => routerResponse.json({
        req,
        res,
        statusCode: 500,
        error,
        message: `failure to assign photo to a series`
      }))
  }]
}
