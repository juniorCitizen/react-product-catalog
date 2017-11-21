const db = require('../../controllers/database')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = (() => {
  return [validateJwt, (req, res, next) => {
    return db.Carousels
      .update({
        primary: db.sequelize.literal('NOT `primary`')
      }, {
        where: { id: req.params.carouselId }
      })
      .then(() => {
        return db.Carousels.findById(req.params.carouselId)
      })
      .then(updatedCarouselRecord => {
        req.resJson = {
          data: {
            id: updatedCarouselRecord.id,
            order: updatedCarouselRecord.order,
            primary: updatedCarouselRecord.primary,
            originalName: updatedCarouselRecord.originalName,
            encoding: updatedCarouselRecord.encoding,
            mimeType: updatedCarouselRecord.mimeType,
            size: updatedCarouselRecord.size
          }
        }
        next()
        return Promise.resolve()
      })
      .catch(error => next(error))
  }]
})()
