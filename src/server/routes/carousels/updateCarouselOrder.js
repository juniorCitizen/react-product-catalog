const db = require('../../controllers/database')
const logging = require('../../controllers/logging')
const routerResponse = require('../../controllers/routerResponse')

const validateJwt = require('../../middlewares/validateJwt')

module.exports = (() => {
  return [validateJwt, async (req, res) => {
    let target = await getTarget(req.params.carouselId)
    let dataset = await getDataset(db.Carousels)
    let originalPosition = target.order
    let intendedPosition = parseInt(req.params.order)
    let targetPosition = getTargetPosition(intendedPosition, dataset.length)
    if (originalPosition === targetPosition) {
      return routerResponse.json({
        req, res, statusCode: 200, data: dataset
      })
    }
    return db.sequelize.transaction(trx => {
      let floor = (originalPosition > targetPosition)
        ? targetPosition
        : (originalPosition + 1)
      let ceiling = (originalPosition > targetPosition)
        ? (originalPosition - 1)
        : targetPosition
      let adjustment = (originalPosition > targetPosition)
        ? '+ 1'
        : '- 1'
      let queryString = `UPDATE \`carousels\` SET \`order\` = \`order\` ${adjustment} WHERE \`order\` BETWEEN ${floor} AND ${ceiling};`
      return db.sequelize
        .query(queryString, { transaction: trx })
        .then(() => target.update({ order: targetPosition }, { transaction: trx }))
        .catch(logging.reject)
    }).then(() => getDataset(db.Carousels))
      .then(data => routerResponse.json({
        req, res, statusCode: 200, data
      })).catch(error => routerResponse.json({
        req,
        res,
        statusCode: 500,
        error,
        message: 'error reordering carousels'
      }))
  }]
})()

function getTarget (id) {
  return db.Carousels
    .findById(id)
    .then(targetRecord => Promise.resolve(targetRecord))
    .catch(logging.reject)
}

function getDataset (model) {
  return model
    .findAll({
      attributes: { exclude: ['data'] },
      order: ['order']
    })
    .then(dataset => Promise.resolve(dataset))
    .catch(logging.reject)
}

function getTargetPosition (intendedPosition, datasetLength) {
  if (intendedPosition > (datasetLength - 1)) return datasetLength
  if (intendedPosition < 0) return 0
  return intendedPosition
}
