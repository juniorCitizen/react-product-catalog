const path = require('path')

require('dotenv').config()

const accessPath = process.env.NODE_ENV === 'development'
  ? path.resolve('./src/server')
  : path.resolve('./dist')

const logging = require(path.join(accessPath, 'controllers/logging'))

module.exports = (db) => {
  db.modelList.forEach((modelName, index) => {
    db[modelName] = require(path.join(db.modelPath, db.fileList[index]))(db.sequelize, db.Sequelize)
    logging.console(`${modelName} 資料表註冊... 完成`)
  })
}
