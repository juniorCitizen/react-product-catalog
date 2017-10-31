const logging = require('../../controllers/logging')

module.exports = (db) => {
  return db.sequelize
    .sync()
    .then(() => {
      logging.console('資料庫重新同步... 完成')
      return Promise.resolve()
    })
    .catch((error) => {
      logging.error(error, '資料庫重新同步... 失敗')
    })
}
