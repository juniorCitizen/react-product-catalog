const chalk = require('chalk')

module.exports = {
  console: messageToConsole,
  warning: warningToConsole,
  error: errorToConsole,
  reject: rejectFailedPromise,
  resolve: resolvePromise
}

function messageToConsole (message) {
  console.log(message)
}

function warningToConsole (warningMessage) {
  console.log(chalk.yellow.bold(warningMessage))
}

function errorToConsole (error, customMessage = null) {
  if (customMessage) {
    console.error(`${chalk.bgRed.bold(error.name)} - ${chalk.red.bold(customMessage)}`)
  } else {
    console.error(`${chalk.bgRed.bold(error.name)}`)
  }
  messageToConsole(error.message)
  messageToConsole(error.stack)
}

function rejectFailedPromise (customMessage = null) {
  return (error) => {
    if (customMessage) {
      console.error(`${chalk.bgRed.bold(error.name)} - ${chalk.red.bold(customMessage)}`)
    } else {
      console.error(`${chalk.bgRed.bold(error.name)}`)
    }
    messageToConsole(error.message)
    messageToConsole(error.stack)
    return Promise.reject(error)
  }
}

function resolvePromise (customMessage = null) {
  return (resolved) => {
    if (customMessage) console.log(chalk.yellow.bold(customMessage))
    return Promise.resolve(resolved)
  }
}
