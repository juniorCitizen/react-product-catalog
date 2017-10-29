const fs = require('fs-extra')
const path = require('path')
const Promise = require('bluebird')
const Sequelize = require('sequelize')

const dbConfig = require('../../config/database')
const logging = require('../../controllers/logging')

const sequelize = new Sequelize(dbConfig)

const db = {
  modelPath: path.join(__dirname, '../../models'),
  syncOps: [],
  Sequelize: Sequelize,
  sequelize: sequelize,
  initialize: initialize
}

module.exports = db // export the database access object

function initialize () {
  return verifyConnection()
    .then(() => { return fs.readdir(db.modelPath) })
    .then((fileList) => {
      prepSyncOps(fileList, db.syncOps, { force: true })
      return executeSyncOps()
    })
    .then(() => {
      logging.console('配置 ORM 系統關聯...')
      db.Series.hasMany(db.Products, injectOptions('seriesId', 'id'))
      db.Products.belongsTo(db.Series, injectOptions('seriesId', 'id'))
      db.Products.hasOne(db.Descriptions, injectOptions('productId', 'id'))
      db.Products.hasMany(db.Photos, injectOptions('productId', 'id'))
      db.Products.belongsToMany(db.Registrations, injectOptions(
        'productId', 'id', db.InterestedProducts // ,'registrationId'
      ))
      db.Photos.belongsTo(db.Products, injectOptions('productId', 'id'))
      db.Descriptions.belongsTo(db.Products, injectOptions('productId', 'id'))
      db.Countries.hasMany(db.Registrations, injectOptions('countryId', 'id'))
      db.Countries.hasMany(db.OfficeLocations, injectOptions('countryId', 'id'))
      db.Registrations.belongsTo(db.Countries, injectOptions('countryId', 'id'))
      db.Registrations.belongsToMany(db.Products, injectOptions(
        'registrationId', 'id', db.InterestedProducts // ,'productId'
      ))
      db.OfficeLocations.belongsTo(db.Countries, injectOptions('countryId', 'id'))
      db.OfficeLocations.hasMany(db.Users, injectOptions('officeLocationId', 'id'))
      db.Users.belongsTo(db.OfficeLocations, injectOptions('officeLocationId', 'id'))
      return Promise.resolve()
    })
    .then(() => { return fs.readdir(db.modelPath) })
    .then((fileList) => {
      prepSyncOps(fileList, db.syncOps, { force: true })
      return executeSyncOps()
    })
    .then(() => {
      return Promise.resolve('資料庫初始化... 成功')
    })
    .catch((error) => {
      logging.error(error, '資料庫初始化... 失敗')
      return Promise.reject(error)
    })
}

function injectOptions (foreignKey, targetKey, throughModel = null, otherKey = null) {
  return Object.assign({
    constraints: true,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  }, {
    foreignKey: foreignKey,
    targetKey: targetKey
  }
    , throughModel === null ? {} : { through: throughModel }
    , otherKey === null ? {} : { otherKey: otherKey }
  )
}

function verifyConnection () {
  return db.sequelize
    .authenticate()
    .then(() => {
      logging.console('資料庫連線驗證... 成功')
      return Promise.resolve()
    })
    .catch((error) => {
      logging.error(error, '資料庫連線驗證... 失敗')
      return Promise.reject(error)
    })
}

function modelName (fileName) {
  return fileName.slice(0, -3).charAt(0).toUpperCase() + fileName.slice(0, -3).slice(1)
}

function prepSyncOps (fileList, syncOps, typeObj = null) {
  fileList
    .filter((file) => {
      return ((file.indexOf('.') !== 0) && (file.slice(-3) === '.js'))
    })
    .forEach((file) => {
      db[modelName(file)] = require(path.join(db.modelPath, file))(sequelize, Sequelize)
      syncOps.push(
        typeObj === null ? db[modelName(file)].sync() : db[modelName(file)].sync(typeObj)
      )
    })
}

function executeSyncOps () {
  return Promise
    .each(db.syncOps, (resolved, index) => {
      logging.console(`${resolved.name} 資料表同步... 完成`)
    })
    .catch((error) => {
      logging.error(error, '資料庫同步... 失敗')
    })
}
