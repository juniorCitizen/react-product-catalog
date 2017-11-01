import { argv } from 'yargs'
import Promise from 'bluebird'

import db from '../../../server/controllers/database/database'
import logging from '../../../server/controllers/logging'

require('dotenv').config()

const dbEnv = argv['setting'] || 'development'
const seed = argv['seed'] || false

// let countries = require('../mockData/countries')
let labels = require('./labels')
// let offices = require('../mockData/offices')
let photos = require('./photos')
let products = require('./products')
let series = require('./series')
let tags = require('./tags')
// let users = require('../mockData/users')

module.exports = () => {
  return (done) => {
    // validate arguments
    if (!checkArgs(dbEnv)) {
      let error = new Error('INVALID_ARGUMENTS')
      error.name = '參數錯誤'
      error.message = `獲取的取參數: dbEnv: ${dbEnv} | seed: ${seed}`
      logging.error(error, error.message)
      return done(error)
    }
    // get database configuration
    let dbConfig = require('../../../server/config/database')[dbEnv]
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
        if (!seed) {
          logging.warning('資料庫淨空完畢，未載入資料...')
          return done()
        } else {
          logging.warning('裝載基礎/預設資料...')
          return series(db.Series)
            .then(seriesIdList => products(db.Products, seriesIdList))
            .then(() => tags(db.Tags))
            .then(() => labels(db.Products, db.Tags))
            .then(() => photos(db.Photos, db.Products))
            .then(() => {
              logging.warning('資料庫重設，並已完成預設資料載入...')
              return done()
            })
            .catch((error) => {
              logging.error(error, '預設資料載入失敗...')
              return Promise.reject(error)
            })
          // // 建立產品系列資料
          // return db.Series.bulkCreate(series())
          //   .then(() => {
          //     // 查詢產品系列資料筆數
          //     return db.Series.findAndCount()
          //   })
          //   .then((seriesCount) => {
          //     // 建立產品資料
          //     return db.Products.bulkCreate(products(seriesCount.count))
          //   })
          //   .then(() => {
          //     // 建立產品標題項目
          //     return db.Tags.bulkCreate(tags())
          //   })
          //   .then(() => {
          //     // 查詢產品以及產品標題項目資料
          //     return Promise
          //       .all([
          //         db.Products.findAll(),
          //         db.Tags.findAll()
          //       ])
          //   })
          //   .spread(labels)
          //   .then(() => {
          //     return Promise.resolve()
          //   })
          //   .then(() => {
          //     // TODO // 'default' data generation script
          //     return Promise.resolve()
          //   })
          //   .then(() => {
          //   })
        }
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
      queryString = 'SET FOREIGN_KEY_CHECKS = 1;'
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
function checkArgs (dbEnv) {
  if (['development', 'staging', 'production'].indexOf(dbEnv) !== -1) {
    return true
  }
}
