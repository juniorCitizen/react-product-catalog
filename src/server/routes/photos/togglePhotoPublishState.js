const db = require('../../controllers/database')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = (() => {
  return [validateJwt, (req, res, next) => {
    return db.Photos
      .findById(req.params.photoId.toUpperCase())
      .then((targetRecord) => {
        return targetRecord.update({
          publish: !targetRecord.publish
        })
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
})()
