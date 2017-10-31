const path = require('path')

const eVars = require('./eVars')
const logging = require('../controllers/logging')

const sqliteConfig = {
  dialect: 'sqlite',
  storage: path.resolve(path.join(eVars.SQLITE_PATH, `${eVars.SYS_REF}.db`)),
  logging: eVars.ORM_VERBOSE ? logging.warning : false,
  define: {
    underscored: false,
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
  }
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
    max: 5,
    min: 0,
    idle: 60000
  },
  define: {
    underscored: false,
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
  }
}

module.exports = {
  development: sqliteConfig,
  staging: mysqlConfig,
  production: mysqlConfig
}
