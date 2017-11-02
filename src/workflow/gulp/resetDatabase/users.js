import encryption from '../../../server/controllers/encryption'
import logging from '../../../server/controllers/logging'

const DEFAULT_USER_PASSWORD = '0000'

module.exports = (Users) => {
  let users = [{
    email: 'gentry88@ms46.hinet.net',
    name: 'General Service',
    officeId: 0,
    loginId: 'gentryWay',
    password: null,
    salt: null
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
    officeId: 0,
    loginId: 'cathy',
    password: null,
    salt: null
  }, {
    email: 'candy.wu@gentry-way.com.tw',
    name: 'Candy Wu',
    officeId: 0,
    loginId: 'candy',
    password: null,
    salt: null
  }, {
    email: 'gentry@vip.163.com',
    name: 'General Service',
    officeId: 1,
    loginId: 'gentryHardware',
    password: null,
    salt: null
  }, {
    email: 'altecqc@msn.com',
    name: 'Johnson Wu',
    officeId: 1,
    loginId: 'johnson',
    password: null,
    salt: null
  }]

  users.forEach((user) => {
    let encryptedPassword = encryption.sha512(
      (user.password === null) ? DEFAULT_USER_PASSWORD : user.password,
      encryption.saltGen(16)
    )
    user.password = encryptedPassword.passwordHash
    user.salt = encryptedPassword.salt
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
