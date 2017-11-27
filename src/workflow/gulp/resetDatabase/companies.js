import dotEnv from 'dotenv'
import uuidV4 from 'uuid/v4'

dotEnv.config()

const encryption = require('../../../server/controllers/encryption')
const logging = require('../../../server/controllers/logging')

module.exports = (Companies, Contacts) => {
  let eVars = process.env
  let devMode = process.env.NODE_ENV === 'development'
  let websiteUrl = `${eVars.PROTOCOL}://${devMode ? eVars.LOCAL_DEV_DOMAIN : eVars.PROD_DOMAIN}:${eVars.PORT}/${eVars.SYS_REF}`
  let taiwanOfficeId = uuidV4().toUpperCase()
  let chinaOfficeId = uuidV4().toUpperCase()
  let companies = [{
    id: taiwanOfficeId,
    title: 'Gentry Way Co., Ltd.',
    address: 'No. 152, Wufu Road, Yanshui District, Tainan City, 737, Taiwan R.O.C.',
    telephone: '+886-(0)6-6529052',
    fax: '+886-(0)6-6527093',
    website: websiteUrl,
    host: true,
    countryId: 'twn'
  }, {
    id: chinaOfficeId,
    title: 'Gentry Hardware Products Co., Ltd.',
    address: 'No. 158, Dongcheng Rd., Dongsheng Town, Zhongshan, Guangdong, China',
    telephone: '+86-760-22229026 ~ 28',
    fax: '+86-760-22820916',
    website: websiteUrl,
    host: true,
    countryId: 'chn'
  }]
  let contacts = [{
    email: 'admin@nowhere.com',
    name: 'Administrator',
    loginId: 'admin',
    admin: true
  }, {
    email: 'gentry88@ms46.hinet.net',
    name: 'General Service',
    companyId: taiwanOfficeId
  }, {
    email: 'david.tsai@gentry-way.com.tw',
    name: 'David Tsai',
    companyId: taiwanOfficeId,
    loginId: 'david',
    password: 'test',
    admin: true
  }, {
    email: 'cathy.liu@gentry-way.com.tw',
    name: 'Cathy Liu',
    companyId: taiwanOfficeId
  }, {
    email: 'candy.wu@gentry-way.com.tw',
    name: 'Candy Wu',
    companyId: taiwanOfficeId
  }, {
    email: 'gentry@vip.163.com',
    name: 'General Service',
    companyId: chinaOfficeId
  }, {
    email: 'altecqc@msn.com',
    name: 'Johnson Wu',
    companyId: chinaOfficeId
  }]
  contacts.forEach(contact => {
    // generate and encrypt a password for contacts with loginId's
    if ('loginId' in contact) {
      let encryptedPassword = encryption.sha512(
        (('password' in contact) && (contact.password !== null))
          ? contact.password
          : process.env.DEFAULT_CONTACT_PASSWORD,
        encryption.saltGen(16)
      )
      contact.hashedPassword = encryptedPassword.hashedPassword
      contact.salt = encryptedPassword.salt
    }
  })
  return Companies
    .bulkCreate(companies)
    .catch(logging.reject)
    .then(logging.resolve('建立辦公室/辦事處資料... 成功'))
    .then(() => Contacts.bulkCreate(contacts))
    .catch(logging.reject)
    .then(logging.resolve('建立聯絡人資料... 成功'))
    .catch(logging.reject('寫入辦公室/辦事處/聯絡人資料建立失敗'))
}
