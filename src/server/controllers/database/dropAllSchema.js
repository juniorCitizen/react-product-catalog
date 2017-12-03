const Promise = require('bluebird')

const logging = require('../logging')

module.exports = (sequelize, dropTableSequence, force = null) => {
  if (force) {
    logging.warning('所有資料表將被依序移除')
    return Promise
      .each(dropTableSequence, targetTableName => {
        return sequelize
          .dropSchema(targetTableName)
          .then(logging.resolve(`${targetTableName} 資料表已移除...`))
          .catch(logging.reject(`${targetTableName} 資料表移除失敗...`))
      })
      .then(logging.resolve('資料表移除作業... 成功'))
      .catch(logging.reject('資料表移除作業... 失敗'))
  } else {
    logging.warning('依照系統設定略過資料表移除程序')
    return Promise.resolve()
  }
}
