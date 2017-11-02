const Promise = require('bluebird')

const logging = require('../../controllers/logging')

module.exports = (sequelize) => {
  logging.warning('所有資料表將被依序移除')
  let sequence = [
    'users',
    'offices',
    'countries',
    'interests',
    'registrations',
    'labels',
    'tags',
    'photos',
    'products',
    'series'
  ]
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
