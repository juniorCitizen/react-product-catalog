import Promise from 'bluebird'

import db from '../../controllers/database/database'

module.exports = (emailQueue, updateAction, sourceRecords) => {
    if (emailQueue.length > 0) {
        return Promise
            .each(emailQueue, (emailInfo, noticeIndex) => {
                db.Registrations.update(updateAction, {
                    where: {
                        id: sourceRecords[noticeIndex].id
                    }
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
