const Promise = require('bluebird')

const logging = require('../logging')

module.exports = (db, force = null) => {
  return Promise.each(db.modelList, targetSyncModelName => {
    return db[targetSyncModelName]
      .sync(force ? { force: true } : { force: false })
      .then(logging.resolve(`${db[targetSyncModelName].name} 資料表${force ? '強制刷新並' : ''}同步... 完成`))
      .catch(logging.reject(`${targetSyncModelName} 資料表模板同步失敗`))
  })
    .then(logging.resolve(`資料庫${force ? '強制刷新並' : ''}同步... 完成`))
    .catch(logging.reject('資料庫同步... 失敗'))
}
