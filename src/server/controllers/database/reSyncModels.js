const logging = require('../logging')

module.exports = (db, force = null) => {
  return db.sequelize
    .sync(force ? { force: true } : { force: false })
    .then(logging.resolve(`資料庫${force ? '強制刷新並' : ''}重新同步... 完成`))
    .catch(logging.reject('資料庫重新同步... 失敗'))
}
