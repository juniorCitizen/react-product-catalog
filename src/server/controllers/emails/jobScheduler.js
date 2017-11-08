const path = require('path')
const Promise = require('bluebird')

require('dotenv').config()

const accessPath = process.env.NODE_ENV === 'development'
  ? path.resolve('./src/server')
  : path.resolve('./dist')

const db = require(path.join(accessPath, 'controllers/database'))
const logging = require(path.join(accessPath, 'controllers/logging'))

const contactByEmail = require(path.join(__dirname, 'contactByEmail'))
const processEmailsOnQueue = require(path.join(__dirname, 'processEmailsOnQueue'))
const registrationAlerts = require(path.join(__dirname, 'registrationAlerts'))

module.exports = () => {
  logging.warning('Email broadcasting job triggered...')
  let jobList = [{
    searchCriteria: {
      where: { notified: false },
      include: [{ model: db.Products }, { model: db.Countries }]
    },
    processor: registrationAlerts,
    updateAction: { notified: true }
  }, {
    searchCriteria: {
      where: { contacted: false },
      include: [{
        model: db.Products,
        include: [{
          model: db.Photos,
          attributes: { exclude: ['data'] }
        }]
      }],
      order: [[db.Products, 'code']]
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
          pendingEmails.push(job.processor(pendingRecord))
        })
        return processEmailsOnQueue(pendingEmails, job.updateAction, pendingRecords)
      })
      .then((message) => {
        return Promise.resolve(message)
      })
      .catch((error) => {
        logging.error(error, '/controllers/emails/jobScheduler.js errored')
        return Promise.reject(error)
      })
  })
}
