const db = require('../../controllers/database')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = [
  validateJwt({ staff: true }),
  (req, res, next) => {
    let targetCarouselId = parseInt(req.params.carouselId)
    return db.sequelize.transaction((trx) => {
      let trxObj = { transaction: trx }
      return db.Carousels
        .findById(targetCarouselId, trxObj)
        .then(targetCarousel => {
          if (!targetCarousel) { // id does not exist
            res.status(400)
            let error = new Error(`carouselId ${targetCarouselId} does not exist`)
            return Promise.reject(error)
          }
          return db.Carousels
            .update({
              displaySequence: db.sequelize.literal('`displaySequence`-1')
            }, {
              where: { displaySequence: { [db.Sequelize.Op.gt]: targetCarousel.displaySequence } },
              transaction: trx
            })
            .then(() => targetCarousel.destroy(trxObj))
        })
    }).then(() => {
      let message = `carouselId ${targetCarouselId} removed successfully`
      req.resJson = { message }
      next()
      return Promise.resolve()
    }).catch(error => next(error))
  }
]
