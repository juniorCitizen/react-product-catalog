const db = require('../../controllers/database')
const routerResponse = require('../../controllers/routerResponse')

module.exports = (() => {
  return [
    (req, res) => {
      return db.Photos
        .findById(req.params.photoId.toUpperCase())
        .then((photo) => {
          if (photo === null) {
            return routerResponse.json({
              req, res, statusCode: 200, data: null
            })
          } else {
            return routerResponse.imageBuffer({
              res,
              statusCode: 200,
              mimeType: photo.mimeType,
              dataBuffer: Buffer.from(photo.data)
            })
          }
        })
        .catch((error) => routerResponse.json({
          req,
          res,
          statusCode: 500,
          error: error,
          message: 'photo retrieval failure'
        }))
    }]
})()
