const db = require('../../controllers/database')
const routerResponse = require('../../controllers/routerResponse')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = (() => {
  return [validateJwt, (req, res) => {
    return db.Carousels
      .update({
        primary: db.sequelize.literal('NOT `primary`')
      }, {
        where: { id: req.params.carouselId }
      })
      .then(() => {
        return db.Carousels.findById(req.params.carouselId)
      })
      .then(updatedCarouselRecord => routerResponse.json({
        req,
        res,
        statusCode: 200,
        data: {
          id: updatedCarouselRecord.id,
          order: updatedCarouselRecord.order,
          primary: updatedCarouselRecord.primary,
          originalName: updatedCarouselRecord.originalName,
          encoding: updatedCarouselRecord.encoding,
          mimeType: updatedCarouselRecord.mimeType,
          size: updatedCarouselRecord.size
        }
      }))
      .catch(error => routerResponse.json({
        req,
        res,
        statusCode: 500,
        error
      }))
  }]
})()
