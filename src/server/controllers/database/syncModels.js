const path = require('path')
const Promise = require('bluebird')

require('dotenv').config()

const accessPath = process.env.NODE_ENV === 'development'
  ? path.resolve('./src/server')
  : path.resolve('./dist')

const eVars = require(path.join(accessPath, 'config/eVars'))
const logging = require(path.join(accessPath, 'controllers/logging'))

module.exports = (db, force = null) => {
  db.syncOps = []
  db.modelList.forEach((modelName) => {
    db.syncOps.push(
      db[modelName]
        .sync(force ? { force: true } : { force: false })
        .catch((error) => {
          logging.error(error)
          return Promise.reject(error)
        })
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
    .catch((error) => {
      logging.error(error, '資料庫同步... 失敗')
    })
}
