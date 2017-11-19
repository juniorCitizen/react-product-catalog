const db = require('../../controllers/database')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = (() => {
  return [validateJwt, (req, res, next) => {
    return db.sequelize.transaction((trx) => {
      let trxObj = { transaction: trx }
      return db.Carousels
        .findById(parseInt(req.params.carouselId), trxObj)
        .then(targetCarousel => {
          if (!targetCarousel) {
            // id does not exist
            return Promise.resolve(0)
          }
          return db.Carousels
            .update({
              order: db.sequelize.literal('`order`-1')
            }, {
              where: { order: { [db.Sequelize.Op.gt]: targetCarousel.order } },
              transaction: trx
            })
            .then(() => targetCarousel.destroy(trxObj))
            .then(() => db.Carousels.findAll({
              attributes: { exclude: ['data'] },
              order: ['order'],
              transaction: trx
            }))
        })
    }).then((data) => {
      req.resJson = { data }
      req.resJson.message = data === 0
        ? 'Carousel not found'
        : 'Carousel deleted'
      next()
      return Promise.resolve()
    }).catch(error => next(error))
  }]
})()
