const path = require('path')

const eVars = require('../../config/eVars')
const logging = require('../../controllers/logging')

module.exports = (db) => {
  db.modelList.forEach((modelName, index) => {
    db[modelName] = require(path.join(db.modelPath, db.fileList[index]))(db.sequelize, db.Sequelize)
    if (eVars.ORM_VERBOSE) logging.console(`${modelName} 資料表註冊... 完成`)
  })
}
