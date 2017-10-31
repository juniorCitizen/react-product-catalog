import { argv } from 'yargs'
import Promise from 'bluebird'

import db from '../../server/controllers/database/database'
import logging from '../../server/controllers/logging'

require('dotenv').config()

const dbEnv = argv['setting'] || 'development'
const seed = argv['seed'] || 'none'

module.exports = () => {
  let dbConfig = require('../../server/config/database')[dbEnv]
  db.sequelize = new db.Sequelize(dbConfig) // switch out the sequelize instance

  return (done) => {
    if (!checkArgs(dbEnv, seed)) {
      let error = new Error('INVALID_ARGUMENTS')
      error.name = '參數錯誤'
      error.message = `獲取的取參數: dbEnv: ${dbEnv} | seed: ${seed}`
      logging.error(error, error.message)
      return done(error)
    }
    return disableConstraint(dbConfig.dialect)
      .then(() => {
        return db.initialize({ force: true })
      })
      .then((message) => {
        logging.console(`${dbEnv} ${dbConfig.dialect} ${message}`)
        return Promise.resolve()
      })
      .then(() => {
        return enableConstraint(dbConfig.dialect)
      })
      .then(() => {
        return done()
      })
      .catch((error) => {
        enableConstraint(dbConfig.dialect)
          .then(() => {
            logging.error(
              error,
              `${dbEnv} ${dbConfig.dialect} 資料庫重設失敗`
            )
            return done(error)
          })
          .catch((error) => {
            return done(error)
          })
      })
  }
}

function disableConstraint (dialect) {
  let queryString = ''
  switch (dialect) {
    case 'sqlite':
      queryString = 'PRAGMA foreign_keys = OFF;'
      break
    case 'mysql':
      queryString = 'SET FOREIGN_KEY_CHECKS = 0;'
      break
    default:
      return Promise.reject(new Error('INVALID_DB_DIALECT'))
  }
  return db.sequelize
    .query(queryString)
    .then(() => {
      logging.warning('資料庫關聯性控管機制... 已暫停')
      return Promise.resolve()
    })
    .catch((error) => {
      logging.error(error, '暫停資料庫關聯性控管機制失敗')
      return Promise.reject(error)
    })
}

function enableConstraint (dialect) {
  let queryString = ''
  switch (dialect) {
    case 'sqlite':
      queryString = 'PRAGMA foreign_keys = ON;'
      break
    case 'mysql':
      queryString = 'SET FOREIGN_KEY_CHECKS = OFF;'
      break
    default:
      return Promise.reject(new Error('INVALID_DB_DIALECT'))
  }
  return db.sequelize
    .query(queryString)
    .then(() => {
      logging.warning('資料庫關聯性控管機制... 已啟動')
      return Promise.resolve()
    })
    .catch((error) => {
      logging.error(error, '啟動資料庫關聯性控管機制失敗')
      return Promise.reject(error)
    })
}

function checkArgs (dbEnv, seed) {
  if (
    ['development', 'staging', 'production'].indexOf(dbEnv) !== -1 &&
    ['mock', 'mock', 'none'].indexOf(seed) !== -1
  ) {
    return true
  }
}
