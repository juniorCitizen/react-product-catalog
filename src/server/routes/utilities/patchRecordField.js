const db = require('../../controllers/database')

const validateJwt = require('../../middlewares/validateJwt')
const validatePatchingField = require('../../middlewares/validatePatchingField')

module.exports = [
  validateJwt({ admin: true }),
  validatePatchingField,
  (req, res, next) => {
    let { model, id, field, value } = req.patchingData
    return db[model].findById(id)
      .then(record => {
        if (!record) {
          res.status(400)
          let error = new Error(`Record '${id}' is not found in '${model}' `)
          return next(error)
        }
        record[field] = value
        return record.save()
      })
      .then(() => db[model].findById(id))
      .then((data) => {
        req.resJson = { data }
        next()
        return Promise.resolve()
      })
      .catch(error => next(error))
  }
]
