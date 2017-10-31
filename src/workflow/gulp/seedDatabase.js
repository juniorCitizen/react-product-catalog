import { argv } from 'yargs'
// import Promise from 'bluebird'

import db from '../../server/controllers/database/database'
import logging from '../../server/controllers/logging'

import series from '../backup/defaultData/series'

require('dotenv').config()

const databaseSetting = argv['setting'] || 'development'

module.exports = () => {
  let dbConfig = require('../../server/config/database')[databaseSetting]
  db.sequelize = new db.Sequelize(dbConfig) // switch out the sequelize instance

  return (done) => {
    return db.initialize()
      .then(() => {
        return db.Series.bulkCreate(series)
      })
      .then(() => {
        return db.Series.findAndCount()
      })
      .spread(seriesCount => seriesCount)
      .then((seriesCount) => {
        logging.warning(seriesCount)
        return Promise.resolve()
      })
      // .then(() => {
      //   return Promise.resolve()
      // })
      .then(() => {
        return done()
      })
      .catch((error) => {
        logging.error(error, 'db.initialize() error')
        return done(error)
      })
  }
}
