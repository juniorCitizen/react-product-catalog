const db = require('../../controllers/database')
const logging = require('../../controllers/logging')

module.exports = {
  assignPrimaryPhotoToProduct,
  getPhotoById,
  revokePrimaryPhotoStatus
}

// associate a photo to a product and assign it as the primary photo
function assignPrimaryPhotoToProduct (photoId, productId, transaction = null) {
  let queryOptions = transaction
    ? { where: { productId }, transaction }
    : { where: { productId } }
  return db.Photos
    .update({ productId: productId, primary: true }, queryOptions)
    .then(() => Promise.resolve())
    .catch(error => {
      logging.error(error, '/models/queries/photos.assignPrimaryPhotoToProduct() errored')
      return Promise.reject(error)
    })
}

// get photo by id
function getPhotoById (photoId) {
  return db.Photos
    .findById(photoId)
    .then(data => Promise.resolve(data))
    .catch(error => {
      logging.error(error, '/models/queries/photos.getPhotoById() errored')
      return Promise.reject(error)
    })
}

// revoke any primary photos of a particular product
function revokePrimaryPhotoStatus (productId, transaction = null) {
  let queryOptions = transaction
    ? { where: { productId }, transaction }
    : { where: { productId } }
  return db.Photos
    .update({ primary: false }, queryOptions)
    .then(() => Promise.resolve())
    .catch(error => {
      logging.error(error, '/models/queries/photos.revokePrimaryPhotoStatus() errored')
      return Promise.reject(error)
    })
}
