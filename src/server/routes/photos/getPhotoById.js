const db = require('../../controllers/database')

module.exports = (() => {
  return [
    (req, res, next) => {
      let id = req.params.photoId.toUpperCase()
      return db.Photos
        .findById(id)
        .then((photo) => {
          if (photo === null) {
            req.resJson = { message: `Photo of id: '${id}' does not exist` }
          } else {
            req.resImage = {
              mimeType: photo.mimeType,
              data: Buffer.from(photo.data)
            }
          }
          next()
          return Promise.resolve()
        })
        .catch(error => next(error))
    }]
})()
