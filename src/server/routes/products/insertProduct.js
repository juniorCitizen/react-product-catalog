const multer = require('multer')

const db = require('../../controllers/database')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = [
  validateJwt({ admin: true }),
  multer().none(),
  (req, res, next) => db.Products
    .create({
      code: req.body.code,
      name: req.body.name,
      specification: req.body.specification || null,
      description: req.body.description || null,
      active: req.params.seriesId !== undefined,
      seriesId: req.params.seriesId || null
    })
    .then(newRecord => db.Products.findById(newRecord.id))
    .then(data => {
      req.resJson = { data }
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
]
