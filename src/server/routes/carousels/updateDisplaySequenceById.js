const db = require('../../controllers/database')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = (() => {
  return [validateJwt, async (req, res, next) => {
    // get target carousel instance
    let target = await db.Carousels
      .findById(parseInt(req.params.carouselId))
      .catch(error => next(error))
    // get model dataset
    let dataset = await db.Carousels
      .findAll({
        attributes: { exclude: ['data'] },
        order: ['displaySequence']
      })
      .catch(error => next(error))
    let originalPosition = target.displaySequence
    let intendedPosition = parseInt(req.params.displaySequence)
    let targetPosition = getTargetPosition(intendedPosition, dataset.length)
    if (originalPosition === targetPosition) {
      // return the original dataset if the
      // specified displaySequence does not change data
      req.resJson = {
        data: dataset,
        message: `Carousel of id: '${req.params.carouselId}' is already at displaySequence position: '${req.params.displaySequence}'`
      }
      return next()
    }
    return db.sequelize.transaction(trx => { // start transaction
      // determine adjustment parameters and compose query
      let floor = (originalPosition > targetPosition)
        ? targetPosition
        : (originalPosition + 1)
      let ceiling = (originalPosition > targetPosition)
        ? (originalPosition - 1)
        : targetPosition
      let adjustment = (originalPosition > targetPosition)
        ? '+ 1'
        : '- 1'
      let queryString = `UPDATE \`carousels\` SET \`displaySequence\` = \`displaySequence\` ${adjustment} WHERE \`displaySequence\` BETWEEN ${floor} AND ${ceiling};`
      // run the adjustment query
      return db.sequelize
        .query(queryString, { transaction: trx })
        // update target if dataset displaySequence is successfully adjusted
        .then(() => target.update({ displaySequence: targetPosition }, { transaction: trx }))
        .catch(error => next(error))
    }).then(() => {
      // query the new dataset after displaySequence adjustment
      return db.Carousels.findAll({
        attributes: { exclude: ['data'] },
        order: ['displaySequence']
      }).catch(Promise.reject)
    }).then(data => {
      req.resJson = { data }
      next()
      return Promise.resolve()
    }).catch(error => next(error))
  }]
})()

function getTargetPosition (intendedPosition, datasetLength) {
  if (intendedPosition > (datasetLength - 1)) return datasetLength
  if (intendedPosition < 0) return 0
  return intendedPosition
}
