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
    timestamps: false,
    paranoid: false,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
  }
}

const mysqlConfig = {
  dialect: 'mysql',
  host: eVars.MYSQl_HOST,
  port: eVars.MYSQl_PORT,
  database: eVars.MYSQl_NAME,
  username: eVars.MYSQl_USER,
  password: eVars.MYSQl_PASS,
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
    timestamps: false,
    paranoid: false,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
  }
}

module.exports = (() => {
  switch (eVars.USE_DATABASE) {
    case 'development':
      return sqliteConfig
    case 'staging':
      return mysqlConfig
    case 'production':
      return mysqlConfig
    default:
      return sqliteConfig
  }
})()
