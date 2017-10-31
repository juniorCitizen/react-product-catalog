const chalk = require('chalk')

module.exports = {
  console: messageToConsole,
  warning: warningToConsole,
  error: errorToConsole
}

function messageToConsole (message) {
  console.log(message)
}

function warningToConsole (warningMessage) {
  console.log(chalk.yellow.bold(warningMessage))
}

function errorToConsole (error, customMessage = '') {
  console.error(`${chalk.bgRed.bold(error.name)} - ${chalk.red.bold(customMessage)}`)
  messageToConsole(error.message)
  messageToConsole(error.stack)
}
