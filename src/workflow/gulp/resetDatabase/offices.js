import logging from '../../../server/controllers/logging'

require('dotenv').config()

module.exports = (Offices) => {
  let eVars = process.env
  let devMode = process.env.NODE_ENV === 'development'
  let websiteUrl = `${eVars.PROTOCOL}://${devMode ? eVars.LOCAL_DEV_DOMAIN : eVars.PROD_DOMAIN}:${eVars.PORT}/${eVars.SYS_REF}`
  let offices = [{
    id: 0,
    title: 'Gentry Way Co., Ltd.',
    address: 'No. 152, Wufu Road, Yanshui District, Tainan City, 737, Taiwan R.O.C.',
    countryId: 'TWN',
    telephone: '+886-(0)6-6529052',
    fax: '+886-(0)6-6527093',
    website: websiteUrl
  }, {
    id: 1,
    title: 'Gentry Hardware Products Co., Ltd.',
    address: 'No. 158, Dongcheng Rd., Dongsheng Town, Zhongshan, Guangdong, China',
    countryId: 'CHN',
    telephone: '+86-760-22229026 ~ 28',
    fax: '+86-760-22820916',
    website: websiteUrl
  }]
  return Offices
    .bulkCreate(offices)
    .then(() => {
      logging.warning('寫入辦公室/辦事處資料... 成功')
      return Promise.resolve()
    })
    .catch((error) => {
      logging.error(error, 'resetDatabase/offices.js errored...')
      return Promise.resolve(error)
    })
}
