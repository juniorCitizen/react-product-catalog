const db = require('../../controllers/database')
const routerResponse = require('../../controllers/routerResponse')
const validateJwt = require('../../middlewares/validateJwt')

const seriesQueryParameters = require('../../models/ormQueryParameters/series')

module.exports = (() => {
  return [validateJwt, (req, res) => {
    let targetPosition = null
    let query = null
    return db.sequelize.transaction((trx) => {
      let trxObj = { transaction: trx }
      if ((req.query.hasOwnProperty('id')) && !(req.query.hasOwnProperty('name'))) {
        // delete by id
        query = db.Series
          .findById(req.query.id, trxObj)
          .catch(error => Promise.reject(error))
      } else if ((req.query.hasOwnProperty('name')) && !(req.query.hasOwnProperty('id'))) {
        // delete by name
        query = db.Series
          .findOne(Object.assign({ where: { name: req.query.name } }, trxObj))
          .catch(error => Promise.reject(error))
      } else if ((req.query.hasOwnProperty('name')) && (req.query.hasOwnProperty('id'))) {
        // if id and name exists at the same time
        let error = Error('name and id url queries cannot co-exist')
        error.name = 'NAME_AND_ID_COEXIST_CONFLICT'
        error.httpStatusCode = 400
        return Promise.reject(error)
      } else {
        // if neither id and name existed
        let error = Error('neither name and id url queries were found')
        error.name = 'NAME_AND_ID_NOT_FOUND'
        error.httpStatusCode = 400
        return Promise.reject(error)
      }
      return query
        .then((targetRecord) => {
          // delete record instance after recording it's original ordering position
          targetPosition = targetRecord.order
          return targetRecord
            .destroy(trxObj)
            .catch(error => Promise.reject(error))
        })
        .then(() => {
          // advance records' record value that were after the deleted target
          let queryString = `
            UPDATE \`series\`
            SET \`order\` = \`order\` - 1
            WHERE \`order\` > :targetPosition;`
          return db.sequelize
            .query(queryString, Object.assign({
              replacements: { targetPosition: targetPosition }
            }, trxObj))
            .catch(error => Promise.reject(error))
        })
    }).then(() => {
      return db.Series.findAll((() => {
        return req.query.hasOwnProperty('details')
          ? seriesQueryParameters.details()
          : seriesQueryParameters.simple()
      })()).catch(error => Promise.reject(error))
    }).then((data) => routerResponse.json({
      req,
      res,
      statusCode: 200,
      data
    })).catch(error => routerResponse.json({
      req,
      res,
      statusCode: error.httpStatusCode || 500,
      error,
      message: 'error removing series record'
    }))
  }]
})()
