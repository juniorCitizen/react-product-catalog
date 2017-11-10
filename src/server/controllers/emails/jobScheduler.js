const db = require('../database')
const logging = require('../logging')

const contactByEmail = require('./contactByEmail')
const processEmailsOnQueue = require('./processEmailsOnQueue')
const registrationAlerts = require('./registrationAlerts')

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
