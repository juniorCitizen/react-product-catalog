const db = require('../../controllers/database')
// const logging = require('../../controllers/logging')
const routerResponse = require('../../controllers/routerResponse')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = (() => {
  return [validateJwt, (req, res) => {
    return db.sequelize.transaction((trx) => {
      let trxObj = { transaction: trx }
      return db.Carousels.findById(req.params.carouselId, trxObj)
        .then(targetCarousel => {
          if (!targetCarousel) {
            return Promise.resolve()
          }
          return db.Carousels.update(
            { order: db.sequelize.literal('`order`-1') },
            {
              where: { order: { [db.Sequelize.Op.gt]: targetCarousel.order } },
              transaction: trx
            }
          ).then(() => {
            return targetCarousel.destroy(trxObj)
          })
        })
    }).then(() => routerResponse.json({
      req, res, statusCode: 200
    })).catch(error => routerResponse.json({
      req, res, statusCode: 500, error
    }))
  }]
})()
