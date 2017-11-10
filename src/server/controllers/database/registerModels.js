const path = require('path')

const logging = require('../logging')

module.exports = (db) => {
  db.modelList.forEach((modelName, index) => {
    db[modelName] = require(path.join(db.modelPath, db.fileList[index]))(db.sequelize, db.Sequelize)
    logging.console(`${modelName} 資料表註冊... 完成`)
  })
}
