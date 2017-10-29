const chalk = require('chalk')

module.exports = {
  console: messageToConsole,
  error: errorToConsole
}

function messageToConsole (message) {
  console.log(message)
}

function errorToConsole () {
  return (error, customMessage = '') => {
    console.error(`${chalk.bgRed.bold(error.name)} - ${chalk.red.bold(customMessage)}`)
    messageToConsole(error.message)
    messageToConsole(error.stack)
  }
}
