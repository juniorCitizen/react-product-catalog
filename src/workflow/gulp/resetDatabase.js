import { argv } from 'yargs'
import fs from 'fs-extra'
import path from 'path'
import Promise from 'bluebird'
const dotEnv = require('dotenv')

const db = require('../../server/controllers/database')
const logging = require('../../server/controllers/logging')

const seed = argv['seed'] || false

const carousels = require('./resetDatabase/carousels')
const countries = require('./resetDatabase/countries')
const labels = require('./resetDatabase/labels')
const companies = require('./resetDatabase/companies')
const photos = require('./resetDatabase/photos')
const products = require('./resetDatabase/products')
const registrations = require('./resetDatabase/registrations')
const series = require('./resetDatabase/series')
const tags = require('./resetDatabase/tags')

dotEnv.config()

module.exports = () => {
  return (done) => {
    // get database configuration
    let dbConfig = require(path.resolve('./src/server/config/database.js'))[process.env.USE_DATABASE]
    if (dbConfig.dialect === 'mysql') {
      // prevent remote db access encounter timeout error on large file transfers
      dbConfig.pool.idle = parseInt(process.env.MYSQL_LARGE_DATASET_POOL_IDLE)
      dbConfig.pool.acquire = parseInt(process.env.MYSQL_LARGE_DATASET_POOL_ACQUIRE)
    }
    // create './database' directory (prevent linux based systems from skipping the script due to missing dir)
    if (dbConfig.dialect === 'sqlite') {
      fs.ensureDirSync(process.env.SQLITE_PATH, error => {
        logging.error(error, error.message)
        return done(error)
      })
    }
    // switch out the sequelize instance and initialize
    db.sequelize = new db.Sequelize(dbConfig)
    return db.sequelize
      // error out if connection not verified
      .authenticate().catch(logging.reject).catch(done)
      // disable foreign key constraint
      .then(() => disableConstraint(dbConfig.dialect))
      // init by force resetting
      .then(() => db.initialize({ force: true }))
      .then((message) => {
        logging.resolve(`${process.env.NODE_ENV} ${dbConfig.dialect} ${message}`)
        return Promise.resolve()
      })
      // re-enable database constraint
      .then(() => enableConstraint(dbConfig.dialect))
      .then(() => {
        if (!seed) {
          logging.warning('資料庫淨空完畢，未載入資料...')
          return done()
        } else {
          logging.warning('裝載基礎/預設資料...')
          return carousels(db.Carousels)
            .then(() => countries(db.Countries))
            .then(() => companies(db.Companies, db.Contacts))
            .then(() => series(db.Series))
            .then(() => products(db.Products, db.Series))
            .then(() => photos(db.Photos, db.Products, db.Series))
            .then(() => tags(db.Tags))
            .then(() => labels(db.Products, db.Tags))
            .then(() => registrations(
              db.Countries,
              db.Companies,
              db.Contacts,
              db.Products,
              db.Registrations
            ))
            .then(logging.resolve('資料庫重設，並已完成預設資料載入...'))
            .catch(logging.reject('預設資料載入失敗...'))
        }
      })
      .then(logging.resolve(`${process.env.NODE_ENV} ${dbConfig.dialect} 資料庫重設... 成功`))
      .then(() => done())
      // in case of error, enable the database constraints first
      .catch(error => enableConstraint(dbConfig.dialect)
        .then(() => Promise.reject(error))
        .catch(Promise.reject)
      )
      .catch(logging.reject(`${process.env.NODE_ENV} ${dbConfig.dialect} 資料庫重設... 失敗`))
      .catch(done)
  }
}

// disable constraint function
function disableConstraint (dialect) {
  let queryString = null
  if (dialect === 'sqlite') queryString = 'PRAGMA foreign_keys = OFF;'
  if (dialect === 'mysql') queryString = 'SET FOREIGN_KEY_CHECKS = 0;'
  if (queryString === null) return Promise.reject(new Error('無法辨識資料庫'))
  return db.sequelize
    .query(queryString)
    .then(logging.resolve('資料庫關聯性控管機制... 已暫停'))
    .catch(logging.reject('暫停資料庫關聯性控管機制失敗'))
}

// enable constraint function
function enableConstraint (dialect) {
  let queryString = null
  if (dialect === 'sqlite') queryString = 'PRAGMA foreign_keys = ON;'
  if (dialect === 'mysql') queryString = 'SET FOREIGN_KEY_CHECKS = 1;'
  if (queryString === null) return Promise.reject(new Error('無法辨識資料庫'))
  return db.sequelize
    .query(queryString)
    .then(logging.resolve('資料庫關聯性控管機制... 已啟動'))
    .catch(logging.reject('啟動資料庫關聯性控管機制失敗'))
}
