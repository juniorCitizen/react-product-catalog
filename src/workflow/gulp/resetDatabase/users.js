import encryption from '../../../server/controllers/encryption'

module.exports = (() => {
  let users = [{
    email: 'gentry88@ms46.hinet.net',
    name: 'General Service',
    officeLocationId: 0,
    loginId: 'gentryWay',
    password: null,
    salt: null
  }, {
    email: 'david.tsai@gentry-way.com.tw',
    name: 'David Tsai',
    officeLocationId: 0,
    loginId: 'david',
    password: null,
    salt: null,
    admin: true
  }, {
    email: 'cathy.liu@gentry-way.com.tw',
    name: 'Cathy Liu',
    officeLocationId: 0,
    loginId: 'cathy',
    password: null,
    salt: null
  }, {
    email: 'candy.wu@gentry-way.com.tw',
    name: 'Candy Wu',
    officeLocationId: 0,
    loginId: 'candy',
    password: null,
    salt: null
  }, {
    email: 'gentry@vip.163.com',
    name: 'General Service',
    officeLocationId: 1,
    loginId: 'gentryHardware',
    password: null,
    salt: null
  }, {
    email: 'altecqc@msn.com',
    name: 'Johnson Wu',
    officeLocationId: 1,
    loginId: 'johnson',
    password: null,
    salt: null
  }]

  users.forEach((user) => {
    let encryptedPassword = encryption.sha512(
      (user.password === null) ? '0000' : user.password,
      encryption.saltGen(16)
    )
    user.password = encryptedPassword.passwordHash
    user.salt = encryptedPassword.salt
  })

  return users
})()
