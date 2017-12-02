const Promise = require('bluebird')

const db = require('../../controllers/database')
const validateJwt = require('../../middlewares/validateJwt')

const patchingFunctions = {
  name: patchName,
  displaySequence: patchDisplaySequence,
  active: patchActive,
  parentSeriesId: patchParentSeriesId
}

module.exports = [
  validateJwt({ admin: true }),
  (req, res, next) => {
    // checking for request elements
    if (req.query === undefined) {
      res.status(400)
      let error = new Error('Request does not contain elements for patching update')
      return next(error)
    }
    // checking for illegal field patching
    if ('menuLevel' in req.query) {
      res.status(400)
      let error = new Error('menuLevel is not to be patched directly')
      return next(error)
    }
    if ('name' in req.query) return patchingFunctions['name'](req, res, next)
    else if ('active' in req.query) return patchingFunctions['active'](req, res, next)
    else if ('displaySequence' in req.query) return patchingFunctions['displaySequence'](req, res, next)
    else if ('parentSeriesId' in req.query) return patchingFunctions['parentSeriesId'](req, res, next)
    else {
      res.status(400)
      let error = new Error('Existing elements in the request does not contain any of the expected elements to patch')
      return next(error)
    }
  }
]

function patchName (req, res, next) {
  return db.Series
    .update(
      { name: req.query.name },
      { where: { id: req.params.seriesId.toUpperCase() } }
    )
    .then(() => db.Series.findById(req.params.seriesId.toUpperCase()))
    .then(data => {
      req.resJson = { data }
      next()
      return Promise.resolve()
    }).catch(error => next(error))
}

function patchActive (req, res, next) {
  return db.Series
    .update(
      { active: req.query.active },
      { where: { id: req.params.seriesId.toUpperCase() } }
    )
    .then(() => db.Series.findById(req.params.seriesId.toUpperCase()))
    .then(data => {
      req.resJson = { data }
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}

function patchDisplaySequence (req, res, next) {
  let targetSeriesId = req.params.seriesId.toUpperCase()
  let parentSeriesId = null
  let originalPosition = null
  let targetPosition = parseInt(req.query.displaySequence)
  return db.Series
    .findById(targetSeriesId) // find the target record
    .then(series => {
      if (!series) { // record does not exist
        res.status(400)
        let error = new Error(`'seriesId '${targetSeriesId}' does not exist`)
        return Promise.reject(error)
      } else {
        originalPosition = series.displaySequence
        parentSeriesId = series.parentSeriesId
        return db.Series.findAll({ where: { parentSeriesId } })
      }
    })
    .catch(error => next(error))
    .then(siblings => {
      // limit target position according to the sibling count
      if (targetPosition >= siblings.length) targetPosition = siblings.length - 1
      if (targetPosition < 0) targetPosition = 0
      // find siblings include the target of the same parent series
      // where order is between(and include) original and target position
      return db.Series.findAll({
        where: {
          parentSeriesId: parentSeriesId,
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
            if (sibling.id !== targetSeriesId) {
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
            if (sibling.id !== targetSeriesId) {
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
    .then(() => db.Series.findById(targetSeriesId))
    .then(data => {
      req.resJson = { data }
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}

function patchParentSeriesId (req, res, next) {
  let targetSeriesId = req.params.seriesId.toUpperCase()
  let targetParentSeriesId = req.query.parentSeriesId
  let originalParentSeriesId = null
  let originalPosition = null
  return db.Series
    // find the target record
    .findById(targetSeriesId)
    .then(series => {
      if (!series) { // record not found
        res.status(400)
        let error = new Error(`'seriesId' ${targetSeriesId} not found`)
        next(error)
        return Promise.resolve()
      } else {
        originalPosition = series.displaySequence
        originalParentSeriesId = series.parentSeriesId
        return Promise.resolve()
      }
    })
    // find the siblings under the target series
    .then(() => db.Series.findAll({ where: { parentSeriesId: targetParentSeriesId || null } }))
    .then(targetSiblings => db.sequelize.transaction(trx => {
      let orderAdjustQuery = 'UPDATE `series` SET `displaySequence`=`displaySequence`-1 WHERE `parentSeriesId`=:originalParentSeriesId AND `displaySequence`>:originalPosition;'
      let targetUpdateQuery = 'UPDATE `series` SET `displaySequence`=:lastPosition, `parentSeriesId`=:targetParentSeriesId, `menuLevel`=:menuLevel WHERE `id`=:targetSeriesId;'
      return db.sequelize
        .query(orderAdjustQuery, {
          replacements: {
            originalParentSeriesId: originalParentSeriesId,
            originalPosition: originalPosition
          },
          transaction: trx
        })
        .catch(error => next(error))
        .then(() => db.Series.findById(targetParentSeriesId, { transaction: trx }))
        .then(targetParentSeries => db.sequelize
          .query(targetUpdateQuery, {
            replacements: {
              lastPosition: targetSiblings.length,
              targetParentSeriesId: targetParentSeriesId || null,
              targetSeriesId: targetSeriesId,
              menuLevel: (() => {
                return !targetParentSeries ? 0 : targetParentSeries.menuLevel + 1
              })()
            },
            transaction: trx
          })
          .catch(error => next(error)))
    })).catch(error => next(error))
    .then(() => db.Series.findById(targetSeriesId))
    .then(data => {
      req.resJson = { data }
      next()
      return Promise.resolve()
    })
    .catch(error => next(error))
}
