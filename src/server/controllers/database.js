const dotEnv = require('dotenv')
const path = require('path')
const Promise = require('bluebird')
const Sequelize = require('sequelize')

dotEnv.config()
const dbConfig = require('../config/database')[process.env.USE_DATABASE]
const logging = require('../controllers/logging')

const verifyConnection = require('./database/verifyConnection')
const dropAllSchemas = require('./database/dropAllSchema')
const generateModelList = require('./database/generateModelList')
const registerModels = require('./database/registerModels')
const syncModels = require('./database/syncModels')
const buildAssociations = require('./database/buildAssociations')
const reSyncModels = require('./database/reSyncModels')
const defineScopes = require('./database/defineScopes')

const sequelize = new Sequelize(dbConfig)

const db = {
  modelPath: process.env.NODE_ENV === 'development'
    ? path.resolve('./src/server/models/definitions')
    : path.resolve('./dist/models/definitions'),
  fileList: [],
  modelList: [],
  Sequelize: Sequelize,
  sequelize: sequelize,
  initialize: initialize
}

module.exports = db // export the database access object

function initialize (force = null) {
  return verifyConnection(db)
    .then(() => dropAllSchemas(db.sequelize, dbConfig.dropSchemaSequence, force))
    .then(() => generateModelList(db))
    .then(() => registerModels(db))
    .then(() => syncModels(db, force))
    .then(() => buildAssociations(db))
    .then(() => reSyncModels(db, force))
    .then(() => defineScopes(db))
    .then(() => Promise.resolve('資料庫初始化... 成功'))
    .catch(logging.reject('資料庫初始化... 失敗'))
}
