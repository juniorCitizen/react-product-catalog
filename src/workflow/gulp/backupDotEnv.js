import fs from 'fs-extra'
import path from 'path'

const logging = require('../../server/controllers/logging')

module.exports = () => {
  let backupPath = path.resolve('./backup/blank.env')
  let liveDotEnvPath = path.resolve('./.env')
  return (done) => {
    fs.readFile(liveDotEnvPath)
      .then((liveEnvContents) => {
        return Promise.resolve(liveEnvContents.toString().split('\n'))
      })
      .then((liveEnvEntries) => {
        let blankEnvContents = ''
        liveEnvEntries.pop() // remove '\n' at EOF
        liveEnvEntries.forEach((entry) => {
          blankEnvContents +=
            ((entry[0] === '#') || (entry.length === 1)
              ? (entry + '\n')
              : (entry.split('=')[0] + '=\n'))
        })
        return fs
          .outputFile(backupPath, blankEnvContents)
          .catch(error => Promise.reject(error))
      })
      .then((liveEnvEntries) => {
        logging.warning(`備份 .env 設定檔範本至 ${backupPath}... 完成`)
        return done()
      })
      .catch(error => {
        logging.error(error, '備份 .env 設定檔範本... 失敗')
        return done(error)
      })
  }
}
