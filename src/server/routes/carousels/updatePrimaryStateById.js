const db = require('../../controllers/database')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = (() => {
  return [validateJwt, (req, res, next) => {
    let id = parseInt(req.params.carouselId)
    return db.sequelize.transaction(trx => {
      return db.Carousels.findById(id) // find the target
        .then(targetRecord => {
          if (targetRecord === null) {
            return Promise.resolve()// return immediately if target not found
          } else { // found target record
            // update all primary to false
            return db.Carousels.update(
              { primary: false },
              { where: {}, transaction: trx }
            )
              .then(() => {
                // update target primary to true
                return db.Carousels.update(
                  { primary: true },
                  { where: { id }, transaction: trx }
                )
              })
          }
        })
    }).then(() => {
      return db.Carousels.findById(id, {
        attributes: { exclude: ['data'] }
      })
    }).then((data) => {
      req.resJson = { data }
      next()
      return Promise.resolve()
    }).catch(error => next(error))
  }]
})()
