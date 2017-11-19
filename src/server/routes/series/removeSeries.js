const db = require('../../controllers/database')

const validateJwt = require('../../middlewares/validateJwt')
const setBaseQueryParameters = require('../../middlewares/setQueryBaseOptions')('series')
const setResponseDetailLevel = require('../../middlewares/setResponseDetailLevel')('series')

const queryString = `UPDATE \`series\` SET \`order\` = \`order\` - 1 WHERE \`order\` > :targetPosition;`

module.exports = (() => {
  return [
    validateJwt,
    setBaseQueryParameters,
    setResponseDetailLevel,
    (req, res, next) => {
      if (res.statusCode >= 400) return next()
      let targetPosition = null
      return db.sequelize
        .transaction((trx) => {
          let trxObj = { transaction: trx }
          return db.Series
            .findById(req.params.seriesId)
            .then((targetRecord) => {
              if (targetRecord) {
                // recording target's original ordering position
                targetPosition = targetRecord.order
                // delete target record
                return targetRecord
                  .destroy(trxObj)
                  .catch(error => next(error))
              } else {
                // if targetRecord is null (no such record found)
                return Promise.resolve()
              }
            })
            .then(() => {
              // advance affected records
              // records with 'order' value larger then the target
              return db.sequelize
                .query(queryString, {
                  replacements: { targetPosition: targetPosition },
                  transaction: trx
                })
                .catch(error => next(error))
            })
        }).then(() => {
          return db.Series
            .findAll(req.queryOptions)
            .catch(error => next(error))
        }).then((data) => {
          req.resJson = { data }
          return next()
        }).catch(error => next(error))
    }]
})()
