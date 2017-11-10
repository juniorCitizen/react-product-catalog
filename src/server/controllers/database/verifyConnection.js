const logging = require('../logging')

module.exports = (db) => {
  return db.sequelize
    .authenticate()
    .then(() => {
      logging.console('資料庫連線驗證... 成功')
      return Promise.resolve()
    })
    .catch((error) => {
      logging.error(error, '資料庫連線驗證... 失敗')
      return Promise.reject(error)
    })
}
