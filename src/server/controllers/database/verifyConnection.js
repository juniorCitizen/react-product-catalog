const logging = require('../logging')

module.exports = (db) => {
  return db.sequelize
    .authenticate()
    .then(logging.resolve('資料庫連線驗證... 成功'))
    .catch(logging.reject('資料庫連線驗證... 失敗'))
}
