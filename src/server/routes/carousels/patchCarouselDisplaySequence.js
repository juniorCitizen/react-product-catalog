const Promise = require('bluebird')

const db = require('../../controllers/database')

const setQueryBaseOptions = require('../../middlewares/setQueryBaseOptions')('carousels')
const validateJwt = require('../../middlewares/validateJwt')

module.exports = [
  setQueryBaseOptions,
  validateJwt({ staff: true }),
  (req, res, next) => {
    let targetCarouselId = parseInt(req.params.carouselId)
    let originalPosition = null
    let targetPosition = parseInt(req.query.displaySequence)
    return db.Carousels
      .findById(targetCarouselId) // find the target record
      .then(target => {
        if (!target) { // record does not exist
          res.status(400)
          let error = new Error(`carouselId '${targetCarouselId}' does not exist`)
          next(error)
          return Promise.reject(error)
        } else {
          originalPosition = target.displaySequence
          return db.Carousels.findAll()
        }
      })
      .then(siblings => {
        // limit target position according to the sibling count
        if (targetPosition >= siblings.length) targetPosition = siblings.length - 1
        if (targetPosition < 0) targetPosition = 0
        // find siblings where order is between(and include) original and target position
        return db.Carousels.findAll({
          where: {
            displaySequence: {
              [db.Sequelize.Op.between]: [
                originalPosition <= targetPosition ? originalPosition : targetPosition,
                originalPosition <= targetPosition ? targetPosition : originalPosition
              ]
            }
          },
          order: ['displaySequence']
        }).catch(error => next(error))
      })
      .then(affectedSiblings => db.sequelize.transaction(trx => { // start transaction
        let trxObj = { transaction: trx }
        // loop through each sibling series and adjust order value accordingly
        return Promise
          .each(affectedSiblings, sibling => {
            // advancing ordering position
            if (originalPosition < targetPosition) {
              if (sibling.id !== targetCarouselId) {
                return sibling
                  .decrement({ displaySequence: 1 }, trxObj)
                  .catch(error => next(error))
              } else {
                return sibling
                  .update({ displaySequence: targetPosition }, trxObj)
                  .catch(error => next(error))
              }
            }
            // push back ordering position
            if (originalPosition > targetPosition) {
              if (sibling.id !== targetCarouselId) {
                return sibling
                  .increment({ displaySequence: 1 }, trxObj)
                  .catch(error => next(error))
              } else {
                return sibling
                  .update({ displaySequence: targetPosition }, trxObj)
                  .catch(error => next(error))
              }
            }
          }).catch(error => next(error))
      }).catch(error => next(error)))
      .then(() => db.Carousels.findAll({
        attributes: { exclude: 'data' },
        order: ['displaySequence']
      }))
      .then(data => {
        req.resJson = { data }
        next()
        return Promise.resolve()
      })
      .catch(error => next(error))
  }
]
