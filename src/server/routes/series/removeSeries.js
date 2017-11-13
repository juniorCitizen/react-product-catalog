const db = require('../../controllers/database')
const logging = require('../../controllers/logging')
const routerResponse = require('../../controllers/routerResponse')
const validateJwt = require('../../middlewares/validateJwt')

const setBaseQueryParameters = require('../../middlewares/setQueryBaseOptions')('series')
const setResponseDetailLevel = require('../../middlewares/setResponseDetailLevel')('series')

const queryString = `UPDATE \`series\` SET \`order\` = \`order\` - 1 WHERE \`order\` > :targetPosition;`

module.exports = (() => {
  return [
    validateJwt,
    setBaseQueryParameters,
    setResponseDetailLevel,
    (req, res) => {
      let targetPosition = null
      return db.sequelize
        .transaction((trx) => {
          let trxObj = { transaction: trx }
          return db.Series
            .findById(req.params.seriesId)
            .then((targetRecord) => {
              if (targetRecord) {
                // delete record instance after recording it's original ordering position
                targetPosition = targetRecord.order
                return targetRecord
                  .destroy(trxObj)
                  .catch(logging.reject('failure to delete target series record'))
              } else {
                // if targetRecord is null (no such record found)
                return Promise.resolve()
              }
            })
            .then(() => {
              // advance records' record value that were after the deleted target
              return db.sequelize
                .query(queryString, {
                  replacements: { targetPosition: targetPosition },
                  transaction: trx
                })
                .catch(logging.reject('failure to adjust order values of affected records'))
            })
        }).then(() => {
          return db.Series
            .findAll(req.queryOptions)
            .catch(logging.reject('DELETE operation completed, but couldn\'t retrieve updated dataset'))
        }).then((data) => routerResponse.json({
          req,
          res,
          statusCode: 200,
          data
        })).catch(error => routerResponse.json({
          req,
          res,
          statusCode: 500,
          error,
          message: 'error removing series record'
        }))
    }]
})()
