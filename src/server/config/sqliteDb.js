// import chalk from 'chalk'
import path from 'path'

import eVars from './environment.js'

module.exports = { // connection object for sqlite database
  dialect: 'sqlite',
  storage: path.join(__dirname, `../${eVars.SYS_REF}.db`), // path to database file
  // timezone: eVars.TIMEZONE, // unsupported by SQLite
  // control if database operations are output with verbose messages
  logging: eVars.SEQUELIZE_VERBOSE ? (textString) => { console.log(require('chalk').red(textString)) } : false,
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
