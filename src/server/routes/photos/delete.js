const db = require('../../controllers/database')
const routerResponse = require('../../controllers/routerResponse')

module.exports = (req, res) => {
  return db.sequelize
    .transaction((trx) => {
      let trxObj = { transaction: trx }
      return db.Photos
        .findById(req.query.photoId)
        .then((photo) => {
          if (!photo) {
            let error = new Error('image not found')
            error.name = 'imageIdNotFound'
            return Promise.reject(error)
          } else if (photo.primary) {
            let error = new Error('cannot delete a primary photo')
            error.name = 'deletePrimaryNotAllowed'
            return Promise.reject(error)
          } else {
            return db.Photos.findAndCountAll({
              where: {
                id: { $ne: req.query.photoId },
                primary: false
              }
            })
          }
        })
        .then((result) => {
          // console.log(result.rows)
          if (result.count < 2) {
            let error = new Error('must keep at least two secondary photos')
            error.name = 'notEnoughPhotos'
            return Promise.reject(error)
          } else {
            return db.Photos.destroy({
              where: { id: req.query.photoId }
            }, trxObj)
          }
        })
    })
    .then(() => {
      return routerResponse.json({
        pendingResponse: res,
        originalRequest: req,
        statusCode: 200,
        success: true
      })
    })
    .catch((error) => {
      return routerResponse.json({
        pendingResponse: res,
        originalRequest: req,
        statusCode: 500,
        success: false,
        error: error.name,
        message: error.message,
        data: error.stack
      })
    })
}
