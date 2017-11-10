import del from 'del'

const logging = require('../../server/controllers/logging')

module.exports = () => {
  return (done) => {
    return del(['./**/*.log'], { dryRun: true })
      .then((candidates) => {
        logging.warning('以下記錄檔即將被刪除')
        logging.warning(candidates.join('\n'))
        return Promise.resolve(candidates)
      })
      .then((candidates) => {
        return del(candidates)
      })
      .then(() => {
        logging.console('記錄檔清除... 完成')
        return done()
      })
      .catch((error) => {
        logging.error(error, '記錄檔清除... 失敗')
        return done(error)
      })
  }
}
