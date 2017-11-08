const path = require('path')

require('dotenv').config()

const accessPath = process.env.NODE_ENV === 'development'
  ? path.resolve('./src/server')
  : path.resolve('./dist')

const eVars = require(path.join(accessPath, 'config/eVars'))
const logging = require(path.join(accessPath, 'controllers/logging'))

const sqliteConfig = {
  dialect: 'sqlite',
  storage: path.resolve(path.join(eVars.SQLITE_PATH, `${eVars.SYS_REF}.db`)),
  logging: eVars.ORM_VERBOSE ? logging.warning : false,
  define: {
    underscored: false,
    freezeTableName: true,
    timestamps: false,
    paranoid: false,
    createdAt: null, // 'createdAt',
    updatedAt: null, // 'updatedAt',
    deletedAt: null // 'deletedAt'
  },
  operatorsAliases: false
}

const mysqlConfig = {
  dialect: 'mysql',
  host: eVars.MYSQL_HOST,
  port: eVars.MYSQL_PORT,
  database: eVars.MYSQL_DB_NAME,
  username: eVars.MYSQL_USER,
  password: eVars.MYSQL_PASS,
  logging: eVars.ORM_VERBOSE ? logging.warning : false,
  timezone: eVars.TIMEZONE,
  pool: {
    max: 5, // default: 5
    min: 0, // default: 0
    idle: 10000, // default: 10000
    acquire: 10000, // default: 10000
    evict: 10000, // default: 10000
    retry: { max: 3 }
  },
  define: {
    underscored: false,
    freezeTableName: true,
    timestamps: false,
    paranoid: false,
    createdAt: null, // 'createdAt',
    updatedAt: null, // 'updatedAt',
    deletedAt: null // 'deletedAt'
  },
  operatorsAliases: false
}

module.exports = {
  development: sqliteConfig,
  staging: mysqlConfig,
  production: mysqlConfig
}
