import { argv } from 'yargs'
import Promise from 'bluebird'

import db from '../../server/controllers/database/database'
import logging from '../../server/controllers/logging'

require('dotenv').config()

const databaseSetting = argv['setting'] || 'development'

module.exports = () => {
  let dbConfig = require('../../server/config/database')[databaseSetting]
  db.sequelize = new db.Sequelize(dbConfig) // switch out the sequelize instance

  return (done) => {
    return disableConstraint(dbConfig.dialect)
      .then(() => {
        return db
          .initialize({ force: true })
      })
      .then((message) => {
        logging.console(`${databaseSetting} ${dbConfig.dialect} ${message}`)
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
              `${databaseSetting} ${dbConfig.dialect} 資料庫重設失敗`
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
