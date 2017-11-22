import dotEnv from 'dotenv'
import fs from 'fs-extra'
import path from 'path'

const logging = require('../../server/controllers/logging')

dotEnv.config()

module.exports = () => {
  return (done) => {
    let backupPath = path.resolve('./backup/blank.env')
    let liveDotEnvPath = path.resolve('./.env')
    return fs // make sure the directory exist before proceeding
      .ensureDir(process.env.SQLITE_PATH)
      .then(() => fs.readFile(liveDotEnvPath))
      .then((liveEnvContent) => Promise.resolve(liveEnvContent.toString().split('\n')))
      .then((liveEnvEntries) => {
        let blankEnvContents = ''
        liveEnvEntries.pop() // remove '\n' at EOF
        liveEnvEntries.forEach((entry) => {
          blankEnvContents +=
            (entry[0] === '#') || (entry.length === 1)
              ? (entry + '\n')
              : (entry.split('=')[0] + '=\n')
        })
        return Promise.resolve(blankEnvContents)
      })
      .then((blankEnvContents) => fs.outputFile(backupPath, blankEnvContents))
      .then(logging.resolve(`備份 .env 設定檔範本至 ${backupPath}... 完成`))
      .then(() => done())
      .catch(logging.reject('備份 .env 設定檔範本... 失敗'))
      .catch(done)
  }
}
