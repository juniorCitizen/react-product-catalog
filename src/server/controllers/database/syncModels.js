const Promise = require('bluebird')

const eVars = require('../../config/eVars')
const logging = require('../../controllers/logging')

module.exports = (db) => {
  db.syncOps = []
  db.modelList.forEach((modelName) => {
    db.syncOps.push(db[modelName].sync())
  })
  return Promise
    .each(db.syncOps, (model) => {
      if (eVars.ORM_VERBOSE) logging.console(`${model.name} 資料表同步... 完成`)
    })
    .then(() => {
      logging.console('資料庫同步... 完成')
      return Promise.resolve()
    })
    .catch((error) => {
      logging.error(error, '資料庫同步... 失敗')
    })
}
