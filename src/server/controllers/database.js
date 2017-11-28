const dotEnv = require('dotenv')
const path = require('path')
const Promise = require('bluebird')
const Sequelize = require('sequelize')

dotEnv.config()
const dbConfig = require('../config/database')[process.env.USE_DATABASE]
const logging = require('../controllers/logging')

const verifyConnection = require('./database/verifyConnection')
const dropAllSchemas = require('./database/dropAllSchema')
const prepModels = require('./database/prepModels')
const registerModels = require('./database/registerModels')
const syncModels = require('./database/syncModels')
const reSyncModels = require('./database/reSyncModels')

const sequelize = new Sequelize(dbConfig)

const db = {
  modelPath: process.env.NODE_ENV === 'development'
    ? path.resolve('./src/server/models')
    : path.resolve('./dist/models'),
  fileList: [],
  modelList: [],
  syncOps: [],
  Sequelize: Sequelize,
  sequelize: sequelize,
  initialize: initialize
}

module.exports = db // export the database access object

function initialize (force = null) {
  return verifyConnection(db)
    .then(() => {
      if (force) {
        return dropAllSchemas(db.sequelize, dbConfig.dropSchemaSequence)
      } else {
        return Promise.resolve()
      }
    })
    .then(() => prepModels(db))
    .then(() => {
      registerModels(db)
      return syncModels(db, force)
    })
    .then(() => {
      logging.console('配置 ORM 系統關聯...')
      // contact information relationships\
      db.Countries.hasMany(db.Companies, injectOptions('countryId', 'id'))
      db.Companies.belongsTo(db.Countries, injectOptions('countryId', 'id'))
      db.Companies.hasMany(db.Contacts, injectOptions('companyId', 'id'))
      db.Contacts.belongsTo(db.Companies, injectOptions('companyId', 'id'))
      // contacts and product information relationships
      db.Contacts.belongsToMany(db.Products, injectOptions('contactId', 'id', db.Registrations))
      db.Products.belongsToMany(db.Contacts, injectOptions('productId', 'id', db.Registrations))
      // product information relationships
      db.Series.hasMany(db.Products, injectOptions('seriesId', 'id'))
      db.Products.belongsTo(db.Series, injectOptions('seriesId', 'id'))
      db.Products.belongsToMany(db.Tags, injectOptions('productId', 'id', db.Labels))
      db.Tags.belongsToMany(db.Products, injectOptions('tagId', 'id', db.Labels))
      db.Series.hasMany(db.Series, Object.assign({ as: 'childSeries' }, injectOptions('parentSeriesId', 'id')))
      // photo data relationships
      db.Photos.belongsTo(db.Series, injectOptions('seriesId', 'id'))
      db.Series.hasOne(db.Photos, injectOptions('seriesId', 'id'))
      db.Products.hasMany(db.Photos, injectOptions('productId', 'id'))
      db.Photos.belongsTo(db.Products, injectOptions('productId', 'id'))
      return reSyncModels(db, force)
    })
    .then(() => Promise.resolve('資料庫初始化... 成功'))
    .catch((error) => {
      logging.error(error, '資料庫初始化... 失敗')
      return Promise.reject(error)
    })
}

function injectOptions (foreignKey, targetKey, throughModel = null, otherKey = null, constraints = true) {
  return Object.assign({
    constraints: constraints,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  }, {
    foreignKey: foreignKey,
    targetKey: targetKey
  },
  throughModel === null ? {} : { through: throughModel },
  otherKey === null ? {} : { otherKey: otherKey }
  )
}
