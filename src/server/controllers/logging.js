const chalk = require('chalk')

module.exports = {
  console: messageToConsole,
  warning: warningToConsole,
  error: errorToConsole,
  reject: rejectPromise,
  resolve: resolvePromise
}

function messageToConsole (message) {
  return Object.prototype.toString.call(message) === '[object String]'
    ? console.log(message)
    : console.dir(message, { depth: null, colors: false })
}

function warningToConsole (warningMessage) {
  return Object.prototype.toString.call(warningMessage) === '[object String]'
    ? console.log(`${chalk.yellow.bold(warningMessage)}`)
    : console.dir(warningMessage, { depth: null, colors: true })
}

function errorToConsole (error, customMessage = null) {
  if (customMessage) {
    console.error(`${chalk.bgRed.bold(error.name)} - ${chalk.red.bold(customMessage)}`)
  } else {
    console.error(`${chalk.bgRed.bold(error.name)}`)
  }
  warningToConsole(error.message)
  warningToConsole(error.stack)
}

function rejectPromise (customMessage = null) {
  return (error) => {
    errorToConsole(error, customMessage)
    return Promise.reject(error)
  }
}

function resolvePromise (customMessage = null) {
  return (resolved) => {
    if (customMessage) warningToConsole(customMessage)
    return Promise.resolve(resolved)
  }
}
