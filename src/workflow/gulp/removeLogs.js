import del from 'del'

const logging = require('../../server/controllers/logging')

module.exports = () => {
  return (done) => {
    return del(['./**/*.log'], { dryRun: true })
      // report a list of files being removed
      .then((candidates) => {
        if (candidates.length === 0) {
          logging.warning('未發現記錄檔案')
        } else {
          logging.warning('以下記錄檔即將被刪除')
          logging.warning(candidates.join('\n'))
        }
        return Promise.resolve(candidates)
      })
      // del is chosen over fs-extra.remove() due to the ability to work with globs
      .then(candidates => del(candidates))
      .then(logging.resolve('記錄檔清除作業... 完成'))
      .then(() => done())
      .catch(logging.reject('記錄檔清除作業... 失敗'))
      .catch(done)
  }
}
