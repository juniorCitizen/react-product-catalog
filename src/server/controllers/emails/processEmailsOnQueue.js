const path = require('path')
const Promise = require('bluebird')

require('dotenv').config()

const accessPath = process.env.NODE_ENV === 'development'
  ? path.resolve('./src/server')
  : path.resolve('./dist')

const db = require(path.join(accessPath, 'controllers/database'))

module.exports = (emailQueue, updateAction, sourceRecords) => {
  if (emailQueue.length > 0) {
    return Promise
      .each(emailQueue, async (emailInfo, noticeIndex) => {
        await db.Registrations.update(updateAction, {
          where: { id: sourceRecords[noticeIndex].id }
        })
      })
      .then(() => {
        return Promise.resolve(`${emailQueue.length} email(s) sent...`)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  } else {
    return Promise.resolve('no emails on queue...')
  }
}
