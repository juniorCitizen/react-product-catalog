// const multer = require('multer')

const db = require('../../controllers/database')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = [
  validateJwt({ user: true }),
  (req, res, next) => {
    return db.Contacts
      .findById(req.params.contactId.toUpperCase(), {
        include: {
          model: db.Companies
        }
      })
      .then(data => {
        req.resJson = { data }
        next()
        return Promise.resolve()
      })
      .catch(error => next(error))
  }
]
