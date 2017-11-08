const path = require('path')
const Promise = require('bluebird')

require('dotenv').config()

const accessPath = process.env.NODE_ENV === 'development'
  ? path.resolve('./src/server')
  : path.resolve('./dist')

const logging = require(path.join(accessPath, 'controllers/logging'))

module.exports = (sequelize, sequence) => {
  logging.warning('所有資料表將被依序移除')
  let actions = []
  sequence.forEach((tableName) => {
    actions.push(
      sequelize
        .dropSchema(tableName)
        .then(() => {
          return Promise.resolve(`${tableName} 資料表已移除...`)
        })
    )
  })
  return Promise
    .each(actions, (message) => {
      logging.warning(message)
    })
    .then(() => {
      logging.warning('所有資料表已成功移除')
      return Promise.resolve()
    })
    .catch(error => {
      logging.error(error, 'controllers/database/database.js initialize() {db.sequelize.dropAllSchemas()} errored')
      return Promise.reject(error)
    })
}
