const db = require('../../controllers/database')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = [
  validateJwt({ admin: true }),
  (req, res, next) => {
    let id = req.params.photoId.toUpperCase()
    let updateFields = {}
    if ('active' in req.query) updateFields.active = req.query.active === 'true'
    if ('primary' in req.query) updateFields.primary = req.query.primary === 'true'
    if (Object.keys(updateFields).length === 0) {
      res.status(400)
      let error = new Error('Required url query elelments are not found')
      return next(error)
    }
    return db.sequelize
      .transaction(trx => { // start transaction
        // find target instance
        return db.Photos
          .findById(id)
          .then(target => {
            // if setting primary to true, set the related photos' primary to false
            if (('primary' in updateFields) && (updateFields.primary === true)) {
              return db.Photos
                .update({ primary: false }, {
                  where: {
                    id: { [db.Sequelize.Op.ne]: req.params.photoId.toUpperCase() },
                    productId: target.productId
                  }
                })
            } else {
              return Promise.resolve()
            }
          })
          .then(() => db.Photos.update(updateFields, {
            where: { id: req.params.photoId.toUpperCase() }
          }))
      })
      .then(() => db.Photos.findById(req.params.photoId.toUpperCase()))
      .then(updatedRecord => {
        let data = updatedRecord.dataValues
        delete data.data
        req.resJson = { data }
        next()
        return Promise.resolve()
      })
      .catch(error => next(error))
  }
]
