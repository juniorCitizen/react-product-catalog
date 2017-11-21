const db = require('../../controllers/database')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = (() => {
  return [
    validateJwt,
    (req, res, next) => {
      return db.Photos
        .destroy({ where: { id: req.params.photoId.toUpperCase() } })
        .then(data => {
          req.resJson = { data }
          next()
          return Promise.resolve()
        })
        .catch(error => next(error))
    }]
})()
