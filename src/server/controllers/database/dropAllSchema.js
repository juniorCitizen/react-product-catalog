const Promise = require('bluebird')

const logging = require('../logging')

module.exports = (sequelize, sequence) => {
  logging.warning('所有資料表將被依序移除')
  let actions = []
  sequence.forEach((tableName) => {
    actions.push(
      sequelize
        .dropSchema(tableName)
        .then(() => Promise.resolve(`${tableName} 資料表已移除...`))
    )
  })
  return Promise
    .each(actions, logging.warning)
    .then(() => {
      logging.warning('所有資料表已成功移除')
      return Promise.resolve()
    })
    .catch(logging.reject('資料表刪除失敗'))
}
