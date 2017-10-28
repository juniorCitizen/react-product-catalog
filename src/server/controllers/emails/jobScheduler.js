import Promise from 'bluebird'

import db from '../../controllers/database/database'

import contactByEmail from './contactByEmail'
import processEmailsOnQueue from './processEmailsOnQueue'
import registrationAlerts from './registrationAlerts'

module.exports = () => {
  console.log('Email broadcast system job triggered...')
  let jobList = [{
    searchCriteria: {
      attributes: {
        exclude: ['updatedAt', 'deletedAt']
      },
      where: {
        notified: false
      },
      include: [{
        model: db.Products,
        through: {
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'deletedAt']
          }
        }
      }, {
        model: db.Countries,
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt']
        }
      }]
    },
    processor: registrationAlerts,
    updateAction: { notified: true }
  }, {
    searchCriteria: {
      attributes: {
        exclude: ['updatedAt', 'deletedAt']
      },
      where: {
        contacted: false
      },
      include: [{
        model: db.Products,
        through: {
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'deletedAt']
          }
        },
        include: [{
          model: db.Photos,
          attributes: {
            exclude: [
              'data',
              'createdAt',
              'updatedAt',
              'deletedAt'
            ]
          }
        }]
      }],
      order: [
        [db.Products, 'code']
      ]
    },
    processor: contactByEmail,
    updateAction: { contacted: true }
  }]
  jobList.forEach((job) => {
    db.Registrations
      .findAll(job.searchCriteria)
      .then((pendingRecords) => {
        let pendingEmails = []
        pendingRecords.forEach((pendingRecord) => {
          pendingEmails.push(
            job.processor(pendingRecord)
          )
        })
        return processEmailsOnQueue(pendingEmails, job.updateAction, pendingRecords)
      })
      .then((message) => {
        return Promise.resolve(message)
      })
      .catch((error) => {
        console.log(error.name)
        console.log(error.message)
        console.log(error.stack)
        return Promise.reject(error)
      })
  })
}
