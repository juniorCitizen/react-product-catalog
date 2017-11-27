const Promise = require('bluebird')

const eVars = require('../../config/eVars')
const logging = require('../logging')

module.exports = (db, force = null) => {
  db.syncOps = []
  db.modelList.forEach((modelName) => {
    db.syncOps.push(
      db[modelName]
        .sync(force ? { force: true } : { force: false })
        .catch(logging.reject)
    )
  })
  return Promise
    .each(db.syncOps, (model) => {
      if (eVars.ORM_VERBOSE) {
        logging.console(`${model.name} 資料表${force ? '強制刷新並' : ''}同步... 完成`)
      }
    })
    .then(() => {
      logging.console(`資料庫${force ? '強制刷新並' : ''}同步... 完成`)
      return Promise.resolve()
    })
    .catch(logging.reject('資料庫同步... 失敗'))
}
