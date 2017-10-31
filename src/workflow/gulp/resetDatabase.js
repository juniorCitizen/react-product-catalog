import { argv } from 'yargs'
import Promise from 'bluebird'

import db from '../../server/controllers/database/database'
import logging from '../../server/controllers/logging'

require('dotenv').config()

const dbEnv = argv['setting'] || 'development'
const seed = argv['seed'] || 'none'

module.exports = () => {
  return (done) => {
    // validate arguments
    if (!checkArgs(dbEnv, seed)) {
      let error = new Error('INVALID_ARGUMENTS')
      error.name = '參數錯誤'
      error.message = `獲取的取參數: dbEnv: ${dbEnv} | seed: ${seed}`
      logging.error(error, error.message)
      return done(error)
    }
    // get database configuration
    let dbConfig = require('../../server/config/database')[dbEnv]
    // switch out the sequelize instance
    db.sequelize = new db.Sequelize(dbConfig)
    // start the reset process with disabling the database constraints
    return disableConstraint(dbConfig.dialect)
      .then(() => {
        // initialize an empty database
        return db.initialize({ force: true })
      })
      .then((message) => {
        logging.console(`${dbEnv} ${dbConfig.dialect} ${message}`)
        // re-enable database constraint
        return enableConstraint(dbConfig.dialect)
      })
      .then(() => {
        if (seed === 'none') {
          // if cmd arg is empty or none, skip the data generation part the script
          return done()
        } else {
          // continue with the script
          return Promise.resolve()
        }
      })
      .then(() => {
        // TODO // 'default' data generation script
        return Promise.resolve()
      })
      .then(() => {
        if (seed === 'default') {
          // if cmd arg is 'default', skip the mock data generation
          return done()
        } else {
          // continue with the script
          return Promise.resolve()
        }
      })
      .then(() => {
        // TODO // 'mock' data generation script
        return Promise.resolve()
      })
      .then(() => {
        return done()
      })
      .catch((error) => {
        // in case of error, enable the database constraints first
        enableConstraint(dbConfig.dialect)
          .then(() => {
            logging.error(error, `${dbEnv} ${dbConfig.dialect} 資料庫重設失敗`)
            return done(error)
          })
          .catch((error) => {
            return done(error)
          })
      })
  }
}

// disable constraint function
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

// enable constraint function
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

// function to validate command line argument
function checkArgs (dbEnv, seed) {
  if (
    ['development', 'staging', 'production'].indexOf(dbEnv) !== -1 &&
    ['mock', 'mock', 'none'].indexOf(seed) !== -1
  ) {
    return true
  }
}
