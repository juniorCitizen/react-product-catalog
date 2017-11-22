const path = require('path')

const eVars = require('./eVars')
const logging = require('../controllers/logging')

const dropSchemaSequence = [
  'carousels',
  'registrations',
  'contacts',
  'companies',
  'countries',
  'flags',
  'labels',
  'products',
  'tags',
  'series',
  'photos'
]

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
  operatorsAliases: false,
  dropSchemaSequence
}

const mysqlConfig = {
  dialect: 'mysql',
  host: eVars.MYSQL_HOST,
  port: eVars.MYSQL_PORT,
  database: eVars.MYSQL_DB_NAME,
  username: eVars.MYSQL_ACCOUNT,
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
  operatorsAliases: false,
  dropSchemaSequence
}

module.exports = {
  development: sqliteConfig,
  staging: mysqlConfig,
  production: mysqlConfig
}
