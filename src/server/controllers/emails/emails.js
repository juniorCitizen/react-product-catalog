const cron = require('node-cron')
const path = require('path')

const jobScheduler = require(path.join(__dirname, 'jobScheduler'))

// how to use nodemailer with gmail
// https://www.youtube.com/watch?v=JJ44WA_eV8E

// how often to broadcast messages
// const BROADCAST_FREQUENCY = '0 * * * * *'
// const BROADCAST_FREQUENCY = '*/30 * * * * *'
const BROADCAST_FREQUENCY = '*/15 * * * * *'
// const BROADCAST_FREQUENCY = '*/10 * * * * *'
// const BROADCAST_FREQUENCY = '*/5 * * * * *'
// const BROADCAST_FREQUENCY = '* * * * * *'

class EmailBroadcastSystem {
  constructor (broadcastFrequency) {
    this.job = cron.schedule(broadcastFrequency, jobScheduler, false)
  }
  initialize () {
    this.job.start()
    return Promise.resolve('Email broadcast system initialized...')
  }
}

const emailBroadcastSystem = new EmailBroadcastSystem(BROADCAST_FREQUENCY)

module.exports = emailBroadcastSystem
