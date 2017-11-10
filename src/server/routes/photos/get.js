const db = require('../../controllers/database')
const routerResponse = require('../../controllers/routerResponse')

module.exports = (req, res) => {
  return db.Photos
    .findById(req.query.photoId)
    .then((photo) => {
      if (photo === null) { // promise is rejected if the photoId does not exist
        let error = new Error('image not found')
        error.name = 'imageIdNotFound'
        return Promise.reject(error)
      } else {
        return routerResponse.streamImage({
          pendingResponse: res,
          statusCode: 200,
          mimeType: photo.mimeType,
          dataBuffer: Buffer.from(photo.data)
        })
      }
    })
    .catch((error) => {
      console.log(error.name)
      console.log(error.message)
      console.log(error.stack)
      return routerResponse.json({
        pendingResponse: res,
        originalRequest: req,
        statusCode: 500,
        success: false,
        error: error,
        message: 'photo retrieval failure'
      })
    })
}
