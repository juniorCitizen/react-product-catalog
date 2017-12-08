const inquirer = require('inquirer')
const isemail = require('isemail')

const db = require('./database')
const encryption = require('./encryption')
const logging = require('./logging')

module.exports = {
  initialize: initialize
}

function initialize () {
  return db.Contacts
    .findAll({ where: { name: 'Administrator', admin: true } })
    .then(results => results.length !== 0
      ? Promise.resolve()
      : accountCreation())
    .then(() => Promise.resolve('administration account... verified'))
    .catch(logging.reject('Mandatory administration account missing'))
}

function accountCreation () {
  logging.warning('Adminstrator account does not exist...')
  let email = null
  let encrypted = null
  return consentToCreate()
    .then(response => {
      if (!response.consent) return Promise.reject(new Error())
      email = response.email
      return getPassword()
    })
    .then(response => {
      encrypted = encryption.sha512(response, encryption.saltGen(16))
      return finalConfirmation()
    })
    .then(response => {
      if (!response) return Promise.reject(new Error())
      return db.Contacts.create({
        email,
        name: 'Administrator',
        hashedPassword: encrypted.hashedPassword,
        salt: encrypted.salt,
        admin: true,
        active: true
      })
    })
    .catch(error => Promise.reject(error))
}

function consentToCreate () {
  return inquirer
    .prompt([{
      type: 'confirm',
      name: 'consent',
      message: 'Required admin account is missing, create it?',
      default: true
    }, {
      type: 'input',
      name: 'email',
      message: 'Enter email of admin account: ',
      filter: input => input.toLowerCase(),
      validate: input => isemail.validate(input) ? true : 'invalid email format',
      when: response => response.consent
    }])
    .then(response => Promise.resolve(response))
}

function validateLength (stringValue) {
  return (stringValue.length >= 8) && (stringValue.length <= 20)
}

function getPassword () {
  return inquirer
    .prompt([{
      type: 'password',
      name: 'password',
      message: 'Enter admin password: ',
      validate: input => validateLength(input) ? true : 'password length must be 8~20 characters'
    }, {
      type: 'password',
      name: 'confirmedPassword',
      message: 'Confirm and enter admin password again: ',
      validate: input => validateLength(input) ? true : 'password length must be 8~20 characters'
    }])
    .then(response => {
      if (response.password === response.confirmedPassword) {
        return Promise.resolve(response.password)
      } else {
        logging.warning('Passwords did not match...')
        return getPassword()
      }
    })
}

function finalConfirmation () {
  return inquirer
    .prompt([{
      type: 'confirm',
      name: 'finalConfirmation',
      message: 'Please confirm to create the administration account?',
      default: false
    }])
    .then(response => Promise.resolve(response.finalConfirmation))
}
