import encryption from '../../../server/controllers/encryption'
import logging from '../../../server/controllers/logging'

require('dotenv').config()

module.exports = (Users) => {
  let users = [{
    email: 'gentry88@ms46.hinet.net',
    name: 'General Service',
    officeId: 0
  }, {
    email: 'david.tsai@gentry-way.com.tw',
    name: 'David Tsai',
    officeId: 0,
    loginId: 'david',
    password: null,
    salt: null,
    admin: true
  }, {
    email: 'cathy.liu@gentry-way.com.tw',
    name: 'Cathy Liu',
    officeId: 0
  }, {
    email: 'candy.wu@gentry-way.com.tw',
    name: 'Candy Wu',
    officeId: 0
  }, {
    email: 'gentry@vip.163.com',
    name: 'General Service',
    officeId: 1
  }, {
    email: 'altecqc@msn.com',
    name: 'Johnson Wu',
    officeId: 1
  }, {
    email: 'nobody@nowhere.com',
    name: '無名氏'
  }, {
    email: 'admin@nowhere.com',
    name: 'administrator',
    loginId: 'admin'
  }]

  users.forEach((user) => {
    // if use has loginId property, create and encrypt a password (preset or default)
    if (user.hasOwnProperty('loginId')) {
      let encryptedPassword = encryption.sha512(
        (user.hasOwnProperty('password') && (user.password !== null)) ? user.password : process.env.DEFAULT_USER_PASSWORD,
        encryption.saltGen(16)
      )
      user.password = encryptedPassword.passwordHash
      user.salt = encryptedPassword.salt
      user.admin = true
    } else {
      user.admin = false
    }
  })

  return Users
    .bulkCreate(users)
    .then(() => {
      logging.warning('寫入使用者資料... 成功')
      return Promise.resolve()
    })
    .catch((error) => {
      logging.error(error, 'resetDatabase/users.js errored...')
      return Promise.resolve(error)
    })
}
