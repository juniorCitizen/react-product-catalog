const db = require('../../controllers/database')
const routerResponse = require('../../controllers/routerResponse')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = (() => {
  return [validateJwt, (req, res) => {
    return db.sequelize.transaction((trx) => {
      let trxObj = { transaction: trx }
      return db.Carousels
        .findById(req.params.carouselId, trxObj)
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
      return routerResponse.json({
        req, res, statusCode: 200, data
      })
    }).catch(error => routerResponse.json({
      req, res, statusCode: 500, error
    }))
  }]
})()
