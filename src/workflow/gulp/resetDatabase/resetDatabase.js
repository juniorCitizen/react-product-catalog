import { argv } from 'yargs'
import path from 'path'
import Promise from 'bluebird'

const db = require(path.resolve('./src/server/controllers/database/database.js'))
const logging = require(path.resolve('./src/server/controllers/logging.js'))

require('dotenv').config()

const dbEnv = argv['setting'] || 'development'
const seed = argv['seed'] || false

let carousels = require(path.resolve(path.join(__dirname, 'carousels.js')))
let countries = require(path.resolve(path.join(__dirname, 'countries.js')))
let labels = require(path.resolve(path.join(__dirname, 'labels.js')))
let offices = require(path.resolve(path.join(__dirname, 'offices.js')))
let photos = require(path.resolve(path.join(__dirname, 'photos.js')))
let products = require(path.resolve(path.join(__dirname, 'products.js')))
let series = require(path.resolve(path.join(__dirname, 'series.js')))
let tags = require(path.resolve(path.join(__dirname, 'tags.js')))
let users = require(path.resolve(path.join(__dirname, 'users.js')))

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
    let dbConfig = require(path.resolve('./src/server/config/database.js'))[dbEnv]
    if (dbConfig.dialect === 'mysql') {
      // prevent remote db access encounter timeout error on large file transfers
      dbConfig.pool.idle = parseInt(process.env.MYSQL_LARGE_DATASET_POOL_IDLE)
      dbConfig.pool.acquire = parseInt(process.env.MYSQL_LARGE_DATASET_POOL_ACQUIRE)
    }
    // switch out the sequelize instance and initialize
    db.sequelize = new db.Sequelize(dbConfig)
    return db.sequelize
      .authenticate() // verify db connection
      .catch((error) => {
        logging(error, 'database not connected')
        return Promise.reject(error)
      })
      .then(() => {
        // start the reset process with disabling the database constraints
        return disableConstraint(dbConfig.dialect)
      })
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
            .then(() => countries(db.Countries, db.Flags))
            .then(() => offices(db.Offices, db.Flags))
            .then(() => users(db.Users))
            .then(() => photos(db.Photos, db.Products, db.Series))
            .then(() => carousels(db.Carousels))
            .catch((error) => {
              logging.error(error, '預設資料載入失敗...')
              return Promise.reject(error)
            })
        }
      })
      .then(() => {
        logging.warning('資料庫重設，並已完成預設資料載入...')
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
