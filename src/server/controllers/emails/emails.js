import cron from 'node-cron'

import jobScheduler from './jobScheduler'

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
    return new Promise((resolve, reject) => {
      this.job.start()
      resolve('Email broadcast system initialized...')
    })
  }
}

const emailBroadcastSystem = new EmailBroadcastSystem(BROADCAST_FREQUENCY)

module.exports = emailBroadcastSystem
