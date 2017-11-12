const fs = require('fs-extra')

const logging = require('../logging')

module.exports = (db) => {
  return fs
    .readdir(db.modelPath)
    .then((fileList) => {
      db.fileList = fileList.filter(fileName => {
        return ((fileName.indexOf('.') !== 0) && (fileName.slice(-3) === '.js'))
      })
      db.modelList = []
      db.fileList.forEach((fileName) => {
        db.modelList.push(fileName.slice(0, -3).charAt(0).toUpperCase() + fileName.slice(0, -3).slice(1))
      })
      return Promise.resolve()
    })
    .catch((error) => {
      logging.error(error, '資料表模板路徑讀取失敗...')
      return Promise.reject(error)
    })
}
