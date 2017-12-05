const db = require('../../controllers/database')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = [
  validateJwt({ admin: true }),
  (req, res, next) => {
    return db.sequelize.transaction((trx) => {
      let trxObj = { transaction: trx }
      return db.Carousels
        .findById(parseInt(req.params.carouselId), trxObj)
        .then(targetCarousel => {
          if (!targetCarousel) return Promise.resolve(0) // id does not exist
          return db.Carousels
            .update({
              displaySequence: db.sequelize.literal('`displaySequence`-1')
            }, {
              where: { displaySequence: { [db.Sequelize.Op.gt]: targetCarousel.displaySequence } },
              transaction: trx
            })
            .then(() => targetCarousel.destroy(trxObj))
            .then(() => Promise.resolve(1))
        })
    }).then((data) => {
      req.resJson = { data }
      next()
      return Promise.resolve()
    }).catch(error => next(error))
  }
]
