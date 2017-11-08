const path = require('path')

require('dotenv').config()

const accessPath = process.env.NODE_ENV === 'development'
  ? path.resolve('./src/server')
  : path.resolve('./dist')

const logging = require(path.join(accessPath, 'controllers/logging'))

module.exports = (db, force = null) => {
  return db.sequelize
    .sync(force ? { force: true } : { force: false })
    .then(() => {
      logging.console(`資料庫${force ? '強制刷新並' : ''}重新同步... 完成`)
      return Promise.resolve()
    })
    .catch((error) => {
      logging.error(error, '資料庫重新同步... 失敗')
    })
}
